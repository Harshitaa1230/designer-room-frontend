import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getChallenge, saveAnswer, startChallenge, submitAttempt, type ChallengeAnswer } from '@/lib/api/challenges'
import { trackEvent } from '@/lib/analytics'

export function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: challenge, isLoading } = useQuery({
    queryKey: ['challenge', id],
    queryFn: () => getChallenge(id!),
    enabled: !!id,
  })
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [answer, setAnswer] = useState<ChallengeAnswer>({})

  const startMut = useMutation({
    mutationFn: () => startChallenge(id!),
    onSuccess: (data) => {
      setAttemptId(data.id)
      if (data.answer) setAnswer(data.answer)
      trackEvent('challenge_started', { challenge_id: id, attempt_id: data.id })
    },
  })

  const saveMut = useMutation({
    mutationFn: () => saveAnswer(attemptId!, answer),
  })

  const submitMut = useMutation({
    mutationFn: () => submitAttempt(attemptId!),
    onSuccess: (data) => {
      trackEvent('challenge_submitted', { challenge_id: id, attempt_id: data.id })
      navigate(`/attempts/${data.id}`)
    },
  })

  if (isLoading) return <div className="pt-28 px-4">Loading...</div>
  if (!challenge) return <div className="pt-28 px-4">Not found</div>

  return (
    <section className="pt-28 pb-16 px-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-medium">{challenge.title}</h1>
      <p className="text-[var(--text-body)] mt-2 whitespace-pre-wrap">{challenge.brief}</p>
      {challenge.imageUrls?.length > 0 && (
        <div className="mt-4 grid gap-2">
          {challenge.imageUrls.map((url: string) => (
            <img key={url} src={url} alt="" className="rounded-xl border border-[var(--border-subtle)]" />
          ))}
        </div>
      )}

      <div className="mt-6 border border-[var(--border-subtle)] rounded-xl p-4 bg-[var(--bg-card)]">
        {!attemptId ? (
          <button onClick={() => startMut.mutate()} className="btn-3d px-4 py-2" disabled={startMut.isPending}>
            Start Challenge
          </button>
        ) : (
          <div className="space-y-4">
            {challenge.type === 'MCQ' && (
              <div>
                <p className="mb-2">Select answer</p>
                <div className="grid gap-2">
                  {(challenge.payload?.options || []).map((opt) => (
                    <label key={opt.id} className="flex items-center gap-2 p-3 border border-[var(--border-subtle)] rounded-lg">
                      <input
                        type="radio"
                        name="mcq"
                        onChange={() => setAnswer({ selected: opt.id })}
                      />
                      <span>{opt.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            {(challenge.type === 'SHORT_ANSWER' || challenge.type === 'CRITIQUE' || challenge.type === 'FIX_IN_WORDS' || challenge.type === 'SCENARIO' || challenge.type === 'SPOT_ISSUE') && (
              <div>
                <textarea
                  className="w-full min-h-[200px] p-3 rounded-lg bg-[var(--bg-inset)] border border-[var(--border-subtle)]"
                  placeholder="Write your answer..."
                  value={answer.text || ''}
                  onChange={(e) => setAnswer({ text: e.target.value })}
                />
              </div>
            )}
            {challenge.type === 'ORDERING' && (
              <div>
                <textarea
                  className="w-full p-3 rounded-lg bg-[var(--bg-inset)] border border-[var(--border-subtle)]"
                  placeholder='Enter order as JSON array e.g. ["step1","step2"]'
                  value={JSON.stringify(answer.order || [])}
                  onChange={(e) => {
                    try {
                      setAnswer({ order: JSON.parse(e.target.value) })
                    } catch {
                      setAnswer({ order: [] })
                    }
                  }}
                />
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={() => saveMut.mutate()} className="px-4 py-2 border border-[var(--border-subtle)] rounded-lg" disabled={saveMut.isPending}>
                Save Draft
              </button>
              <button onClick={() => submitMut.mutate()} className="btn-3d px-4 py-2" disabled={submitMut.isPending}>
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
