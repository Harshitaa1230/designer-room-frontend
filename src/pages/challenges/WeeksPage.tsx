import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getWeeks } from '@/lib/api/challenges'

export function WeeksPage() {
  const { data: weeks, isLoading } = useQuery({ queryKey: ['weeks'], queryFn: getWeeks })

  if (isLoading) return <div className="pt-28 px-4">Loading...</div>

  return (
    <section className="pt-28 pb-16 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-medium mb-6">Challenges</h1>
      <div className="grid gap-4">
        {(weeks || []).map((week) => (
          <Link
            key={week.id}
            to={`/weeks/${week.id}`}
            className="border border-[var(--border-subtle)] rounded-xl p-6 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-[var(--text-muted)]">Week {week.number}</p>
                <h2 className="text-xl mt-1">{week.theme}</h2>
                <p className="text-sm text-[var(--text-muted)] mt-1">{week.status}</p>
              </div>
              <span>→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
