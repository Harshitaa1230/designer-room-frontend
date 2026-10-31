import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { getWeekChallenges } from '@/lib/api/challenges'
import { Seo } from '@/components/Seo'

export function WeekDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: challenges, isLoading } = useQuery({
    queryKey: ['week-challenges', id],
    queryFn: () => getWeekChallenges(id!),
    enabled: !!id,
  })

  if (isLoading) return <div className="pt-28 px-4">Loading...</div>

  return (
    <section className="pt-28 pb-16 px-4 max-w-4xl mx-auto">
      <Seo title="Weekly design challenges · Designers Room" description="Explore the challenges in this Designers Room practice week." />
      <Link to="/challenge" className="text-sm text-[var(--text-muted)]">← Back to challenges</Link>
      <h1 className="text-3xl font-medium mt-4 mb-6">Week Challenges</h1>
      <div className="grid gap-3">
        {(challenges || []).map((c) => (
          <div key={c.id} className="border border-[var(--border-subtle)] rounded-xl p-4 bg-[var(--bg-card)] flex justify-between items-center">
            <div>
              <p className="text-sm text-[var(--text-muted)]">Day {c.dayNumber} • {c.type}</p>
              <h3 className="text-lg mt-1">{c.locked ? c.title : c.title}</h3>
              {c.userStatus && <p className="text-xs text-[var(--text-muted)] mt-1">Status: {c.userStatus}</p>}
            </div>
            {c.locked ? (
              <span className="text-sm text-[var(--text-muted)]">Locked</span>
            ) : (
              <Link to={`/challenge/${c.id}`} className="btn-3d px-4 py-2 text-sm">Start/View</Link>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
