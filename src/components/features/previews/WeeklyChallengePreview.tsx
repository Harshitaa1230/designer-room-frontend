const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export const WeeklyChallengePreview = () => (
  <div className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-4">
    <div className="flex items-center justify-between gap-3">
      <span className="font-mono text-[10px] tracking-[0.16em] text-amber-300/70 uppercase">
        Week 14 · Sleep &amp; rest
      </span>
      <span className="rounded-full border border-amber-400/25 bg-amber-500/10 px-2.5 py-1 text-[10px] font-medium whitespace-nowrap text-amber-200">
        4d 12h left
      </span>
    </div>

    <p className="mt-3 text-[15px] leading-snug font-medium text-white/90">
      Design a sleep-tracking app
    </p>

    <div className="mt-4 flex items-center gap-1.5">
      {DAYS.map((day, index) => {
        const state = index < 3 ? 'done' : index === 3 ? 'today' : 'todo'
        return (
          <span
            key={index}
            className={`flex h-6 flex-1 items-center justify-center rounded-md text-[9px] ${
              state === 'done'
                ? 'bg-gradient-to-t from-orange-600/80 to-amber-400/80 text-black/70'
                : state === 'today'
                  ? 'border border-amber-400/60 text-amber-200'
                  : 'bg-white/[0.05] text-white/30'
            }`}
          >
            {day}
          </span>
        )
      })}
    </div>

    <div className="mt-4">
      <div className="flex items-center justify-between text-[10px] text-white/50">
        <span>Day 3 of 7</span>
        <span className="tabular-nums">43%</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-[43%] rounded-full bg-gradient-to-r from-orange-500 to-amber-300" />
      </div>
    </div>
  </div>
)
