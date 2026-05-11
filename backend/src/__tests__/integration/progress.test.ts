import request from 'supertest'
import app from '@/index'
import { prisma } from '@/config/database'
import { generateAccessToken } from '@/services/jwt.service'

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock('@/config/database', () => ({
  prisma: {
    userProgress: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  },
}))

const progressMock = prisma.userProgress as jest.Mocked<typeof prisma.userProgress>

// ── Helpers ───────────────────────────────────────────────────────────────────

const USER_ID = 'user-uuid-progress'
const WORD_ID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'

function authHeader() {
  const token = generateAccessToken(USER_ID, 'user@example.com')
  return `Bearer ${token}`
}

const FAKE_PROGRESS = {
  id: 'prog-1',
  userId: USER_ID,
  wordId: WORD_ID,
  score: 100,
  reviewCount: 1,
  correctCount: 1,
  incorrectCount: 0,
  easeFactor: 2.6,
  interval: 3,
  nextReviewAt: new Date(),
  lastReviewedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
}

beforeEach(() => jest.clearAllMocks())

// ── GET /api/progress ─────────────────────────────────────────────────────────

describe('GET /api/progress', () => {
  it('retourne 200 avec la progression de l\'utilisateur', async () => {
    progressMock.findMany.mockResolvedValue([FAKE_PROGRESS] as never)
    const res = await request(app)
      .get('/api/progress')
      .set('Authorization', authHeader())
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('retourne 401 sans token', async () => {
    const res = await request(app).get('/api/progress')
    expect(res.status).toBe(401)
  })
})

// ── GET /api/progress/review ──────────────────────────────────────────────────

describe('GET /api/progress/review', () => {
  it('retourne 200 avec les mots dus à révision', async () => {
    progressMock.findMany.mockResolvedValue([FAKE_PROGRESS] as never)
    const res = await request(app)
      .get('/api/progress/review')
      .set('Authorization', authHeader())
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('retourne 401 sans token', async () => {
    const res = await request(app).get('/api/progress/review')
    expect(res.status).toBe(401)
  })
})

// ── POST /api/progress ────────────────────────────────────────────────────────

describe('POST /api/progress', () => {
  it('retourne 200 et applique SM-2 (réponse correcte)', async () => {
    progressMock.findUnique.mockResolvedValue(null) // première révision
    progressMock.upsert.mockResolvedValue(FAKE_PROGRESS as never)

    const res = await request(app)
      .post('/api/progress')
      .set('Authorization', authHeader())
      .send({ wordId: WORD_ID, correct: true })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)

    const upsertCall = progressMock.upsert.mock.calls[0][0]
    // Première révision correcte → easeFactor 2.6, interval 3
    expect(upsertCall.create.easeFactor).toBeCloseTo(2.6, 5)
    expect(upsertCall.create.interval).toBe(3)
  })

  it('retourne 200 et remet interval à 1 (réponse incorrecte)', async () => {
    progressMock.findUnique.mockResolvedValue(null) // première révision
    progressMock.upsert.mockResolvedValue({ ...FAKE_PROGRESS, interval: 1 } as never)

    const res = await request(app)
      .post('/api/progress')
      .set('Authorization', authHeader())
      .send({ wordId: WORD_ID, correct: false })

    expect(res.status).toBe(200)
    const upsertCall = progressMock.upsert.mock.calls[0][0]
    expect(upsertCall.create.interval).toBe(1)
  })

  it('retourne 422 avec un wordId non UUID', async () => {
    const res = await request(app)
      .post('/api/progress')
      .set('Authorization', authHeader())
      .send({ wordId: 'pas-un-uuid', correct: true })
    expect(res.status).toBe(422)
    expect(res.body.success).toBe(false)
  })

  it('retourne 422 avec correct non booléen', async () => {
    const res = await request(app)
      .post('/api/progress')
      .set('Authorization', authHeader())
      .send({ wordId: WORD_ID, correct: 'oui' })
    expect(res.status).toBe(422)
  })

  it('retourne 422 sans body', async () => {
    const res = await request(app)
      .post('/api/progress')
      .set('Authorization', authHeader())
      .send({})
    expect(res.status).toBe(422)
  })

  it('retourne 401 sans token', async () => {
    const res = await request(app)
      .post('/api/progress')
      .send({ wordId: WORD_ID, correct: true })
    expect(res.status).toBe(401)
  })
})
