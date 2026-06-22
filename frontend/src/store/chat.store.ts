import { create } from 'zustand'
import api from '@/lib/api'

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

export interface Scenario {
  id: ScenarioId
  label: string
  emoji: string
  description: string
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé'
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'restaurant',
    label: 'Au restaurant',
    emoji: '🍽️',
    description: 'Commandez un repas, demandez l\'addition...',
    difficulty: 'Débutant',
  },
  {
    id: 'voyage',
    label: 'En voyage',
    emoji: '✈️',
    description: 'Aéroport, gare, demander son chemin...',
    difficulty: 'Débutant',
  },
  {
    id: 'shopping',
    label: 'Shopping',
    emoji: '🛍️',
    description: 'Acheter des vêtements, négocier un prix...',
    difficulty: 'Intermédiaire',
  },
  {
    id: 'hotel',
    label: 'À l\'hôtel',
    emoji: '🏨',
    description: 'Check-in, demander des services...',
    difficulty: 'Intermédiaire',
  },
  {
    id: 'medecin',
    label: 'Chez le médecin',
    emoji: '🏥',
    description: 'Décrire des symptômes, prendre rendez-vous...',
    difficulty: 'Avancé',
  },
  {
    id: 'libre',
    label: 'Conversation libre',
    emoji: '💬',
    description: 'Discutez de n\'importe quel sujet...',
    difficulty: 'Intermédiaire',
  },
]

// ─────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────

interface ChatState {
  isOpen: boolean
  activeScenario: Scenario | null
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null

  openChat: (scenario: Scenario) => void
  closeChat: () => void
  sendMessage: (content: string, learningLanguage: string, nativeLanguage: string) => Promise<void>
  resetChat: () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  isOpen: false,
  activeScenario: null,
  messages: [],
  isLoading: false,
  error: null,

  openChat: (scenario) => {
    set({
      isOpen: true,
      activeScenario: scenario,
      messages: [],
      error: null,
    })
  },

  closeChat: () => {
    set({ isOpen: false, activeScenario: null, messages: [], error: null })
  },

  resetChat: () => {
    set({ messages: [], error: null })
  },

  sendMessage: async (content, learningLanguage, nativeLanguage) => {
    const { messages, activeScenario } = get()
    if (!activeScenario) return

    const userMessage: ChatMessage = { role: 'user', content }
    const updatedMessages = [...messages, userMessage]

    set({ messages: updatedMessages, isLoading: true, error: null })

    try {
      const response = await api.post<{ success: true; data: { reply: string } }>('/chat', {
        messages: updatedMessages,
        scenarioId: activeScenario.id,
        learningLanguage,
        nativeLanguage,
      })

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.data.data.reply,
      }

      set({
        messages: [...updatedMessages, assistantMessage],
        isLoading: false,
      })
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        'Erreur lors de la communication avec l\'IA'
      set({ isLoading: false, error: msg })
    }
  },
}))