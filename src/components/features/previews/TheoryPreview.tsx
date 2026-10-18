import type { CSSProperties } from 'react'

const LESSONS = [
  { chapter: 'Ch. 04', title: 'The grid that holds everything', time: '4 min read', fill: 100 },
  { chapter: 'Ch. 05', title: 'Why color feels heavy', time: '6 min read', fill: 64 },
]

const BAR_DELAYS = [500, 620]

interface TheoryPreviewProps {
  revealed?: boolean
}

export const TheoryPreview = ({ revealed: _revealed }: TheoryPreviewProps) => (
  <div className="grid w-full gap-3 grid-cols-1 sm:grid-cols-2" aria-hidden="true">
    {LESSONS.map((lesson, i) => (
      <div
        key={lesson.chapter}
        className={`bb-chapter bb-chapter-${i} w-full rounded-xl border border-[var(--border-card)] bg-white/[0.04] dark:bg-white/[0.04] light:bg-black/[0.04] backdrop-blur-sm p-3.5 shadow-[0_10px_24px_-14px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_24px_-14px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out group-hover:-translate-y-1 motion-reduce:transition-none`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[12px] tracking-[0.14em] text-amber-500/90 dark:text-amber-300/80 uppercase">
            {lesson.chapter}
          </span>
          <span className="shrink-0 text-[11px] text-[var(--text-faint)]">{lesson.time}</span>
        </div>
        <p className="mt-2 text-[13px] leading-snug font-medium text-[var(--text-primary)] line-clamp-2">
          {lesson.title}
        </p>
        <div className="mt-3 h-[5px] w-full overflow-hidden rounded-full bg-black/[0.08] dark:bg-white/[0.08]">
          <div
            className="bb-bar h-full rounded-full bg-gradient-to-r from-orange-500/90 to-amber-300/90"
            style={
              {
                width: `${lesson.fill}%`,
                '--bb-bar-delay': `${BAR_DELAYS[i]}ms`,
              } as CSSProperties
            }
          />
        </div>
      </div>
    ))}
  </div>
)
