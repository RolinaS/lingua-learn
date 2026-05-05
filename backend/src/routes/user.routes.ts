import { Router, Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'
import { LanguageCode, Theme } from '@prisma/client'
import { prisma } from '@/config/database'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { validateMiddleware } from '@/middlewares/validate.middleware'
import { AuthRequest } from '@/types'
import { AppError } from '@/middlewares/error.middleware'

export const userRouter = Router()

// Toutes les routes users nécessitent d'être authentifié
userRouter.use(authMiddleware as unknown as (req: Request, res: Response, next: NextFunction) => void)

// ─────────────────────────────────────────────
// GET /api/users/profile
// ─────────────────────────────────────────────

userRouter.get('/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = (req as AuthRequest).user
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true, email: true, username: true, avatarUrl: true,
        nativeLanguage: true, learningLanguage: true,
        theme: true, fontSize: true, highContrast: true, reduceMotion: true,
        createdAt: true, lastLoginAt: true,
      },
    })
    if (!user) throw new AppError('Utilisateur introuvable.', 404)
    res.json({ success: true, data: user })
  } catch (err) { next(err) }
})

// ─────────────────────────────────────────────
// PATCH /api/users/preferences
// ─────────────────────────────────────────────

const preferencesRules = [
  body('nativeLanguage').optional().isIn(Object.values(LanguageCode)),
  body('learningLanguage').optional().isIn(Object.values(LanguageCode)),
  body('theme').optional().isIn(Object.values(Theme)),
  body('fontSize').optional().isInt({ min: 14, max: 24 }),
  body('highContrast').optional().isBoolean(),
  body('reduceMotion').optional().isBoolean(),
]

userRouter.patch(
  '/preferences',
  preferencesRules,
  validateMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = (req as AuthRequest).user
      const updated = await prisma.user.update({
        where: { id },
        data: req.body,
        select: {
          theme: true, fontSize: true,
          highContrast: true, reduceMotion: true,
          nativeLanguage: true, learningLanguage: true,
        },
      })
      res.json({ success: true, data: updated, message: 'Préférences mises à jour.' })
    } catch (err) { next(err) }
  }
)

// ─────────────────────────────────────────────
// DELETE /api/users/account
// ─────────────────────────────────────────────

userRouter.delete('/account', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = (req as AuthRequest).user
    await prisma.user.delete({ where: { id } })
    res.json({ success: true, data: null, message: 'Compte supprimé.' })
  } catch (err) { next(err) }
})