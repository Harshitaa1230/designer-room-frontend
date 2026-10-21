interface ProgressCardProps {
  completedTopics: number
  totalTopics: number
  continueTopicTitle: string
}

/**
 * Displays the user's overall roadmap completion percentage,
 * a progress bar, and a CTA to continue or start.
 *
 * Requirements: 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 3.3, 3.4, 12.2
 */
export default function ProgressCard({
  completedTopics,
  totalTopics,
  continueTopicTitle,
}: ProgressCardProps) {
  const pct = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100)

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
      <button
        type="button"
        className="w-full rounded-full px-[24px] py-[16px] text-[15px] font-semibold text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6a00]"
        style={{ background: '#ff6a00', color: '#080808' }}
      >
        {continueTopicTitle ? `Continue: ${continueTopicTitle} →` : 'Start where you left off'}
      </button>

      {/* Footer note */}
      <p className="text-[12px]" style={{ color: '#827a73' }}>
        Progress saves when you're signed in
      </p>
    </div>
  )
}
