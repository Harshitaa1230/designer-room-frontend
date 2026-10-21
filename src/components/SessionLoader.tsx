import { useEffect } from 'react'
import { restoreSession } from '@/lib/api'

/** Restores the session from the backend refresh cookie on app boot. */
export function SessionLoader() {
  useEffect(() => {
    void restoreSession()
  }, [])
  return null
}
