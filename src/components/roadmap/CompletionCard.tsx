import { Link } from 'react-router-dom'

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
    <div className="px-5 sm:px-12 md:px-16 pt-[32px] sm:pt-[48px] pb-[48px] sm:pb-[64px]">
      <div className="relative overflow-hidden bg-[#11100f] border border-[#302923] rounded-[16px] sm:rounded-[24px] p-[24px] sm:p-[40px] lg:p-[64px] flex flex-col gap-[16px] sm:gap-[24px]">
        {/* Label */}
        <p className="text-[12px] text-[#827a73]">(The finish line)</p>

        {/* Heading */}
        <h2 className="text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-medium text-[#fff8ee] leading-[1.02] tracking-[-1.2px] sm:tracking-[-1.92px] break-words">
          Now go ship it.
        </h2>

        {/* Subtitle */}
        <p className="text-[16px] sm:text-[18px] text-[#b6ada4] leading-relaxed max-w-[560px] break-words">
          Finish the six stages, publish a case study, then apply for jobs or
          freelance. That's the whole plan.
        </p>

        {/* Completion status */}
        <p className="text-[14px] text-[#827a73]">
          {completedTopics} of {totalTopics} topics done ({pct}%)
        </p>

        {/* Buttons row */}
        <div className="flex flex-wrap gap-[8px] sm:gap-[12px] mt-[4px] sm:mt-[8px]">
          {/* Primary button */}
          <Link
            to="/challenge"
            className="inline-flex min-h-[44px] items-center justify-center bg-[#ff6a00] rounded-full px-[18px] py-[10px] text-[14px] font-semibold text-[#080808] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6a00] sm:min-h-0 sm:px-[24px] sm:py-[14px] sm:text-[15px]"
          >
            Join the Weekly Challenge →
          </Link>

          {/* Secondary button */}
          <Link
            to="/community"
            className="inline-flex min-h-[44px] items-center justify-center border border-[#302923] rounded-full px-[18px] py-[10px] text-[14px] text-white hover:border-[#504740] hover:bg-white/[0.04] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6a00] sm:min-h-0 sm:px-[24px] sm:py-[14px] sm:text-[15px]"
          >
            Share your progress
          </Link>

          {/* Disabled button */}
          <button
            type="button"
            disabled
            className="min-h-[44px] border border-[#302923] rounded-full px-[18px] py-[10px] text-[14px] text-[#827a73] opacity-50 cursor-not-allowed sm:min-h-0 sm:px-[24px] sm:py-[14px] sm:text-[15px]"
          >
            Challenge opens after beta
          </button>
        </div>
      </div>
    </div>
  )
}
