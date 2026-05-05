import { Request, Response, NextFunction } from 'express'
import { env } from '@/config/env'

// ─────────────────────────────────────────────
// Classe d'erreur applicative
// ─────────────────────────────────────────────

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public details?: Record<string, string[]>
  ) {
    super(message)
    this.name = 'AppError'
    Error.captureStackTrace(this, this.constructor)
  }
}

// ─────────────────────────────────────────────
// Middleware d'erreur global Express
// ─────────────────────────────────────────────

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Erreur applicative connue
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error:   err.message,
      ...(err.details && { details: err.details }),
    })
    return
  }

  // Erreur Prisma — violation de contrainte unique
  if (err.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as unknown as { code: string; meta?: { target?: string[] } }
    if (prismaErr.code === 'P2002') {
      res.status(409).json({
        success: false,
        error: `La valeur du champ '${prismaErr.meta?.target?.join(', ')}' est déjà utilisée.`,
      })
      return
    }
  }

  // Erreur inconnue — ne pas exposer les détails en production
  console.error('❌ Erreur inattendue :', err)

  res.status(500).json({
    success: false,
    error: 'Une erreur interne est survenue.',
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}