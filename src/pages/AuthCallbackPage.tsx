import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { restoreSession } from '@/lib/api'
import { consumeAuthRedirect } from '@/lib/authRedirect'
import { trackEvent } from '@/lib/analytics'
import { FullScreenLoader } from '@/components/LoadingState'

export function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // restoreSession is single-flight: SessionLoader on boot shares this call,
    // so the refresh cookie is exchanged exactly once per page load.
    void (async () => {
      const ok = await restoreSession()
      if (ok) {
        trackEvent('login', { method: 'google' })
        navigate(consumeAuthRedirect(), { replace: true })
      } else {
        navigate('/login?error=session-expired', { replace: true })
      }
    })()
  }, [navigate])

  return <FullScreenLoader label="Completing sign-in…" />
}
