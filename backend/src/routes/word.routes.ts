import { Router, Request, Response, NextFunction } from 'express'
import { query } from 'express-validator'
import { LanguageCode, Difficulty } from '@prisma/client'
import { prisma } from '@/config/database'
import { validateMiddleware } from '@/middlewares/validate.middleware'

export const wordRouter = Router()

// ─────────────────────────────────────────────
// GET /api/words
// Paramètres optionnels :
//   ?language=FR&category=greetings
//   &difficulty=BEGINNER&limit=20&page=1
// ─────────────────────────────────────────────

wordRouter.get(
  '/',
  [
    query('language').optional().isIn(Object.values(LanguageCode)),
    query('difficulty').optional().isIn(Object.values(Difficulty)),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('page').optional().isInt({ min: 1 }),
  ],
  validateMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const language   = req.query.language as LanguageCode | undefined
      const difficulty = req.query.difficulty as Difficulty | undefined
      const category   = req.query.category as string | undefined
      const limit      = Number(req.query.limit) || 20
      const page       = Number(req.query.page) || 1

      const [words, total] = await Promise.all([
        prisma.word.findMany({
          where: {
            ...(language   && { languageCode: language }),
            ...(difficulty && { difficulty }),
            ...(category   && { category: { slug: category } }),
          },
          include: { category: true },
          take: limit,
          skip: (page - 1) * limit,
          orderBy: { createdAt: 'asc' },
        }),
        prisma.word.count({
          where: {
            ...(language   && { languageCode: language }),
            ...(difficulty && { difficulty }),
          },
        }),
      ])

      res.json({
        success: true,
        data: { words, total, page, pages: Math.ceil(total / limit) },
      })
    } catch (err) { next(err) }
  }
)

// ─────────────────────────────────────────────
// GET /api/words/:id
// ─────────────────────────────────────────────

wordRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const word = await prisma.word.findUnique({
      where: { id: req.params.id },
      include: { category: true, language: true },
    })
    if (!word) {
      res.status(404).json({ success: false, error: 'Mot introuvable.' })
      return
    }
    res.json({ success: true, data: word })
  } catch (err) { next(err) }
})