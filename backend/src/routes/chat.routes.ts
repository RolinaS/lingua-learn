import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { getChatResponse, ScenarioId } from '@/services/chat.service'
import { AppError } from '@/middlewares/error.middleware'
import { AuthRequest } from '@/types'

export const chatRouter = Router()

// ─────────────────────────────────────────────
// POST /api/chat
// Envoie un message et reçoit une réponse IA
// ─────────────────────────────────────────────

chatRouter.post(
  '/',
  authMiddleware,
  [
    body('messages')
      .isArray({ min: 1 })
      .withMessage('messages doit être un tableau non vide'),
    body('messages.*.role')
      .isIn(['user', 'assistant'])
      .withMessage('role doit être "user" ou "assistant"'),
    body('messages.*.content')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('content ne peut pas être vide'),
    body('scenarioId')
      .isIn(['restaurant', 'voyage', 'shopping', 'hotel', 'medecin', 'libre'])
      .withMessage('scenarioId invalide'),
    body('learningLanguage')
      .isIn(['FR', 'EN', 'AR', 'ES', 'RU'])
      .withMessage('learningLanguage invalide'),
    body('nativeLanguage')
      .isIn(['FR', 'EN', 'AR', 'ES', 'RU'])
      .withMessage('nativeLanguage invalide'),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400)
      }

      const { messages, scenarioId, learningLanguage, nativeLanguage, categorySlug } = req.body

      // Limite l'historique envoyé à DeepSeek (coût + sécurité)
      const MAX_HISTORY = 20
      const trimmedMessages = messages.slice(-MAX_HISTORY)

      const reply = await getChatResponse({
        messages: trimmedMessages,
        scenarioId: scenarioId as ScenarioId,
        learningLanguage,
        nativeLanguage,
        categorySlug,
      })

      res.json({ success: true, data: { reply } })
    } catch (err) {
      next(err)
    }
  }
)