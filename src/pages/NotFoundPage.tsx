import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-slate-600 dark:text-slate-400">Page not found.</p>
      <Link to="/" className="text-blue-600 underline">
        Back home
      </Link>
    </section>
  )
}
