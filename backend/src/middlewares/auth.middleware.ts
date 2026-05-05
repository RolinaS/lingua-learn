import { Response, NextFunction } from 'express'
import { verifyAccessToken } from '@/services/jwt.service'
import { AuthRequest } from '@/types'
import { AppError } from '@/middlewares/error.middleware'

// ─────────────────────────────────────────────
// Middleware — Vérifie le token JWT dans le header
// Authorization: Bearer <token>
// ─────────────────────────────────────────────

export const authMiddleware = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError('Token d\'authentification manquant.', 401))
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = verifyAccessToken(token)
    req.user = { id: payload.sub, email: payload.email }
    next()
  } catch {
    next(new AppError('Token invalide ou expiré.', 401))
  }
}