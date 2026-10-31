import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[var(--bg-page)] px-5 text-center text-[var(--text-primary)]">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-[var(--text-body)]">Page not found.</p>
      <Link
        to="/"
        className="font-medium text-[var(--accent-text)] underline underline-offset-4 hover:text-[var(--accent-strong)]"
      >
        Back home
      </Link>
    </section>
  )
}
