import { Router, Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'
import { LanguageCode } from '@prisma/client'
import * as authService from '@/services/auth.service'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { validateMiddleware } from '@/middlewares/validate.middleware'
import { AuthRequest } from '@/types'

export const authRouter = Router()

// ─────────────────────────────────────────────
// Règles de validation
// ─────────────────────────────────────────────

const registerRules = [
  body('email')
    .isEmail().withMessage('Email invalide.')
    .normalizeEmail(),
  body('username')
    .isLength({ min: 3, max: 30 }).withMessage('Le nom doit contenir entre 3 et 30 caractères.')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Caractères autorisés : lettres, chiffres, _ et -'),
  body('password')
    .isLength({ min: 8 }).withMessage('Mot de passe minimum 8 caractères.')
    .matches(/[A-Z]/).withMessage('Au moins une majuscule.')
    .matches(/[0-9]/).withMessage('Au moins un chiffre.'),
  body('nativeLanguage')
    .isIn(Object.values(LanguageCode)).withMessage('Langue natale invalide.'),
  body('learningLanguage')
    .isIn(Object.values(LanguageCode)).withMessage('Langue d\'apprentissage invalide.')
    .custom((val, { req }) => val !== req.body.nativeLanguage)
    .withMessage('La langue d\'apprentissage doit être différente de la langue natale.'),
]

const loginRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Mot de passe requis.'),
]

// ─────────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────────

authRouter.post(
  '/register',
  registerRules,
  validateMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.register(req.body)
      res.status(201).json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  }
)

// ─────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────

authRouter.post(
  '/login',
  loginRules,
  validateMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.login(req.body)
      res.json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  }
)

// ─────────────────────────────────────────────
// POST /api/auth/refresh
// ─────────────────────────────────────────────

authRouter.post(
  '/refresh',
  body('refreshToken').notEmpty().withMessage('Refresh token requis.'),
  validateMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.refresh(req.body.refreshToken)
      res.json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  }
)

// ─────────────────────────────────────────────
// POST /api/auth/logout
// ─────────────────────────────────────────────

authRouter.post(
  '/logout',
  authMiddleware as unknown as (req: Request, res: Response, next: NextFunction) => void,
  body('refreshToken').notEmpty(),
  validateMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authService.logout(req.body.refreshToken)
      res.json({ success: true, data: null, message: 'Déconnexion réussie.' })
    } catch (err) {
      next(err)
    }
  }
)

// ─────────────────────────────────────────────
// GET /api/auth/me
// ─────────────────────────────────────────────

authRouter.get(
  '/me',
  authMiddleware as unknown as (req: Request, res: Response, next: NextFunction) => void,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthRequest
      const user = await import('@/config/database').then(({ prisma }) =>
        prisma.user.findUnique({
          where: { id: authReq.user.id },
          select: {
            id: true, email: true, username: true,
            nativeLanguage: true, learningLanguage: true,
            theme: true, fontSize: true,
            highContrast: true, reduceMotion: true,
            createdAt: true, lastLoginAt: true,
          },
        })
      )
      res.json({ success: true, data: user })
    } catch (err) {
      next(err)
    }
  }
)