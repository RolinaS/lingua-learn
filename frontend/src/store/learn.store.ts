import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Word } from '@/types'

interface LearnSession {
  words:        Word[]
  current:      number
  score:        { correct: number; incorrect: number }
  language:     string
  categorySlug: string | null   // null = tous les mots
  startedAt:    string
}

interface LearnStore {
  session:      LearnSession | null
  startSession: (words: Word[], language: string, categorySlug: string | null) => void
  setPosition:  (current: number) => void
  addScore:     (correct: boolean) => void
  clearSession: () => void
  isExpired:    () => boolean
}

const SESSION_TTL_HOURS = 24

export const useLearnStore = create<LearnStore>()(
  persist(
    (set, get) => ({
      session: null,

      startSession: (words, language, categorySlug) => {
        set({
          session: {
            words,
            current: 0,
            score: { correct: 0, incorrect: 0 },
            language,
            categorySlug,
            startedAt: new Date().toISOString(),
          },
        })
      },

      setPosition: (current) => {
        const { session } = get()
        if (!session) return
        set({ session: { ...session, current } })
      },

      addScore: (correct) => {
        const { session } = get()
        if (!session) return
        set({
          session: {
            ...session,
            score: {
              correct:   correct ? session.score.correct + 1 : session.score.correct,
              incorrect: correct ? session.score.incorrect   : session.score.incorrect + 1,
            },
          },
        })
      },

      clearSession: () => set({ session: null }),

      isExpired: () => {
        const { session } = get()
        if (!session) return true
        const diff = (Date.now() - new Date(session.startedAt).getTime()) / (1000 * 60 * 60)
        return diff > SESSION_TTL_HOURS
      },
    }),
    {
      name: 'lingua-learn-session',
      partialize: (state) => ({ session: state.session }),
    }
  )
)