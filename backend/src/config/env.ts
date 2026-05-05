import dotenv from 'dotenv'
dotenv.config()

// ─────────────────────────────────────────────
// Validation des variables d'environnement
// Le serveur refuse de démarrer si une variable
// obligatoire est manquante
// ─────────────────────────────────────────────

const required = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
] as const

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`❌ Variable d'environnement manquante : ${key}`)
  }
}

export const env = {
  NODE_ENV:               process.env.NODE_ENV ?? 'development',
  PORT:                   Number(process.env.PORT) || 5000,
  DATABASE_URL:           process.env.DATABASE_URL!,
  JWT_SECRET:             process.env.JWT_SECRET!,
  JWT_REFRESH_SECRET:     process.env.JWT_REFRESH_SECRET!,
  JWT_EXPIRES_IN:         process.env.JWT_EXPIRES_IN ?? '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  CORS_ORIGIN:            process.env.CORS_ORIGIN ?? 'http://localhost',
} as const

export type Env = typeof env