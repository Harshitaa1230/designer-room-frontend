import { Link } from 'react-router-dom'

interface ProgressCardProps {
  completedTopics: number
  totalTopics: number
  continueTopicTitle: string
  roadmapId: string
  continueTopicId?: string
}

/**
 * Displays the user's overall roadmap completion percentage,
 * a progress bar, and a CTA to continue or start.
 */
export default function ProgressCard({
  completedTopics,
  totalTopics,
  continueTopicTitle,
  roadmapId,
  continueTopicId,
}: ProgressCardProps) {
  const pct = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100)
  const ctaLabel = continueTopicTitle
    ? `Continue: ${continueTopicTitle} →`
    : 'Start where you left off'
  const ctaHref = continueTopicId
    ? `/guidebook/${roadmapId}/${continueTopicId}`
    : `/roadmaps/${roadmapId}`

  return (
    <div
      className="w-full max-w-[400px] flex flex-col gap-[18px] rounded-[24px] p-[28px]"
      style={{ background: '#11100f', border: '1px solid #302923' }}
    >
      {/* "YOUR PROGRESS" label */}
      <p
        className="text-[12px] font-semibold tracking-[1.44px]"
        style={{ color: '#827a73' }}
      >
        YOUR PROGRESS
      </p>

      {/* Big number row */}
      <div className="flex flex-row items-end gap-[12px]">
        <span
          className="text-[72px] font-medium leading-[72px] tracking-[-2.16px]"
          style={{ color: '#fff8ee' }}
        >
          {pct}%
        </span>
        <span
          className="text-[14px] font-normal pb-[4px]"
          style={{ color: '#b6ada4' }}
        >
          {completedTopics} of {totalTopics} topics
        </span>
      </div>

      {/* Progress bar */}
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="w-full h-[6px] rounded-[3px] overflow-hidden"
        style={{ background: '#1d1916' }}
      >
        <div
          className="h-full rounded-[3px]"
          style={{ width: `${pct}%`, background: '#ff6a00' }}
        />
      </div>

      {/* CTA button */}
      <Link
        to={ctaHref}
        className="w-full rounded-full px-[24px] py-[16px] text-[15px] font-semibold text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6a00]"
        style={{ background: '#ff6a00', color: '#080808' }}
      >
        {ctaLabel}
      </Link>

      {/* Footer note */}
      <p className="text-[12px]" style={{ color: '#827a73' }}>
        Progress saves when you're signed in
      </p>
    </div>
  )
}
