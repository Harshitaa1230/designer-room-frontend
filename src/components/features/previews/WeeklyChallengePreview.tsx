import { useEffect, useRef, useState } from 'react'

// ─── Accent token ────────────────────────────────────────────────────────────
// Change here to retheme the whole widget.
const ACCENT = {
  eyebrow:     'text-orange-400/80',
  pillBorder:  'border-orange-400/25',
  pillBg:      'bg-orange-500/10',
  pillText:    'text-orange-200',
  chipDone:    'bg-gradient-to-t from-orange-600/90 to-amber-400/85',
  chipToday:   'border border-orange-400/70 text-orange-300',
  progressBar: 'from-orange-500 to-amber-400', // used in inline style gradient
  cta:         'bg-gradient-to-b from-[#FFF8EE] via-[#E8DDD0] to-[#B9ADA0] text-zinc-900',
}

// ─── Data ────────────────────────────────────────────────────────────────────
interface Day {
  short: string
  full:  string
  state: 'done' | 'today' | 'upcoming'
}

const DAYS: Day[] = [
  { short: 'Mon', full: 'Monday',    state: 'done'     },
  { short: 'Tue', full: 'Tuesday',   state: 'done'     },
  { short: 'Wed', full: 'Wednesday', state: 'done'     },
  { short: 'Thu', full: 'Thursday',  state: 'today'    },
  { short: 'Fri', full: 'Friday',    state: 'upcoming' },
  { short: 'Sat', full: 'Saturday',  state: 'upcoming' },
  { short: 'Sun', full: 'Sunday',    state: 'upcoming' },
]

const DONE_COUNT    = DAYS.filter((d) => d.state === 'done').length   // 3
const DONE_INDICES  = DAYS.map((d, i) => (d.state === 'done' ? i : -1)).filter((i) => i !== -1)
const TODAY_INDEX   = DAYS.findIndex((d) => d.state === 'today')
const CURRENT_DAY   = TODAY_INDEX + 1                                  // 4
const TOTAL_DAYS    = DAYS.length                                      // 7
const PROGRESS_PCT  = Math.round((DONE_COUNT / TOTAL_DAYS) * 100)     // 43

// ─── Easing helper ───────────────────────────────────────────────────────────
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

// ─── Sub-components ──────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true" focusable="false">
    <path
      d="M2 5.2 L4.2 7.5 L8 3"
      stroke="rgba(0,0,0,0.75)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// ─── Count-up hook ───────────────────────────────────────────────────────────
