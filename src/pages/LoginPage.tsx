import { useState, type ReactNode } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import logo from '@/assets/logo.svg'
import { startGoogleLogin } from '@/lib/api'
import { rememberAuthRedirect, safeAuthRedirect } from '@/lib/authRedirect'
import { useAuthStore } from '@/store/auth'
import { FullScreenLoader, Spinner } from '@/components/LoadingState'

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
    <path
      fill="#FFC107"
      d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.9z"
    />
    <path
      fill="#FF3D00"
      d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.2 0 10-2 13.6-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.7-.4-3.9z"
    />
  </svg>
)

const ERROR_COPY: Record<string, string> = {
  'session-expired': 'Your session expired. Sign in again to continue.',
}

function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-8 shadow-2xl">
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-36 w-72 -translate-x-1/2 rounded-full bg-amber-600 opacity-30 blur-[60px] filter"
        aria-hidden="true"
      />
      <div className="relative">{children}</div>
    </div>
  )
}

export function LoginPage() {
  const status = useAuthStore((s) => s.status)
  const [searchParams] = useSearchParams()
  const [redirecting, setRedirecting] = useState(false)
  const error = searchParams.get('error')
  const redirect = safeAuthRedirect(searchParams.get('redirect'))

  if (status === 'authed') return <Navigate to={redirect} replace />
  if (status === 'restoring') return <FullScreenLoader label="Checking your session…" />

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg-page)] px-5 text-[var(--text-primary)]">
      <div
        className="pointer-events-none absolute -top-32 right-[-120px] h-[420px] w-[520px] rounded-full bg-[radial-gradient(ellipse_at_60%_30%,#ff7a29_0%,#ea580c_40%,transparent_70%)] opacity-50 blur-[80px] filter light:opacity-20"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[-160px] left-[-140px] h-[380px] w-[460px] rounded-full bg-[radial-gradient(circle_at_40%_60%,#c2410c_0%,transparent_70%)] opacity-40 blur-[90px] filter light:opacity-20"
        aria-hidden="true"
      />

      <AuthCard>
        <div className="mb-8 flex flex-col items-center text-center">
          <img src={logo} alt="" aria-hidden="true" className="mb-5 h-12 w-auto light:invert" />
          <h1 className="text-2xl font-medium tracking-tight text-[var(--text-primary)]">Sign in</h1>
          <p className="mt-2 max-w-[34ch] text-sm text-[var(--text-body)]">
            One account, the whole room. Authentication is handled entirely by Google — we never
            see your password.
          </p>
        </div>

        {error && ERROR_COPY[error] && (
          <p
            role="alert"
            className="mb-5 rounded-lg border border-[var(--border-accent)] bg-[var(--accent-soft)] px-3.5 py-2.5 text-[13px] text-[var(--accent-text)]"
          >
            {ERROR_COPY[error]}
          </p>
        )}

        <button
          type="button"
          onClick={() => {
            rememberAuthRedirect(redirect)
            setRedirecting(true)
            startGoogleLogin()
          }}
          disabled={redirecting}
          className="btn-3d inline-flex w-full items-center justify-center gap-3 px-6 py-3.5 text-sm disabled:cursor-wait disabled:opacity-70"
        >
          {redirecting ? (
            <>
              <Spinner />
              Redirecting to Google…
            </>
          ) : (
            <>
              <GoogleIcon />
              Continue with Google
            </>
          )}
        </button>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-[var(--text-muted)]">
          New here? Signing in creates your account automatically.
        </p>
      </AuthCard>
    </div>
  )
}
