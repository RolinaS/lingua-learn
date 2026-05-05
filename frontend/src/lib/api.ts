import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

// ─────────────────────────────────────────────
// Instance Axios principale
// ─────────────────────────────────────────────

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// ─────────────────────────────────────────────
// Intercepteur REQUEST — Injecte le JWT
// ─────────────────────────────────────────────

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─────────────────────────────────────────────
// Intercepteur RESPONSE — Refresh token auto
// ─────────────────────────────────────────────

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token!)
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config

    // Si 401 et pas déjà en train de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // File d'attente pendant le refresh
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        // Pas de refresh token → déconnexion
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken }
        )
        const { accessToken, refreshToken: newRefreshToken } = data.data

        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', newRefreshToken)

        processQueue(null, accessToken)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

// ─────────────────────────────────────────────
// Helpers API
// ─────────────────────────────────────────────

export const authApi = {
  register: (data: unknown) => api.post('/auth/register', data),
  login:    (data: unknown) => api.post('/auth/login', data),
  logout:   (refreshToken: string) => api.post('/auth/logout', { refreshToken }),
  refresh:  (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
  me:       () => api.get('/auth/me'),
}

export const userApi = {
  getProfile:        () => api.get('/users/profile'),
  updatePreferences: (data: unknown) => api.patch('/users/preferences', data),
  deleteAccount:     () => api.delete('/users/account'),
}

export const languageApi = {
  getAll: () => api.get('/languages'),
}

export const wordApi = {
  getAll: (params?: Record<string, unknown>) => api.get('/words', { params }),
  getById: (id: string) => api.get(`/words/${id}`),
}

export const progressApi = {
  getAll:    () => api.get('/progress'),
  getReview: () => api.get('/progress/review'),
  update:    (data: { wordId: string; correct: boolean }) => api.post('/progress', data),
}

export const sessionApi = {
  getAll: () => api.get('/sessions'),
  create: (data: unknown) => api.post('/sessions', data),
}

export default api