function useCountUp(target: number, enabled: boolean, delay: number, duration: number): number {
  const [value, setValue] = useState(target) // default = final (fallback/reduced-motion)

  useEffect(() => {
    if (!enabled) return            // reduced-motion: stay at final value
    setValue(0)

    let rafId: number
    let startTime: number | null = null

    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const elapsed = ts - startTime
      if (elapsed < delay) {
        rafId = requestAnimationFrame(step)
        return
      }
      const progress = Math.min((elapsed - delay) / duration, 1)
      setValue(Math.round(easeOutCubic(progress) * target))
      if (progress < 1) rafId = requestAnimationFrame(step)
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [enabled, target, delay, duration])

  return value
}

// ─── Main component ──────────────────────────────────────────────────────────
export const WeeklyChallengePreview = () => {
  const rootRef   = useRef<HTMLDivElement>(null)
  const [triggered, setTriggered] = useState(false)

  // Detect reduced-motion once at mount.
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  // IntersectionObserver — this card only, threshold 0.3, once.
  useEffect(() => {
    const node = rootRef.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setTriggered(true) // fallback: show final state immediately
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setTriggered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // Effective trigger: skip animation for reduced-motion, still mark triggered.
  const animate = triggered && !reducedMotion.current

  // Count-up: 0 → PROGRESS_PCT, synced to bar (600ms delay, 900ms duration).
  const displayPct = useCountUp(PROGRESS_PCT, animate, 600, 900)

  // ── Shared transition helper ──────────────────────────────────────────────
  // Returns opacity + transform inline styles for "fade + rise" elements.
  // Default (untriggered) = invisible + shifted; triggered = final state.
  // For reduced-motion or pre-trigger fallback we always show final state.
  const fadeRise = (
    delayMs: number,
    opts: { dy?: number } = {},
  ): React.CSSProperties => {
    const dy = opts.dy ?? 10
    if (!triggered) {
      return { opacity: 0, transform: `translateY(${dy}px)`, willChange: 'opacity, transform' }
    }
    if (reducedMotion.current) {
      return { opacity: 1, transform: 'translateY(0)' }
    }
    return {
      opacity:    1,
      transform:  'translateY(0)',
      transition: `opacity 600ms cubic-bezier(0.22,1,0.36,1) ${delayMs}ms,
                   transform 600ms cubic-bezier(0.22,1,0.36,1) ${delayMs}ms`,
    }
  }

  // ── Card-level entrance ───────────────────────────────────────────────────
  const cardStyle: React.CSSProperties = (() => {
    if (!triggered) return { opacity: 0, transform: 'translateY(24px)', willChange: 'opacity, transform' }
    if (reducedMotion.current) return {}
    return {
      opacity:    1,
      transform:  'translateY(0)',
      transition: 'opacity 600ms cubic-bezier(0.22,1,0.36,1) 0ms, transform 600ms cubic-bezier(0.22,1,0.36,1) 0ms',
    }
  })()

  // ── Widget box ────────────────────────────────────────────────────────────
  const widgetStyle: React.CSSProperties = (() => {
    if (!triggered) return { opacity: 0, willChange: 'opacity' }
    if (reducedMotion.current) return {}
    return {
      opacity:    1,
      transition: 'opacity 400ms ease-out 300ms',
    }
  })()

  // ── Today chip ring pulse ─────────────────────────────────────────────────
  // We use a CSS animation class injected via a <style> tag so it plays once.
  // Scoped class name to avoid collision.
  const todayPulseClass = animate ? 'wcp-today-pulse' : ''

  // ── Done chip: scale-pop per chip (staggered) ─────────────────────────────
  const chipStyle = (index: number): React.CSSProperties => {
    const isActuallyDone = DONE_INDICES.includes(index)
    if (!isActuallyDone) return {}

    const staggerDelay = 500 + DONE_INDICES.indexOf(index) * 120
    if (!triggered) {
      return { opacity: 0, transform: 'scale(0.6)', willChange: 'opacity, transform' }
    }
    if (reducedMotion.current) return {}
    return {
      opacity:    1,
      transform:  'scale(1)',
      transition: `opacity 250ms ease-out ${staggerDelay}ms,
                   transform 350ms cubic-bezier(0.34,1.56,0.64,1) ${staggerDelay}ms`,
    }
  }

  // ── Progress bar (scaleX, no layout thrash) ───────────────────────────────
  const barContainerStyle: React.CSSProperties = {
    transformOrigin: 'left center',
    willChange:      animate ? 'transform' : undefined,
  }
  const barFillStyle: React.CSSProperties = (() => {
    if (!triggered) {
      return {
        transform:       'scaleX(0)',
        transformOrigin: 'left center',
        willChange:      'transform',
        // Keep the gradient; we scale it to avoid width reflow.
        background:      'linear-gradient(to right, #f97316, #fbbf24)',
      }
    }
    if (reducedMotion.current) {
      return {
        transform:       `scaleX(${PROGRESS_PCT / 100})`,
        transformOrigin: 'left center',
        background:      'linear-gradient(to right, #f97316, #fbbf24)',
      }
    }
    return {
      transform:       `scaleX(${PROGRESS_PCT / 100})`,
      transformOrigin: 'left center',
      background:      'linear-gradient(to right, #f97316, #fbbf24)',
      transition:      'transform 900ms ease-out 600ms',
    }
  })()

  // ── Pill fade + glow pulse ────────────────────────────────────────────────
  const pillClass = animate ? 'wcp-pill-glow' : ''
  const pillStyle: React.CSSProperties = (() => {
    if (!triggered) return { opacity: 0, willChange: 'opacity' }
    if (reducedMotion.current) return {}
    return { opacity: 1, transition: 'opacity 400ms ease-out 1000ms' }
  })()

  return (
    <>
      {/*
        Scoped keyframes injected once — only the classes that need JS-derived
        timing live here. Everything else is Tailwind utility classes.
      */}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes wcp-today-ring {
            0%   { box-shadow: 0 0 0 0px rgba(251,146,60,0.55); }
            50%  { box-shadow: 0 0 0 5px rgba(251,146,60,0); }
            100% { box-shadow: 0 0 0 5px rgba(251,146,60,0); }
          }
          .wcp-today-pulse {
            animation: wcp-today-ring 600ms ease-out 900ms 1 forwards;
          }
          @keyframes wcp-pill-glow-kf {
            0%   { box-shadow: 0 0 0px 0px rgba(251,146,60,0); }
            40%  { box-shadow: 0 0 8px 2px rgba(251,146,60,0.3); }
            100% { box-shadow: 0 0 0px 0px rgba(251,146,60,0); }
          }
          .wcp-pill-glow {
            animation: wcp-pill-glow-kf 800ms ease-out 1000ms 1 forwards;
          }
        }
      `}</style>

      {/* ── Card wrapper ────────────────────────────────────────────────── */}
      <div
        ref={rootRef}
        style={cardStyle}
        className="flex w-full flex-col rounded-xl border border-white/[0.12] bg-white/[0.03] p-3.5 sm:p-4"
      >
        {/* ── Widget inner box ────────────────────────────────────────────── */}
        <div style={widgetStyle} className="flex flex-col">

          {/* ── Eyebrow row ───────────────────────────────────────────────── */}
          <div className="flex items-center justify-between gap-3">
            {/* Eyebrow text */}
            <span
              style={fadeRise(150)}
              className={`font-mono text-[11px] font-medium tracking-[0.14em] uppercase ${ACCENT.eyebrow}`}
            >
              Week 14 · Sleep &amp; rest
            </span>

            {/* Pill */}
            <span
              style={{ ...pillStyle }}
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap ${ACCENT.pillBorder} ${ACCENT.pillBg} ${ACCENT.pillText} ${pillClass}`}
            >
              4d 12h left
            </span>
          </div>

          {/* ── Brief title ───────────────────────────────────────────────── */}
          <p
            style={fadeRise(230)}
            className="mt-2 text-[18px] leading-snug font-semibold text-white sm:text-[19px]"
          >
            Design a sleep-tracking app
          </p>

          {/* ── Day chips ─────────────────────────────────────────────────── */}
          <div
            style={fadeRise(310)}
            className="mt-3 flex items-center gap-1"
            role="list"
            aria-label="Weekly progress chips"
          >
            {DAYS.map((day, index) => {
              const isDone     = day.state === 'done'
              const isToday    = day.state === 'today'
              const isUpcoming = day.state === 'upcoming'

              return (
                <span
                  key={day.full}
                  role="listitem"
                  title={day.full}
                  aria-label={
                    isDone     ? `${day.full} — completed`
                    : isToday  ? `${day.full} — today`
                    :            `${day.full} — upcoming`
                  }
                  {...(isToday ? { 'aria-current': 'date' as const } : {})}
                  style={chipStyle(index)}
                  className={[
                    'flex h-7 flex-1 items-center justify-center rounded-md text-[11px] font-medium',
                    isDone
                      ? `${ACCENT.chipDone} text-black/80 font-semibold`
                      : isToday
                        ? `${ACCENT.chipToday} ${todayPulseClass}`
                        : 'bg-white/[0.06] text-[#9a9a9a]',
                  ].join(' ')}
                >
                  {isDone ? <CheckIcon /> : day.short}
                </span>
              )
            })}
          </div>

          {/* ── Progress row ──────────────────────────────────────────────── */}
          <div style={fadeRise(390)} className="mt-3">
            <div className="flex items-center justify-between text-[12px] text-white">
              <span>
                Day {CURRENT_DAY} of {TOTAL_DAYS}
                <span className="ml-1 text-white">· {DONE_COUNT} done</span>
              </span>

              {/* Count-up: aria-hidden on the live digit; sr-only gives the real value */}
              <span className="tabular-nums">
                <span aria-hidden="true">{displayPct}</span>
                <span className="sr-only">{PROGRESS_PCT}</span>
                %
              </span>
            </div>

            <div
              className="mt-1.5 h-[5px] w-full overflow-hidden rounded-full bg-white/[0.14]"
              style={barContainerStyle}
              role="progressbar"
              aria-valuenow={PROGRESS_PCT}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${PROGRESS_PCT}% of this week's challenge complete`}
            >
              {/* scaleX animation — no width reflow */}
              <div className="h-full w-full rounded-full" style={barFillStyle} />
            </div>
          </div>

          {/* ── CTA ───────────────────────────────────────────────────────── */}
          <button
            type="button"
            style={fadeRise(470)}
            className={[
              'mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-1.5',
              'rounded-full px-5 py-2 text-[13px] font-semibold',
              'shadow-[0_4px_16px_rgba(0,0,0,0.35)] transition-[opacity,transform] duration-200',
              'hover:opacity-90 active:scale-[0.98]',
              ACCENT.cta,
            ].join(' ')}
          >
            Start today's brief
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </>
  )
}
