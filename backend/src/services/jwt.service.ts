import jwt from 'jsonwebtoken'
import { env } from '@/config/env'
import { JwtPayload } from '@/types'

// ─────────────────────────────────────────────
// Génération des tokens
// ─────────────────────────────────────────────

export const generateAccessToken = (userId: string, email: string): string => {
  return jwt.sign(
    { sub: userId, email } satisfies JwtPayload,
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
  )
}

export const generateRefreshToken = (userId: string, email: string): string => {
  return jwt.sign(
    { sub: userId, email } satisfies JwtPayload,
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
  )
}

// ─────────────────────────────────────────────
// Vérification des tokens
// ─────────────────────────────────────────────

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload
}

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload
}

// ─────────────────────────────────────────────
// Calcul de la date d'expiration du refresh token
// ─────────────────────────────────────────────

export const getRefreshTokenExpiry = (): Date => {
  const days = parseInt(env.JWT_REFRESH_EXPIRES_IN.replace('d', '')) || 7
  const expiry = new Date()
  expiry.setDate(expiry.getDate() + days)
  return expiry
}