import { ShieldAlert } from 'lucide-react'

interface AuthorizationErrorProps {
  message?: string
}

export function AuthorizationError({
  message = 'You need administrator access to view this page.',
}: AuthorizationErrorProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-card)] px-6 py-14 text-center"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-accent)] bg-[var(--accent-soft)] text-[var(--accent-text)]">
        <ShieldAlert className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="text-xl font-medium text-[var(--text-primary)]">Not authorized</h2>
      <p className="max-w-[46ch] text-sm text-[var(--text-body)]">{message}</p>
    </div>
  )
}
