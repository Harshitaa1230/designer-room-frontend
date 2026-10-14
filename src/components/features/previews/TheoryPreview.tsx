const LESSONS = [
  { chapter: 'Ch. 04', title: 'The grid that holds everything', time: '4 min read', fill: 100 },
  { chapter: 'Ch. 05', title: 'Why color feels heavy', time: '6 min read', fill: 64 },
  { chapter: 'Ch. 06', title: 'Type as a system', time: '5 min read', fill: 12 },
]

const TILT = ['-rotate-[1.6deg]', 'rotate-[1.2deg]', '-rotate-[0.8deg]']
const SHIFT = ['translate-x-0', 'translate-x-3', '-translate-x-1']

export const TheoryPreview = () => (
  <div className="flex h-full w-full flex-col justify-center gap-3.5" aria-hidden="true">
    {LESSONS.map((lesson, index) => (
      <div
        key={lesson.chapter}
        className={`rounded-xl border border-white/10 bg-[#1d1d1d] p-3.5 shadow-[0_10px_24px_-14px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out group-hover:-translate-y-1.5 motion-reduce:transition-none ${TILT[index]} ${SHIFT[index]}`}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] tracking-[0.16em] text-amber-300/60 uppercase">
            {lesson.chapter}
          </span>
          <span className="text-[10px] text-white/40">{lesson.time}</span>
        </div>
        <p className="mt-2 text-[13px] leading-snug font-medium text-white/85">{lesson.title}</p>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500/80 to-amber-300/80"
            style={{ width: `${lesson.fill}%` }}
          />
        </div>
      </div>
    ))}
  </div>
)
