import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'
import { authApi } from '@/lib/api'

// ─────────────────────────────────────────────
// Store Auth — Zustand avec persistance
// ─────────────────────────────────────────────

interface AuthState {
  user:         User | null
  accessToken:  string | null
  refreshToken: string | null
  isLoading:    boolean
  isAuth:       boolean

  // Actions
  login:        (email: string, password: string) => Promise<void>
  register:     (data: RegisterData) => Promise<void>
  logout:       () => Promise<void>
  fetchMe:      () => Promise<void>
  updateUser:   (user: Partial<User>) => void
  clearAuth:    () => void
}

interface RegisterData {
  email: string
  username: string
  password: string
  nativeLanguage: string
  learningLanguage: string
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user:         null,
      accessToken:  null,
      refreshToken: null,
      isLoading:    false,
      isAuth:       false,

      // ── Login ──────────────────────────────
      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await authApi.login({ email, password })
          const { user, accessToken, refreshToken } = data.data

          // Stockage tokens dans localStorage pour l'intercepteur Axios
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', refreshToken)

          set({ user, accessToken, refreshToken, isAuth: true })
        } finally {
          set({ isLoading: false })
        }
      },

      // ── Register ───────────────────────────
      register: async (registerData) => {
        set({ isLoading: true })
        try {
          const { data } = await authApi.register(registerData)
          const { user, accessToken, refreshToken } = data.data

          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', refreshToken)

          set({ user, accessToken, refreshToken, isAuth: true })
        } finally {
          set({ isLoading: false })
        }
      },

      // ── Logout ─────────────────────────────
      logout: async () => {
        const { refreshToken } = get()
        try {
          if (refreshToken) await authApi.logout(refreshToken)
        } catch { /* Ignore les erreurs de logout */ }
        finally {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          set({ user: null, accessToken: null, refreshToken: null, isAuth: false })
        }
      },

      // ── Fetch profil ───────────────────────
      fetchMe: async () => {
        try {
          const { data } = await authApi.me()
          set({ user: data.data, isAuth: true })
        } catch {
          get().clearAuth()
        }
      },

      // ── Mise à jour utilisateur ────────────
      updateUser: (updates) => {
        const { user } = get()
        if (user) set({ user: { ...user, ...updates } })
      },

      // ── Nettoyage ──────────────────────────
      clearAuth: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        set({ user: null, accessToken: null, refreshToken: null, isAuth: false })
      },
    }),
    {
      name: 'lingua-learn-auth',
      // Ne persister que les tokens, pas le loading state
      partialize: (state) => ({
        accessToken:  state.accessToken,
        refreshToken: state.refreshToken,
        user:         state.user,
        isAuth:       state.isAuth,
      }),
    }
  )
)