import { Request, Response } from 'express'

export const notFoundMiddleware = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: `Route introuvable : ${req.method} ${req.originalUrl}`,
  })
}