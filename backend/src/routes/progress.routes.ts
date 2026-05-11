import { Router, Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'
import { prisma } from '@/config/database'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { validateMiddleware } from '@/middlewares/validate.middleware'
import { AuthRequest } from '@/types'
import { computeSm2 } from '@/utils/sm2'

export const progressRouter = Router()

// Toutes les routes progress nécessitent d'être authentifié
progressRouter.use(authMiddleware as unknown as (req: Request, res: Response, next: NextFunction) => void)

// ─────────────────────────────────────────────
// GET /api/progress
// Progression globale de l'utilisateur
// ─────────────────────────────────────────────

progressRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = (req as AuthRequest).user
    const progress = await prisma.userProgress.findMany({
      where: { userId: id },
      include: { word: { include: { category: true } } },
      orderBy: { nextReviewAt: 'asc' },
    })
    res.json({ success: true, data: progress })
  } catch (err) { next(err) }
})

// ─────────────────────────────────────────────
// GET /api/progress/review
// Mots à réviser aujourd'hui (algorithme SM-2)
// ─────────────────────────────────────────────

progressRouter.get('/review', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = (req as AuthRequest).user
    const words = await prisma.userProgress.findMany({
      where: { userId: id, nextReviewAt: { lte: new Date() } },
      include: { word: { include: { category: true } } },
      orderBy: { nextReviewAt: 'asc' },
      take: 20,
    })
    res.json({ success: true, data: words })
  } catch (err) { next(err) }
})

// ─────────────────────────────────────────────
// POST /api/progress
// Mise à jour après un exercice (SM-2)
// Body : { wordId: string, correct: boolean }
// ─────────────────────────────────────────────

progressRouter.post(
  '/',
  [
    body('wordId').isUUID().withMessage('wordId doit être un UUID valide.'),
    body('correct').isBoolean().withMessage('correct doit être un booléen.'),
  ],
  validateMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: userId } = (req as AuthRequest).user
      const { wordId, correct } = req.body

      // Récupère la progression existante
      const existing = await prisma.userProgress.findUnique({
        where: { userId_wordId: { userId, wordId } },
      })

      const { newEaseFactor, newInterval, nextReviewAt: nextReview } = computeSm2(correct, existing)

      const progress = await prisma.userProgress.upsert({
        where:  { userId_wordId: { userId, wordId } },
        create: {
          userId,
          wordId,
          score:          correct ? 100 : 0,
          reviewCount:    1,
          correctCount:   correct ? 1 : 0,
          incorrectCount: correct ? 0 : 1,
          easeFactor:     newEaseFactor,
          interval:       newInterval,
          nextReviewAt:   nextReview,
          lastReviewedAt: new Date(),
        },
        update: {
          score:          correct ? 100 : Math.max(0, (existing?.score ?? 0) - 20),
          reviewCount:    { increment: 1 },
          correctCount:   correct ? { increment: 1 } : undefined,
          incorrectCount: !correct ? { increment: 1 } : undefined,
          easeFactor:     newEaseFactor,
          interval:       newInterval,
          nextReviewAt:   nextReview,
          lastReviewedAt: new Date(),
        },
      })

      res.json({ success: true, data: progress })
    } catch (err) { next(err) }
  }
)