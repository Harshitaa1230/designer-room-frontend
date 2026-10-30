import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getLeaderboardAllTime, getLeaderboardWeekly, getWeeks } from '@/lib/api/challenges'

export function LeaderboardPage() {
  const [tab, setTab] = useState<'weekly' | 'alltime'>('weekly')
  const [weekId, setWeekId] = useState<string>('')
  const { data: weeks } = useQuery({ queryKey: ['weeks'], queryFn: getWeeks })
  const { data: weekly } = useQuery({
    queryKey: ['leaderboard-weekly', weekId],
    queryFn: () => getLeaderboardWeekly(weekId),
    enabled: tab === 'weekly' && !!weekId,
  })
  const { data: alltime } = useQuery({
    queryKey: ['leaderboard-alltime'],
    queryFn: () => getLeaderboardAllTime(),
    enabled: tab === 'alltime',
  })

  if (weeks && !weekId && weeks.length > 0) {
    setWeekId(weeks[weeks.length - 1].id)
  }

  return (
    <section className="pt-28 pb-16 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-medium mb-6">Leaderboard</h1>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab('weekly')} className={`px-4 py-2 rounded-lg ${tab === 'weekly' ? 'btn-3d' : 'border border-[var(--border-subtle)]'}`}>Weekly</button>
        <button onClick={() => setTab('alltime')} className={`px-4 py-2 rounded-lg ${tab === 'alltime' ? 'btn-3d' : 'border border-[var(--border-subtle)]'}`}>All Time</button>
      </div>
      {tab === 'weekly' && (
        <div className="border border-[var(--border-subtle)] rounded-xl overflow-hidden">
          {(weekly || []).map((entry: any, idx: number) => (
            <div key={idx} className="flex justify-between p-3 border-b border-[var(--border-subtle)] last:border-0">
              <div className="flex gap-3">
                <span className="text-[var(--text-muted)]">#{entry.rank}</span>
                <span>{entry.name || entry.userId}</span>
              </div>
              <span>{entry.totalXp} XP</span>
            </div>
          ))}
        </div>
      )}
      {tab === 'alltime' && (
        <div className="border border-[var(--border-subtle)] rounded-xl overflow-hidden">
          {(alltime || []).map((entry: any, idx: number) => (
            <div key={idx} className="flex justify-between p-3 border-b border-[var(--border-subtle)] last:border-0">
              <div className="flex gap-3">
                <span className="text-[var(--text-muted)]">#{entry.rank}</span>
                <span>{entry.name || entry.userId}</span>
              </div>
              <span>{entry.totalXp} XP</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
