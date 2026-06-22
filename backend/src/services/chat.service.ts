import OpenAI from 'openai'
import { env } from '@/config/env'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type ScenarioId =
  | 'restaurant'
  | 'voyage'
  | 'shopping'
  | 'hotel'
  | 'medecin'
  | 'libre'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatRequest {
  messages: ChatMessage[]
  scenarioId: ScenarioId
  learningLanguage: string
  nativeLanguage: string
  categorySlug?: string
}

// ─────────────────────────────────────────────
// Scénarios
// ─────────────────────────────────────────────

const LANGUAGE_NAMES: Record<string, string> = {
  FR: 'français',
  EN: 'anglais',
  ES: 'espagnol',
  RU: 'russe',
  AR: 'arabe',
}

const SCENARIO_PROMPTS: Record<ScenarioId, (lang: string) => string> = {
  restaurant: (lang) => `Tu joues le rôle d'un serveur dans un restaurant typique du pays où l'on parle ${lang}. 
Tu parles UNIQUEMENT en ${lang} avec l'utilisateur. 
L'utilisateur est un apprenant qui essaie de pratiquer la langue.
Commence par accueillir le client et proposer la carte.
Si l'utilisateur fait une erreur de grammaire ou de vocabulaire, corrige-le subtilement en réutilisant la phrase correcte dans ta réponse, sans interrompre le roleplay.
Reste dans le scénario du restaurant jusqu'à la fin du repas.`,

  voyage: (lang) => `Tu joues le rôle d'un agent dans un aéroport ou une gare du pays où l'on parle ${lang}.
Tu parles UNIQUEMENT en ${lang} avec l'utilisateur.
L'utilisateur est un voyageur apprenant qui essaie de pratiquer la langue.
Commence par demander où l'utilisateur souhaite se rendre.
Si l'utilisateur fait une erreur, corrige-le discrètement dans ta réponse suivante.`,

  shopping: (lang) => `Tu joues le rôle d'un vendeur dans une boutique du pays où l'on parle ${lang}.
Tu parles UNIQUEMENT en ${lang} avec l'utilisateur.
L'utilisateur est un client apprenant qui essaie de pratiquer la langue.
Commence par accueillir le client et lui demander ce qu'il recherche.
Si l'utilisateur fait une erreur, réutilise la forme correcte naturellement dans ta réponse.`,

  hotel: (lang) => `Tu joues le rôle d'un réceptionniste d'hôtel dans un pays où l'on parle ${lang}.
Tu parles UNIQUEMENT en ${lang} avec l'utilisateur.
L'utilisateur est un voyageur apprenant qui essaie de pratiquer la langue.
Commence par accueillir le client à la réception et lui demander s'il a une réservation.
Corrige discrètement les erreurs en reformulant correctement dans tes réponses.`,

  medecin: (lang) => `Tu joues le rôle d'un médecin dans un cabinet médical du pays où l'on parle ${lang}.
Tu parles UNIQUEMENT en ${lang} avec l'utilisateur.
L'utilisateur est un patient apprenant qui essaie de pratiquer la langue.
Commence par accueillir le patient et lui demander l'objet de sa consultation.
Corrige discrètement les erreurs en reformulant correctement dans tes réponses.`,

  libre: (lang) => `Tu es un assistant conversationnel bienveillant pour aider à apprendre le ${lang}.
Tu parles PRINCIPALEMENT en ${lang}, mais tu peux alterner avec le français pour expliquer des points difficiles.
Engage une conversation naturelle et intéressante sur n'importe quel sujet.
Si l'utilisateur fait une erreur, corrige-le avec bienveillance en expliquant brièvement la règle.
Encourage l'utilisateur et valorise ses progrès.`,
}

// ─────────────────────────────────────────────
// Client DeepSeek (compatible OpenAI)
// ─────────────────────────────────────────────

const client = new OpenAI({
  apiKey: env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
})

// ─────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────

export async function getChatResponse(request: ChatRequest): Promise<string> {
  const { messages, scenarioId, learningLanguage, nativeLanguage } = request

  const langName     = LANGUAGE_NAMES[learningLanguage] ?? learningLanguage
  const nativeLangName = LANGUAGE_NAMES[nativeLanguage] ?? nativeLanguage

  const systemPrompt = `${SCENARIO_PROMPTS[scenarioId](langName)}

Informations sur l'apprenant :
- Langue maternelle : ${nativeLangName}
- Langue apprise : ${langName}

Règles importantes :
- Tes réponses doivent être courtes (2-4 phrases maximum) pour faciliter la pratique.
- Ne jamais sortir du rôle sauf si l'utilisateur écrit "/aide" pour demander de l'aide en français.
- Si l'utilisateur écrit "/aide", réponds en français pour expliquer ce qu'il aurait pu dire.
- Si l'utilisateur écrit "/stop", termine la conversation poliment en ${langName}.`

  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    max_tokens: 512,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
  })

  const content = response.choices[0]?.message?.content
  if (!content) throw new Error('Réponse vide de DeepSeek')
  return content
}