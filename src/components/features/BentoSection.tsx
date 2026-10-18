import { useEffect, useRef, useState, type ComponentType } from 'react'
import { GlowCard } from './GlowCard'
import {
  RouteIcon,
  LayersIcon,
  TargetIcon,
  FlameIcon,
  CommunityIcon,
  PenNibIcon,
} from './icons'
import { RoadmapPreview } from './previews/RoadmapPreview'
import { WeeklyChallengePreview } from './previews/WeeklyChallengePreview'
import { TheoryPreview } from './previews/TheoryPreview'
import { ProgressPreview } from './previews/ProgressPreview'
import { LearnFromMePreview } from './previews/LearnFromMePreview'
import { CommunityPreview } from './previews/CommunityPreview'
import { useInView } from '@/lib/useInView'

interface IconComponentProps {
  className?: string
}

interface Tile {
  id: string
  label: string
  title: string
  description: string
  icon: ComponentType<IconComponentProps>
  preview: ComponentType<{ revealed?: boolean }>
  glow?: boolean
  soon?: boolean
  /** Desktop grid placement (lg+) */
  gridClass?: string
}

const PADDING = 'p-5 xl:p-6'

/*
  Target layout (desktop ≥1024px) — 3-column grid:

  ┌──────────┬──────────┬──────────┐  row 1 (taller, has preview)
  │ 01 Road  │ 02 Theory│ 03 Chal  │
  └──────────┴──────────┴──────────┘
  ┌────────────────────┬────────────┐  row 2 (shorter, text + preview)
  │ 06 Learn From Me   │ 04 Progress│
  │   (col-span-2)     ├────────────┤
  │                    │ 05 Commun. │
  └────────────────────┴────────────┘

  Mobile (<1024px): single column, natural DOM order.
*/

const tiles: Tile[] = [
  {
    id: 'roadmaps',
    label: '01 / Learn',
    title: 'Roadmaps',
    description:
      'Step-by-step learning paths for every design discipline, from UI/UX to branding. No more guessing what to learn next.',
    icon: RouteIcon,
    preview: RoadmapPreview,
    gridClass: 'lg:col-start-1 lg:row-start-1',
  },
  {
    id: 'theory',
    label: '02 / Learn',
    title: 'Theory',
    description:
      'Real-world design lessons that skip the fluff. Short chapters, clear examples, and quick exercises so the knowledge actually sticks.',
    icon: LayersIcon,
    preview: TheoryPreview,
    gridClass: 'lg:col-start-2 lg:row-start-1',
  },
  {
    id: 'challenges',
    label: '03 / Practice',
    title: 'Weekly Challenge',
    description:
      'One theme, seven days, one real design brief. Every week you get a fresh problem to solve, so you build skills.',
    icon: TargetIcon,
    preview: WeeklyChallengePreview,
    gridClass: 'lg:col-start-3 lg:row-start-1',
  },
  {
    id: 'learn',
    label: '06 / Connect',
    title: 'Learn From Me',
    description:
      "I'm in the room too. Every week I'll share design tips and the senior-level tricks that usually take years to pick up. No gatekeeping, just what I wish someone had told me earlier.",
    icon: PenNibIcon,
    preview: LearnFromMePreview,
    // spans cols 1-2, rows 2-3 so it matches the height of the two right cards
    gridClass: 'lg:col-start-1 lg:col-span-2 lg:row-start-2 lg:row-span-2',
  },
  {
    id: 'progress',
    label: '04 / Practice',
    title: 'Progress & Streaks',
    description:
      'Track every lesson, challenge, and milestone in one place. Daily streaks keep you consistent, so showing up becomes a habit.',
    icon: FlameIcon,
    preview: ProgressPreview,
    gridClass: 'lg:col-start-3 lg:row-start-2',
  },
  {
    id: 'community',
    label: '05 / Connect',
    title: 'Community',
    description:
      "A space for designers to share their work, swap honest feedback, and grow together. Learning is easier when you're not doing it alone.",
    icon: CommunityIcon,
    preview: CommunityPreview,
    glow: false,
    soon: true,
    gridClass: 'lg:col-start-3 lg:row-start-3',
  },
]

