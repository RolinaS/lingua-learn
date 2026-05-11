import { Request, Response, NextFunction } from 'express'
import { AppError, errorMiddleware } from '@/middlewares/error.middleware'

function mockRes(): Response {
  const res = {} as Response
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

const req = {} as Request
const next = jest.fn() as unknown as NextFunction

describe('AppError', () => {
  it('stocke le message et le statusCode', () => {
    const err = new AppError('Non trouvé.', 404)
    expect(err.message).toBe('Non trouvé.')
    expect(err.statusCode).toBe(404)
    expect(err.name).toBe('AppError')
  })

  it('utilise 500 comme statusCode par défaut', () => {
    const err = new AppError('Erreur.')
    expect(err.statusCode).toBe(500)
  })

  it('accepte des détails optionnels', () => {
    const err = new AppError('Invalide.', 422, { email: ['Email requis.'] })
    expect(err.details).toEqual({ email: ['Email requis.'] })
  })

  it('est une instance de Error', () => {
    expect(new AppError('Test')).toBeInstanceOf(Error)
  })
})

describe('errorMiddleware', () => {
  afterEach(() => jest.clearAllMocks())

  it('retourne le bon status et message pour une AppError', () => {
    const res = mockRes()
    errorMiddleware(new AppError('Non autorisé.', 401), req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Non autorisé.' })
  })

  it('inclut les details si présents dans AppError', () => {
    const res = mockRes()
    errorMiddleware(new AppError('Invalide.', 422, { email: ['Email invalide.'] }), req, res, next)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ details: { email: ['Email invalide.'] } })
    )
  })

  it('retourne 409 pour une violation de contrainte unique Prisma (P2002)', () => {
    const res = mockRes()
    // Simule PrismaClientKnownRequestError avec le bon constructor.name
    const PrismaError = class PrismaClientKnownRequestError extends Error {
      code = 'P2002'
      meta = { target: ['email'] }
    }
    const err = new PrismaError('Unique constraint failed')
    errorMiddleware(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }))
  })

  it('retourne 500 pour une erreur inconnue', () => {
    const res = mockRes()
    errorMiddleware(new Error('Erreur inconnue'), req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }))
  })
})
