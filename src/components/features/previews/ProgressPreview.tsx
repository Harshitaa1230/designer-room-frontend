import type { CSSProperties } from 'react'
import { useCountUp } from '@/lib/useCountUp'

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const TOTAL = DAYS.length
const STREAK_TARGET = 12

// Dot animation: scale-in starting at 600ms, 80ms stagger
const DOT_BASE_DELAY = 600
const DOT_STAGGER = 80

const FlameIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M12 3c.5 3-1.5 4.3-2.8 6C7.6 10.9 7 12.4 7 14a5 5 0 0 0 10 0c0-1.6-.6-3-1.6-4.3"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 21a3 3 0 0 1-3-3c0-1.6 1.2-2.5 3-4.5 1.8 2 3 2.9 3 4.5a3 3 0 0 1-3 3z"
      fill="currentColor"
      opacity="0.9"
    />
  </svg>
)

interface ProgressPreviewProps {
  revealed?: boolean
}

export const ProgressPreview = ({ revealed = false }: ProgressPreviewProps) => {
  // Count starts at 500ms after reveal (CSS handles the delay visually,
  // but the hook waits for `revealed` to be true before starting)
  const streakCount = useCountUp(STREAK_TARGET, 800, revealed)

  return (
    <div className="w-full" aria-hidden="true">
      <div className="flex items-center gap-3">
        {/* Flame icon: one flicker on reveal */}
        <span className="bb-flame flex size-10 shrink-0 items-center justify-center rounded-xl border border-orange-500/25 bg-orange-500/10">
          <FlameIcon className="size-5.5 text-orange-400" />
        </span>
        <div className="min-w-0">
          <p className="text-[16px] leading-tight font-semibold text-white">
            {/* Counting number — aria-hidden during animation, sr-only holds final */}
            <span aria-hidden="true">{streakCount}</span>
            <span className="sr-only">{STREAK_TARGET}</span>
            {' '}day streak
          </p>
          <p className="mt-0.5 text-[12px] text-white">Longest run: 18 days</p>
        </div>
      </div>

      <div className="mt-3.5 flex items-center justify-between">
        {DAYS.map((day, index) => {
          const isFilled = index >= TOTAL - 4
          const isToday = index === TOTAL - 1
          const dotDelay = DOT_BASE_DELAY + index * DOT_STAGGER
          return (
            <div key={index} className="flex flex-1 flex-col items-center gap-1.5">
              <span
                className={`size-3 rounded-full ${isToday ? 'bb-dot-today' : 'bb-dot'} ${
                  isFilled ? 'bg-gradient-to-br from-amber-300 to-orange-500' : 'bg-white/15'
                } ${isToday ? 'ring-2 ring-orange-400/50 ring-offset-2 ring-offset-[#171717]' : ''}`}
                style={{ '--bb-dot-delay': `${dotDelay}ms` } as CSSProperties}
              />
              <span className="text-[12px] font-medium text-white">{day}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