// Which tiles are in the bottom block (for the animation observer)
const BOTTOM_IDS = new Set(['learn', 'progress', 'community'])

export const BentoSection = () => {
  const gridRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(() => typeof IntersectionObserver === 'undefined')
  const [bottomRef, bottomRevealed] = useInView<HTMLDivElement>({ threshold: 0.1 })

  useEffect(() => {
    const node = gridRef.current
    if (!node || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      aria-labelledby="features-heading"
      className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-20"
    >
      <div className="mb-6">
        <h2 id="features-heading" className="text-2xl font-medium tracking-tight text-[var(--text-primary)] md:text-3xl">
          <span className="font-normal text-[var(--text-muted)]">All the pieces,</span>{' '}
          <span className="text-[var(--text-primary)]">finally in one place</span>
        </h2>
      </div>

      <div className="mb-12 h-px w-full bg-black/10 dark:bg-zinc-800/80 md:mb-16" />

      {/*
        Unified 3-column grid at lg+.
        Row 1: three equal cards (01, 02, 03) — preview on top, text below.
        Row 2-3: card 06 spans cols 1-2 and rows 2-3; cards 04+05 each in col 3.
        Mobile: single column, DOM order.
      */}
      <div
        ref={gridRef}
        data-bottom-revealed={bottomRevealed ? 'true' : 'false'}
        className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-[auto_auto_auto]"
      >
        {/* Invisible anchor for the bottom-block animation observer */}
        <div
          ref={bottomRef}
          className="pointer-events-none absolute opacity-0"
          aria-hidden="true"
        />

        {tiles.map((tile, index) => {
          const isBottomTile = BOTTOM_IDS.has(tile.id)
          const isLearn = tile.id === 'learn'

          return (
            <GlowCard
              key={tile.id}
              className={`${PADDING} overflow-hidden ${tile.gridClass ?? ''} ${isLearn ? 'bento-learn-card' : ''}`}
              revealed={revealed}
              delay={index * 80}
              glow={tile.glow !== false}
            >
              {isLearn ? (
                /* ── 06 Learn From Me: eyebrow/title/body + tip card filling remaining height ── */
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[11px] font-medium tracking-[0.12em] text-amber-400/70 uppercase">
                      {tile.label}
                    </span>
                    <tile.icon className="size-[18px] shrink-0 text-amber-400/60" />
                  </div>
                  <div className="mt-2.5">
                    <h3 className="text-[18px] sm:text-[19px] lg:text-[20px] font-medium tracking-tight text-[var(--text-primary)]">
                      {tile.title}
                    </h3>
                  </div>
                  <p className="mt-2 w-[90%] text-[14px] leading-[1.55] text-[var(--text-muted)]">
                    {tile.description}
                  </p>
                  <div className="mt-7 flex flex-1 flex-col min-w-0 min-h-0">
                    <tile.preview revealed={bottomRevealed} />
                  </div>
                </div>
              ) : (
                /* ── All other cards: eyebrow/title/body + preview pinned below ── */
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[11px] font-medium tracking-[0.12em] text-amber-400/70 uppercase">
                      {tile.label}
                    </span>
                    <tile.icon className="size-[18px] shrink-0 text-amber-400/60" />
                  </div>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <h3
                      aria-label={tile.soon ? `${tile.title} (Soon)` : tile.title}
                      className="text-[18px] sm:text-[19px] lg:text-[20px] font-medium tracking-tight text-[var(--text-primary)]"
                    >
                      {tile.title}
                    </h3>
                    {tile.soon && (
                      <span
                        aria-hidden="true"
                        className="rounded-full border border-amber-400/25 bg-amber-500/10 px-2 py-0.5 font-mono text-[9px] tracking-[0.16em] text-amber-200/90 uppercase"
                      >
                        Soon
                      </span>
                    )}
                  </div>
                  <p className="mt-2 max-w-[36ch] text-[14px] leading-[1.55] text-[var(--text-muted)]">
                    {tile.description}
                  </p>
                  <div className="mt-5 w-full">
                    <tile.preview revealed={isBottomTile ? bottomRevealed : revealed} />
                  </div>
                </div>
              )}
            </GlowCard>
          )
        })}
      </div>
    </section>
  )
}
