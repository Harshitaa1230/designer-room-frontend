import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getAttempt } from '@/lib/api/challenges'

export function AttemptPage() {
  const { id } = useParams<{ id: string }>()
  const { data: attempt, isLoading } = useQuery({
    queryKey: ['attempt', id],
    queryFn: () => getAttempt(id!),
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === 'GRADING' || status === 'SUBMITTED') return 2000
      return false
    },
  })

  if (isLoading) return <div className="pt-28 px-4">Loading...</div>
  if (!attempt) return <div className="pt-28 px-4">Not found</div>

  return (
    <section className="pt-28 pb-16 px-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-medium">Attempt Status</h1>
      <p className="mt-2 text-[var(--text-body)]">Status: {attempt.status}</p>
      {attempt.status === 'GRADING' && <p className="text-[var(--text-muted)] mt-1">Grading in progress...</p>}
      {attempt.grade && (
        <div className="mt-4 border border-[var(--border-subtle)] rounded-xl p-4 bg-[var(--bg-card)]">
          <p className="font-medium">Grade</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">Method: {attempt.grade.method}</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">Score: {attempt.grade.totalScore}</p>
          {attempt.grade.feedback && <p className="mt-2 text-[var(--text-body)]">{attempt.grade.feedback}</p>}
        </div>
      )}
    </section>
  )
}
