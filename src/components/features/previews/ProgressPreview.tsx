const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const TOTAL = DAYS.length

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

export const ProgressPreview = () => (
  <div className="w-full" aria-hidden="true">
    <div className="flex items-center gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-orange-500/25 bg-orange-500/10">
        <FlameIcon className="size-5 text-orange-400" />
      </span>
      <div className="min-w-0">
        <p className="text-[15px] leading-tight font-semibold text-white">12 day streak</p>
        <p className="text-[11px] text-white/45">Longest run: 18 days</p>
      </div>
    </div>

    <div className="mt-5 flex items-center justify-between">
      {DAYS.map((day, index) => {
        const isFilled = index >= TOTAL - 4
        const isToday = index === TOTAL - 1
        return (
          <div key={index} className="flex flex-1 flex-col items-center gap-2">
            <span
              className={`size-2.5 rounded-full ${
                isFilled ? 'bg-gradient-to-br from-amber-300 to-orange-500' : 'bg-white/10'
              } ${isToday ? 'ring-2 ring-orange-400/40 ring-offset-2 ring-offset-[#171717]' : ''}`}
            />
            <span className="text-[9px] text-white/35">{day}</span>
          </div>
        )
      })}
    </div>
  </div>
)
