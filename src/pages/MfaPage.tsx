import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { KeyRound, ShieldCheck } from 'lucide-react'
import logo from '@/assets/logo.svg'
import { completeMfaSession, messageOf, totpChallenge, totpRecover } from '@/lib/api'
import { consumeAuthRedirect } from '@/lib/authRedirect'
import { Spinner } from '@/components/LoadingState'

type Mode = 'totp' | 'recovery'

export function MfaPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const mfaToken = searchParams.get('token')

  const [mode, setMode] = useState<Mode>('totp')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!mfaToken) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--bg-page)] px-5 text-center text-[var(--text-primary)]">
        <h1 className="text-xl font-medium">Missing MFA token</h1>
        <p className="max-w-[40ch] text-sm text-[var(--text-body)]">
          This link is only valid right after signing in with Google.
        </p>
        <Link to="/login" className="btn-3d px-6 py-3 text-sm">
          Back to sign in
        </Link>
      </div>
    )
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = code.trim()
    if (!trimmed || busy) return

    setBusy(true)
    setError(null)
    try {
      const accessToken =
        mode === 'totp'
          ? await totpChallenge(mfaToken, trimmed)
          : await totpRecover(mfaToken, trimmed)
      const ok = await completeMfaSession(accessToken)
      if (ok) navigate(consumeAuthRedirect(), { replace: true })
      else setError('Signed in, but loading your profile failed. Please try again.')
    } catch (err) {
      setError(messageOf(err, mode === 'totp' ? 'That code was not accepted.' : 'That recovery code was not accepted.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg-page)] px-5 text-[var(--text-primary)]">
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[380px] w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_50%_30%,#ff7a29_0%,#c2410c_45%,transparent_70%)] opacity-45 blur-[90px] filter light:opacity-15"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-8 shadow-2xl">
        <div className="mb-7 flex flex-col items-center text-center">
          <img src={logo} alt="" aria-hidden="true" className="mb-5 h-12 w-auto light:invert" />
          <h1 className="text-2xl font-medium tracking-tight">Two-factor check</h1>
          <p className="mt-2 max-w-[36ch] text-sm text-[var(--text-body)]">
            Your account is protected. Enter the code from your authenticator app to finish signing
            in.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-inset)] p-1 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setMode('totp')
              setError(null)
              setCode('')
            }}
            className={`flex items-center justify-center gap-1.5 rounded-md py-2 transition-colors ${
              mode === 'totp' ? 'bg-[var(--bg-inset-hover)] text-[var(--text-primary)] shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Authenticator
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('recovery')
              setError(null)
              setCode('')
            }}
            className={`flex items-center justify-center gap-1.5 rounded-md py-2 transition-colors ${
              mode === 'recovery'
                ? 'bg-[var(--bg-inset-hover)] text-[var(--text-primary)] shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
            Recovery code
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="mfa-code" className="mb-1.5 block text-xs font-medium text-[var(--text-body)]">
              {mode === 'totp' ? '6-digit code' : 'Recovery code'}
            </label>
            <input
              id="mfa-code"
              type="text"
              required
              autoFocus
              autoComplete="one-time-code"
              spellCheck={false}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={mode === 'totp' ? '123456' : 'xxxx-xxxx-xxxx'}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-inset)] px-3.5 py-2.5 text-center font-mono text-base tracking-[0.3em] text-[var(--text-primary)] placeholder-[var(--text-faint)] transition-colors focus:border-[var(--accent-text)] focus:ring-1 focus:ring-[var(--accent-text)] focus:outline-none"
            />
          </div>

          {error && (
            <p role="alert" className="text-[13px] text-[var(--accent-text)]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy || !code.trim()}
            className="btn-3d inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 text-sm disabled:cursor-wait disabled:opacity-70"
          >
            {busy && <Spinner />}
            {mode === 'totp' ? 'Verify and enter' : 'Use recovery code'}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-[var(--text-muted)]">
          Lost your device? Switch to a recovery code above.
        </p>
      </div>
    </div>
  )
}
