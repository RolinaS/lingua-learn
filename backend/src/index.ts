import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { rateLimit } from 'express-rate-limit'

import { env } from '@/config/env'
import { authRouter } from '@/routes/auth.routes'
import { userRouter } from '@/routes/user.routes'
import { languageRouter } from '@/routes/language.routes'
import { wordRouter } from '@/routes/word.routes'
import { progressRouter } from '@/routes/progress.routes'
import { sessionRouter } from '@/routes/session.routes'
import { errorMiddleware } from '@/middlewares/error.middleware'
import { notFoundMiddleware } from '@/middlewares/notFound.middleware'

const app = express()

// ─────────────────────────────────────────────
// Middlewares globaux
// ─────────────────────────────────────────────

// Sécurité HTTP headers
app.use(helmet())

// CORS
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Logs HTTP
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// Rate limiting global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de requêtes, réessayez dans 15 minutes.' },
})
app.use('/api', limiter)

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────

app.use('/api/auth',      authRouter)
app.use('/api/users',     userRouter)
app.use('/api/languages', languageRouter)
app.use('/api/words',     wordRouter)
app.use('/api/progress',  progressRouter)
app.use('/api/sessions',  sessionRouter)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ─────────────────────────────────────────────
// Middlewares d'erreur (toujours en dernier)
// ─────────────────────────────────────────────

app.use(notFoundMiddleware)
app.use(errorMiddleware)

// ─────────────────────────────────────────────
// Démarrage
// ─────────────────────────────────────────────

app.listen(env.PORT, () => {
  console.log(`🚀 Backend Lingua-Learn démarré sur le port ${env.PORT}`)
  console.log(`📦 Environnement : ${env.NODE_ENV}`)
})

export default app