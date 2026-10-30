import { Loader2 } from 'lucide-react'

export function Spinner({ className = 'h-4 w-4' }: { className?: string }) {
  return <Loader2 aria-hidden="true" className={`animate-spin ${className}`} />
}

export function FullScreenLoader({ label }: { label: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-[var(--text-body)]">
      <Spinner className="h-6 w-6 text-[var(--accent-text)]" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
