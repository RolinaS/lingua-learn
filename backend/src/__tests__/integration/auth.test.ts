import request from 'supertest'
import app from '@/index'
import * as authService from '@/services/auth.service'
import { AppError } from '@/middlewares/error.middleware'
import { prisma } from '@/config/database'
import { generateAccessToken } from '@/services/jwt.service'

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock('@/services/auth.service')
jest.mock('@/config/database', () => ({
  prisma: {
    user: { findUnique: jest.fn() },
  },
}))

const mockAuth = authService as jest.Mocked<typeof authService>
const userFindUnique = prisma.user.findUnique as jest.Mock

// ── Données de test ───────────────────────────────────────────────────────────

const VALID_REGISTER = {
  email: 'bob@example.com',
  username: 'bob123',
  password: 'Password1',
  nativeLanguage: 'FR',
  learningLanguage: 'EN',
}

const FAKE_AUTH_RESULT = {
  user: {
    id: 'user-1',
    email: 'bob@example.com',
    username: 'bob123',
    nativeLanguage: 'FR',
    learningLanguage: 'EN',
    theme: 'LIGHT',
    createdAt: new Date(),
  },
  accessToken: 'access-tok',
  refreshToken: 'refresh-tok',
}

beforeEach(() => jest.clearAllMocks())

// ── POST /api/auth/register ───────────────────────────────────────────────────

describe('POST /api/auth/register', () => {
  it('retourne 201 avec des données valides', async () => {
    mockAuth.register.mockResolvedValue(FAKE_AUTH_RESULT as never)
    const res = await request(app).post('/api/auth/register').send(VALID_REGISTER)
    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveProperty('accessToken')
  })

  it('retourne 422 avec un email invalide', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...VALID_REGISTER, email: 'pas-un-email' })
    expect(res.status).toBe(422)
    expect(res.body.success).toBe(false)
  })

  it('retourne 422 si le mot de passe est trop court (< 8 caractères)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...VALID_REGISTER, password: 'Ab1' })
    expect(res.status).toBe(422)
  })

  it('retourne 422 si le mot de passe n\'a pas de majuscule', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...VALID_REGISTER, password: 'password1' })
    expect(res.status).toBe(422)
  })

  it('retourne 422 si nativeLanguage === learningLanguage', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...VALID_REGISTER, learningLanguage: 'FR' })
    expect(res.status).toBe(422)
  })

  it('retourne 422 avec un username invalide (trop court)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...VALID_REGISTER, username: 'ab' })
    expect(res.status).toBe(422)
  })

  it('retourne 409 si le service lève une AppError 409 (email existant)', async () => {
    mockAuth.register.mockRejectedValue(new AppError('Email déjà utilisé.', 409))
    const res = await request(app).post('/api/auth/register').send(VALID_REGISTER)
    expect(res.status).toBe(409)
    expect(res.body.success).toBe(false)
  })
})

// ── POST /api/auth/login ──────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  it('retourne 200 avec des credentials valides', async () => {
    mockAuth.login.mockResolvedValue(FAKE_AUTH_RESULT as never)
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bob@example.com', password: 'Password1' })
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveProperty('refreshToken')
  })

  it('retourne 401 si le service lève AppError 401', async () => {
    mockAuth.login.mockRejectedValue(new AppError('Email ou mot de passe incorrect.', 401))
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bob@example.com', password: 'WrongPass1' })
    expect(res.status).toBe(401)
  })

  it('retourne 422 sans body', async () => {
    const res = await request(app).post('/api/auth/login').send({})
    expect(res.status).toBe(422)
  })
})

// ── POST /api/auth/refresh ────────────────────────────────────────────────────

describe('POST /api/auth/refresh', () => {
  it('retourne 200 avec un refresh token valide', async () => {
    mockAuth.refresh.mockResolvedValue({ accessToken: 'new-access', refreshToken: 'new-refresh' })
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'valid-token' })
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveProperty('accessToken')
  })

  it('retourne 401 si le service lève AppError 401', async () => {
    mockAuth.refresh.mockRejectedValue(new AppError('Token invalide.', 401))
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'bad-token' })
    expect(res.status).toBe(401)
  })

  it('retourne 422 sans refreshToken dans le body', async () => {
    const res = await request(app).post('/api/auth/refresh').send({})
    expect(res.status).toBe(422)
  })
})

// ── POST /api/auth/logout ─────────────────────────────────────────────────────

describe('POST /api/auth/logout', () => {
  it('retourne 200 avec un token valide', async () => {
    mockAuth.logout.mockResolvedValue(undefined)
    const token = generateAccessToken('user-1', 'bob@example.com')
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`)
      .send({ refreshToken: 'some-refresh-token' })
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  it('retourne 401 sans Authorization header', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .send({ refreshToken: 'some-refresh-token' })
    expect(res.status).toBe(401)
  })
})

// ── GET /api/auth/me ──────────────────────────────────────────────────────────

describe('GET /api/auth/me', () => {
  const FAKE_DB_USER = {
    id: 'user-1',
    email: 'bob@example.com',
    username: 'bob123',
    nativeLanguage: 'FR',
    learningLanguage: 'EN',
    theme: 'LIGHT',
    fontSize: 16,
    highContrast: false,
    reduceMotion: false,
    createdAt: new Date(),
    lastLoginAt: null,
  }

  it('retourne 200 avec les infos utilisateur si token valide', async () => {
    userFindUnique.mockResolvedValue(FAKE_DB_USER)
    const token = generateAccessToken('user-1', 'bob@example.com')
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.data.email).toBe('bob@example.com')
  })

  it('retourne 401 sans Authorization header', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
  })

  it('retourne 401 avec un token invalide', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer token.invalide.ici')
    expect(res.status).toBe(401)
  })
})
