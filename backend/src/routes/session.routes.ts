import { Router, Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'
import { LanguageCode, ExerciseType } from '@prisma/client'
import { prisma } from '@/config/database'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { validateMiddleware } from '@/middlewares/validate.middleware'
import { AuthRequest } from '@/types'

export const sessionRouter = Router()

// Toutes les routes sessions nécessitent d'être authentifié
sessionRouter.use(authMiddleware as unknown as (req: Request, res: Response, next: NextFunction) => void)

// ─────────────────────────────────────────────
// GET /api/sessions
// Historique des 20 dernières sessions
// ─────────────────────────────────────────────

sessionRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = (req as AuthRequest).user
    const sessions = await prisma.learningSession.findMany({
      where:   { userId: id },
      orderBy: { completedAt: 'desc' },
      take:    20,
    })
    res.json({ success: true, data: sessions })
  } catch (err) { next(err) }
})

// ─────────────────────────────────────────────
// POST /api/sessions
// Sauvegarder une session d'apprentissage
// Body : { languageCode, exerciseType,
//          totalWords, correctAnswers, durationSecs }
// ─────────────────────────────────────────────

sessionRouter.post(
  '/',
  [
    body('languageCode').isIn(Object.values(LanguageCode))
      .withMessage('Langue invalide.'),
    body('exerciseType').isIn(Object.values(ExerciseType))
      .withMessage('Type d\'exercice invalide.'),
    body('totalWords').isInt({ min: 1 })
      .withMessage('totalWords doit être un entier positif.'),
    body('correctAnswers').isInt({ min: 0 })
      .withMessage('correctAnswers doit être un entier positif ou zéro.'),
    body('durationSecs').isInt({ min: 1 })
      .withMessage('durationSecs doit être un entier positif.'),
  ],
  validateMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: userId } = (req as AuthRequest).user
      const { languageCode, exerciseType, totalWords, correctAnswers, durationSecs } = req.body

      // Calcul automatique du score en %
      const score = Math.round((correctAnswers / totalWords) * 100)

      const session = await prisma.learningSession.create({
        data: {
          userId,
          languageCode,
          exerciseType,
          totalWords,
          correctAnswers,
          score,
          durationSecs,
        },
      })

      res.status(201).json({ success: true, data: session })
    } catch (err) { next(err) }
  }
)