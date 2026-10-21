import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { AuthorizationError } from '@/components/AuthorizationError'
import { FullScreenLoader } from '@/components/LoadingState'

export function RequireAuth({ children }: { children: ReactNode }) {
  const status = useAuthStore((s) => s.status)

  if (status === 'restoring') return <FullScreenLoader label="Restoring your session…" />
  if (status === 'guest') return <Navigate to="/login" replace />
  return children
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const status = useAuthStore((s) => s.status)
  const user = useAuthStore((s) => s.user)

  if (status === 'restoring') return <FullScreenLoader label="Restoring your session…" />
  if (status === 'guest') return <Navigate to="/login" replace />
  if (user?.role !== 'ADMIN') return <AuthorizationError />
  return children
}
