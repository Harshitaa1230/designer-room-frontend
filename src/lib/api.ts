import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore, type UserProfile } from '@/store/auth'

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean }

/**
 * Endpoints that resolve auth themselves: they are never replayed through the
 * 401 → refresh → retry cycle (refresh must not call itself, and TOTP
 * responses are failures of user input, not of the session).
 */
const NON_REFRESHABLE_PATHS = [
  '/auth/refresh',
  '/auth/totp/challenge',
  '/auth/totp/recover',
  '/auth/google',
]

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Refresh (single-flight, kept off the intercepted instance) ───────────────

let refreshInFlight: Promise<string | null> | null = null

async function postRefresh(): Promise<string | null> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const res = await axios.post<{ access_token: string }>(
        `${API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } },
      )
      return res.data.access_token
    } catch (error) {
      if (!axios.isAxiosError(error) || attempt === 2) return null

      const status = error.response?.status
      const retryable = !error.response || status === 429 || (status ?? 0) >= 500
      if (!retryable) return null

      const retryAfter = Number(error.response?.headers['retry-after'])
      const delay =
        status === 429
          ? Number.isFinite(retryAfter) && retryAfter > 0
            ? Math.min(retryAfter, 5) * 1000
            : 3000
          : 1000 * (attempt + 1)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
  return null
}

export function refreshAccessToken(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = postRefresh().finally(() => {
      refreshInFlight = null
    })
  }
  return refreshInFlight
}

// ── Session establishment ────────────────────────────────────────────────────

async function establishSession(token: string): Promise<boolean> {
  const store = useAuthStore.getState()
  store.setAccessToken(token)
  try {
    const { data } = await apiClient.get<UserProfile>('/users/me')
    useAuthStore.getState().setAuthed(token, data)
    return true
  } catch {
    useAuthStore.getState().reset()
    return false
  }
}

/**
 * Restores the session from the backend refresh cookie. Never redirects by
 * itself — callers (guards, the callback page) decide where a guest goes.
 * Concurrent callers share one in-flight refresh so the cookie is rotated once.
 */
let restoreInFlight: Promise<boolean> | null = null

export function restoreSession(): Promise<boolean> {
  if (!restoreInFlight) {
    restoreInFlight = (async () => {
      const token = await refreshAccessToken()
      if (!token) {
        useAuthStore.getState().reset()
        return false
      }
      return establishSession(token)
    })().finally(() => {
      restoreInFlight = null
    })
  }
  return restoreInFlight
}

// ── 401 handling: refresh once, retry once, else end the session ────────────

function redirectToLogin(): void {
  if (!window.location.pathname.startsWith('/login')) {
    window.location.assign('/login?error=session-expired')
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined
    const url = original?.url ?? ''
    const skip =
      !original ||
      error.response?.status !== 401 ||
      original._retried ||
      NON_REFRESHABLE_PATHS.some((path) => url.startsWith(path))

    if (skip) return Promise.reject(error)

    original._retried = true
    const token = await refreshAccessToken()

    if (!token) {
      useAuthStore.getState().reset()
      redirectToLogin()
      return Promise.reject(error)
    }

    useAuthStore.getState().setAccessToken(token)
    original.headers.Authorization = `Bearer ${token}`
    return apiClient.request(original)
  },
)

// ── Auth endpoints ───────────────────────────────────────────────────────────

export function startGoogleLogin(): void {
  window.location.assign(`${API_BASE_URL}/auth/google`)
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout')
}

export async function logoutAll(): Promise<void> {
  await apiClient.post('/auth/logout-all')
}

async function mfaExchange(path: '/auth/totp/challenge' | '/auth/totp/recover', mfaToken: string, code: string): Promise<string> {
  const { data } = await apiClient.post<{ access_token: string }>(path, { mfaToken, code })
  return data.access_token
}

export function totpChallenge(mfaToken: string, code: string): Promise<string> {
  return mfaExchange('/auth/totp/challenge', mfaToken, code)
}

export function totpRecover(mfaToken: string, code: string): Promise<string> {
  return mfaExchange('/auth/totp/recover', mfaToken, code)
}

export async function completeMfaSession(access_token: string): Promise<boolean> {
  return establishSession(access_token)
}

// ── Error helpers ────────────────────────────────────────────────────────────

export function statusOf(error: unknown): number | undefined {
  if (axios.isAxiosError(error)) return error.response?.status
  return undefined
}

export function messageOf(error: unknown, fallback = 'Something went wrong.'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] } | undefined
    if (typeof data?.message === 'string') return data.message
    if (Array.isArray(data?.message)) return data.message.join(' ')
    if (!error.response) return 'Cannot reach the server. Is the backend running?'
  }
  return fallback
}
