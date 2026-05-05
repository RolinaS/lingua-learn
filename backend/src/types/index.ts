import { Request } from 'express'
import { LanguageCode, Theme } from '@prisma/client'

// ─────────────────────────────────────────────
// Payload JWT
// ─────────────────────────────────────────────

export interface JwtPayload {
  sub: string   // userId
  email: string
  iat?: number
  exp?: number
}

// ─────────────────────────────────────────────
// Request authentifiée (après middleware auth)
// ─────────────────────────────────────────────

export interface AuthRequest extends Request {
  user: {
    id: string
    email: string
  }
}

// ─────────────────────────────────────────────
// Réponses API standardisées
// ─────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success: true
  data: T
  message?: string
}

export interface ApiError {
  success: false
  error: string
  details?: Record<string, string[]>
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError

// ─────────────────────────────────────────────
// DTOs — Auth
// ─────────────────────────────────────────────

export interface RegisterDto {
  email: string
  username: string
  password: string
  nativeLanguage: LanguageCode
  learningLanguage: LanguageCode
}

export interface LoginDto {
  email: string
  password: string
}

// ─────────────────────────────────────────────
// DTOs — User
// ─────────────────────────────────────────────

export interface UpdatePreferencesDto {
  nativeLanguage?: LanguageCode
  learningLanguage?: LanguageCode
  theme?: Theme
  fontSize?: number
  highContrast?: boolean
  reduceMotion?: boolean
}

// ─────────────────────────────────────────────
// DTOs — Progress
// ─────────────────────────────────────────────

export interface UpdateProgressDto {
  wordId: string
  correct: boolean
  responseTimeSecs?: number
}