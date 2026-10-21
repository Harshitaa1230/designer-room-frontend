import { create } from 'zustand'

export type AuthStatus = 'restoring' | 'guest' | 'authed'

export interface UserProfile {
  id: string
  email: string
  name: string
  role: 'USER' | 'ADMIN'
  createdAt: string
}

interface AuthState {
  status: AuthStatus
  accessToken: string | null
  user: UserProfile | null
  setAccessToken: (token: string | null) => void
  setUser: (user: UserProfile | null) => void
  setAuthed: (token: string, user: UserProfile) => void
  setGuest: () => void
  reset: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'restoring',
  accessToken: null,
  user: null,
  setAccessToken: (accessToken) => set({ accessToken }),
  setUser: (user) => set({ user }),
  setAuthed: (accessToken, user) => set({ accessToken, user, status: 'authed' }),
  setGuest: () => set({ status: 'guest' }),
  reset: () => set({ accessToken: null, user: null, status: 'guest' }),
}))
