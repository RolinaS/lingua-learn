import { AppError } from '@/middlewares/error.middleware'

// ── Mocks déclarés avant les imports ──────────────────────────────────────────

jest.mock('@/config/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    refreshToken: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}))

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}))

// ── Imports après les mocks ────────────────────────────────────────────────────

import { prisma } from '@/config/database'
import bcrypt from 'bcryptjs'
import { register, login, refresh, logout } from '@/services/auth.service'
import { generateRefreshToken } from '@/services/jwt.service'

const userMock = prisma.user as jest.Mocked<typeof prisma.user>
const tokenMock = prisma.refreshToken as jest.Mocked<typeof prisma.refreshToken>
const hashMock = bcrypt.hash as jest.Mock
const compareMock = bcrypt.compare as jest.Mock

const FAKE_USER = {
  id: 'user-uuid-1',
  email: 'alice@example.com',
  username: 'alice',
  passwordHash: 'hashed_pw',
  nativeLanguage: 'FR' as const,
  learningLanguage: 'EN' as const,
  theme: 'LIGHT' as const,
  fontSize: 16,
  highContrast: false,
  reduceMotion: false,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  lastLoginAt: null,
}

beforeEach(() => jest.clearAllMocks())

// ── register ──────────────────────────────────────────────────────────────────

describe('register', () => {
  const dto = {
    email: 'alice@example.com',
    username: 'alice',
    password: 'Password1',
    nativeLanguage: 'FR' as const,
    learningLanguage: 'EN' as const,
  }

  it('crée un utilisateur et retourne user + accessToken + refreshToken', async () => {
    userMock.findUnique.mockResolvedValue(null)
    hashMock.mockResolvedValue('hashed_pw')
    userMock.create.mockResolvedValue(FAKE_USER as never)
    tokenMock.create.mockResolvedValue({} as never)

    const result = await register(dto)

    expect(result.user.email).toBe('alice@example.com')
    expect(result.accessToken).toBeDefined()
    expect(result.refreshToken).toBeDefined()
    expect(tokenMock.create).toHaveBeenCalledTimes(1)
  })

  it('lève AppError 409 si email déjà utilisé', async () => {
    userMock.findUnique.mockResolvedValueOnce(FAKE_USER as never)
    await expect(register(dto)).rejects.toMatchObject({ statusCode: 409, message: expect.stringContaining('email') })
  })

  it('lève AppError 409 si username déjà pris', async () => {
    userMock.findUnique
      .mockResolvedValueOnce(null)         // email → libre
      .mockResolvedValueOnce(FAKE_USER as never) // username → pris

    await expect(register(dto)).rejects.toMatchObject({ statusCode: 409 })
  })

  it('hash le mot de passe avec bcrypt (12 rounds)', async () => {
    userMock.findUnique.mockResolvedValue(null)
    hashMock.mockResolvedValue('hashed_pw')
    userMock.create.mockResolvedValue(FAKE_USER as never)
    tokenMock.create.mockResolvedValue({} as never)

    await register(dto)
    expect(hashMock).toHaveBeenCalledWith('Password1', 12)
  })
})

// ── login ─────────────────────────────────────────────────────────────────────

describe('login', () => {
  const dto = { email: 'alice@example.com', password: 'Password1' }

  it('retourne user + tokens pour des credentials valides', async () => {
    userMock.findUnique.mockResolvedValue(FAKE_USER as never)
    compareMock.mockResolvedValue(true)
    userMock.update.mockResolvedValue(FAKE_USER as never)
    tokenMock.create.mockResolvedValue({} as never)

    const result = await login(dto)
    expect(result.user.email).toBe('alice@example.com')
    expect(result.accessToken).toBeDefined()
    expect(result.refreshToken).toBeDefined()
  })

  it('lève AppError 401 si utilisateur inconnu', async () => {
    userMock.findUnique.mockResolvedValue(null)
    await expect(login(dto)).rejects.toMatchObject({ statusCode: 401 })
  })

  it('lève AppError 401 si mot de passe incorrect', async () => {
    userMock.findUnique.mockResolvedValue(FAKE_USER as never)
    compareMock.mockResolvedValue(false)
    await expect(login(dto)).rejects.toMatchObject({ statusCode: 401 })
  })

  it("ne renvoie pas le passwordHash dans la réponse", async () => {
    userMock.findUnique.mockResolvedValue(FAKE_USER as never)
    compareMock.mockResolvedValue(true)
    userMock.update.mockResolvedValue(FAKE_USER as never)
    tokenMock.create.mockResolvedValue({} as never)

    const result = await login(dto)
    expect(result.user).not.toHaveProperty('passwordHash')
  })
})

// ── refresh ───────────────────────────────────────────────────────────────────

describe('refresh', () => {
  it('retourne de nouveaux tokens et effectue la rotation', async () => {
    const token = generateRefreshToken(FAKE_USER.id, FAKE_USER.email)
    const stored = { token, userId: FAKE_USER.id, expiresAt: new Date(Date.now() + 86400_000), id: '1', createdAt: new Date() }

    tokenMock.findUnique.mockResolvedValue(stored as never)
    tokenMock.delete.mockResolvedValue({} as never)
    tokenMock.create.mockResolvedValue({} as never)

    const result = await refresh(token)
    expect(result.accessToken).toBeDefined()
    expect(result.refreshToken).toBeDefined()
    expect(tokenMock.delete).toHaveBeenCalledWith({ where: { token } })
    expect(tokenMock.create).toHaveBeenCalledTimes(1)
  })

  it('lève AppError 401 si le token est introuvable en base', async () => {
    const token = generateRefreshToken(FAKE_USER.id, FAKE_USER.email)
    tokenMock.findUnique.mockResolvedValue(null)
    await expect(refresh(token)).rejects.toMatchObject({ statusCode: 401 })
  })

  it('lève AppError 401 si le token est expiré en base', async () => {
    const token = generateRefreshToken(FAKE_USER.id, FAKE_USER.email)
    const stored = { token, userId: FAKE_USER.id, expiresAt: new Date(Date.now() - 1000), id: '1', createdAt: new Date() }
    tokenMock.findUnique.mockResolvedValue(stored as never)
    await expect(refresh(token)).rejects.toMatchObject({ statusCode: 401 })
  })
})

// ── logout ────────────────────────────────────────────────────────────────────

describe('logout', () => {
  it('supprime le refresh token', async () => {
    tokenMock.deleteMany.mockResolvedValue({ count: 1 })
    await logout('some-token')
    expect(tokenMock.deleteMany).toHaveBeenCalledWith({ where: { token: 'some-token' } })
  })
})
