interface CompletionCardProps {
  completedTopics: number
  totalTopics: number
}

export default function CompletionCard({
  completedTopics,
  totalTopics,
}: CompletionCardProps) {
  const pct = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100)

  return (
    <div className="px-8 sm:px-12 md:px-16 pt-[48px] pb-[64px]">
      <div className="relative overflow-hidden bg-[#11100f] border border-[#302923] rounded-[24px] p-[64px] flex flex-col gap-[24px]">
        {/* Label */}
        <p className="text-[12px] text-[#827a73]">(The finish line)</p>

        {/* Heading */}
        <h2 className="text-[56px] md:text-[64px] font-medium text-[#fff8ee] leading-none tracking-[-1.92px]">
          Now go ship it.
        </h2>

        {/* Subtitle */}
        <p className="text-[18px] text-[#b6ada4] leading-relaxed max-w-[560px]">
          Finish the six stages, publish a case study, then apply for jobs or
          freelance. That's the whole plan.
        </p>

        {/* Completion status */}
        <p className="text-[14px] text-[#827a73]">
          {completedTopics} of {totalTopics} topics done ({pct}%)
        </p>

        {/* Buttons row */}
        <div className="flex flex-wrap gap-[12px] mt-[8px]">
          {/* Primary button */}
          <button
            type="button"
            className="bg-[#ff6a00] rounded-full px-[24px] py-[14px] text-[15px] font-semibold text-[#080808] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6a00]"
          >
            Join the Weekly Challenge →
          </button>

          {/* Secondary button */}
          <button
            type="button"
            className="border border-[#302923] rounded-full px-[24px] py-[14px] text-[15px] text-white hover:border-[#504740] hover:bg-white/[0.04] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6a00]"
          >
            Share your progress
          </button>

          {/* Disabled button */}
          <button
            type="button"
            disabled
            className="border border-[#302923] rounded-full px-[24px] py-[14px] text-[15px] text-[#827a73] opacity-50 cursor-not-allowed"
          >
            Challenge opens after beta
          </button>
        </div>
      </div>
    </div>
  )
}
