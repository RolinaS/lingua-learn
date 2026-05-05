import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { AppError } from '@/middlewares/error.middleware'

// ─────────────────────────────────────────────
// Middleware — Vérifie les erreurs de validation
// À placer après les règles express-validator
// ─────────────────────────────────────────────

export const validateMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const details = errors.array().reduce<Record<string, string[]>>((acc, err) => {
      const field = 'path' in err ? (err.path as string) : 'general'
      acc[field] = [...(acc[field] ?? []), err.msg]
      return acc
    }, {})

    return next(new AppError('Données invalides.', 422, details))
  }

  next()
}