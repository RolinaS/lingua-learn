import { Router, Request, Response, NextFunction } from 'express'
import { prisma } from '@/config/database'

export const languageRouter = Router()

// ─────────────────────────────────────────────
// GET /api/languages
// Retourne les 5 langues supportées
// ─────────────────────────────────────────────

languageRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const languages = await prisma.language.findMany()
    res.json({ success: true, data: languages })
  } catch (err) { next(err) }
})