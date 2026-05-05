import { PrismaClient } from '@prisma/client'
import { env } from '@/config/env'

// ─────────────────────────────────────────────
// Singleton Prisma
// Évite la création de multiples connexions
// en développement (hot-reload)
// ─────────────────────────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

export const prisma: PrismaClient =
  global.__prisma ??
  new PrismaClient({
    log: env.NODE_ENV === 'development'
      ? ['query', 'warn', 'error']
      : ['error'],
  })

if (env.NODE_ENV !== 'production') {
  global.__prisma = prisma
}