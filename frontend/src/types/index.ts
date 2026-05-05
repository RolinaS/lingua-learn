// ─────────────────────────────────────────────
// Types partagés — Frontend Lingua-Learn
// ─────────────────────────────────────────────

export type LanguageCode = 'FR' | 'EN' | 'AR' | 'ES' | 'RU'
export type Theme = 'LIGHT' | 'DARK' | 'OCEAN'
export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
export type ExerciseType = 'TRANSLATION' | 'MULTIPLE_CHOICE' | 'FILL_IN_BLANK' | 'LISTENING'

// ─────────────────────────────────────────────
// Utilisateur
// ─────────────────────────────────────────────

export interface User {
  id: string
  email: string
  username: string
  avatarUrl?: string
  nativeLanguage: LanguageCode
  learningLanguage: LanguageCode
  theme: Theme
  fontSize: number
  highContrast: boolean
  reduceMotion: boolean
  createdAt: string
  lastLoginAt?: string
}

// ─────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  username: string
  password: string
  nativeLanguage: LanguageCode
  learningLanguage: LanguageCode
}

// ─────────────────────────────────────────────
// Langues
// ─────────────────────────────────────────────

export interface Language {
  code: LanguageCode
  name: string
  nativeName: string
  flagEmoji: string
  rtl: boolean
}

// ─────────────────────────────────────────────
// Catégories & Mots
// ─────────────────────────────────────────────

export interface Category {
  id: string
  slug: string
  emoji: string
  orderIndex: number
  nameFr: string
  nameEn: string
  nameAr: string
  nameEs: string
  nameRu: string
}

export interface Word {
  id: string
  languageCode: LanguageCode
  categoryId: string
  category: Category
  term: string
  phonetic?: string
  audioUrl?: string
  imageUrl?: string
  difficulty: Difficulty
  translationFr: string
  translationEn: string
  translationAr: string
  translationEs: string
  translationRu: string
  exampleFr?: string
  exampleEn?: string
  exampleAr?: string
  exampleEs?: string
  exampleRu?: string
}

// ─────────────────────────────────────────────
// Progression
// ─────────────────────────────────────────────

export interface UserProgress {
  id: string
  userId: string
  wordId: string
  word: Word
  score: number
  reviewCount: number
  correctCount: number
  incorrectCount: number
  easeFactor: number
  interval: number
  nextReviewAt: string
  lastReviewedAt?: string
}

// ─────────────────────────────────────────────
// Sessions
// ─────────────────────────────────────────────

export interface LearningSession {
  id: string
  userId: string
  languageCode: LanguageCode
  exerciseType: ExerciseType
  totalWords: number
  correctAnswers: number
  score: number
  durationSecs: number
  completedAt: string
}

// ─────────────────────────────────────────────
// Réponses API
// ─────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true
  data: T
  message?: string
}

export interface ApiError {
  success: false
  error: string
  details?: Record<string, string[]>
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export interface PaginatedResponse<T> {
  words: T[]
  total: number
  page: number
  pages: number
}