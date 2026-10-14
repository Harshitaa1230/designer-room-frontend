import { useEffect, useRef, useState, type ComponentType } from 'react'
import { GlowCard } from './GlowCard'
import { CubesIcon, PenNibIcon, TriangleRulerIcon } from './icons'
import { RoadmapPreview } from './previews/RoadmapPreview'
import { WeeklyChallengePreview } from './previews/WeeklyChallengePreview'
import { TheoryPreview } from './previews/TheoryPreview'
import { ProgressPreview } from './previews/ProgressPreview'
import { LearnFromMePreview } from './previews/LearnFromMePreview'
import { CommunityPreview } from './previews/CommunityPreview'

interface IconComponentProps {
  className?: string
}

interface Tile {
  id: string
  label: string
  title: string
  description: string
  icon: ComponentType<IconComponentProps>
  preview: ComponentType
  className: string
  /** Let the preview grow to fill tall tiles instead of leaving a void. */
  fill?: boolean
  glow?: boolean
  soon?: boolean
}

const PADDING = 'p-5 sm:p-6 lg:p-7'

const tiles: Tile[] = [
  {
    id: 'roadmaps',
    label: '01 / Learn',
    title: 'Roadmaps',
    description:
      'Step-by-step learning paths for every design discipline, from UI/UX to branding. No more guessing what to learn next.',
    icon: TriangleRulerIcon,
    preview: RoadmapPreview,
    fill: true,
    className: `${PADDING} sm:col-span-2 lg:col-start-1 lg:col-span-2 lg:row-start-1 lg:row-span-2`,
  },
  {
    id: 'challenges',
    label: '02 / Practice',
    title: 'Weekly Challenge',
    description:
      'One theme, seven days, one real design brief. Every week you get a fresh problem to solve, so you build skills.',
    icon: PenNibIcon,
    preview: WeeklyChallengePreview,
    className: `${PADDING} sm:col-span-2 lg:col-start-3 lg:col-span-2 lg:row-start-1`,
  },
  {
    id: 'theory',
    label: '01 / Learn',
    title: 'Theory',
    description:
      'Real-world design lessons that skip the fluff. Short chapters, clear examples, and quick exercises so the knowledge actually sticks.',
    icon: PenNibIcon,
    preview: TheoryPreview,
    fill: true,
    className: `${PADDING} lg:col-start-3 lg:row-start-2 lg:row-span-2`,
  },
  {
    id: 'progress',
    label: '02 / Practice',
    title: 'Progress & Streaks',
    description:
      'Track every lesson, challenge, and milestone in one place. Daily streaks keep you consistent, so showing up becomes a habit.',
    icon: CubesIcon,
    preview: ProgressPreview,
    className: `${PADDING} lg:col-start-4 lg:row-start-2`,
  },
  {
    id: 'learn',
    label: '03 / Connect',
    title: 'Learn From Me',
    description:
      "I'm in the room too. Every week I'll share design tips and the senior-level tricks that usually take years to pick up. No gatekeeping, just what I wish someone had told me earlier.",
    icon: PenNibIcon,
    preview: LearnFromMePreview,
    className: `${PADDING} lg:col-start-1 lg:col-span-2 lg:row-start-3`,
  },
  {
    id: 'community',
    label: '03 / Connect',
    title: 'Community',
    description:
      "A space for designers to share their work, swap honest feedback, and grow together. Learning is easier when you're not doing it alone.",
    icon: CubesIcon,
    preview: CommunityPreview,
    glow: false,
    soon: true,
    className: `${PADDING} lg:col-start-4 lg:row-start-3`,
  },
]

const TileContent = ({ tile }: { tile: Tile }) => (
  <>
    <div className="flex items-center justify-between gap-3">
      <span className="font-mono text-[10px] font-medium tracking-[0.18em] text-amber-300/70 uppercase">
        {tile.label}
      </span>
      <tile.icon className="size-[18px] shrink-0 text-amber-400/60" />
    </div>

    <div className="mt-3 flex flex-wrap items-center gap-2">
      <h3
        aria-label={tile.soon ? `${tile.title} (Soon)` : tile.title}
        className="text-[15px] font-medium tracking-tight text-white md:text-base"
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

    <p className="mt-2 max-w-[34ch] text-[14px] leading-[1.6] text-white/65 md:text-[15px]">
      {tile.description}
    </p>
  </>
)

export const BentoSection = () => {
  const gridRef = useRef<HTMLDivElement>(null)
  // Reveal immediately when IntersectionObserver is unavailable (or during SSR).
  const [revealed, setRevealed] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const node = gridRef.current
    if (!node || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      aria-labelledby="features-heading"
      className="relative z-10 mx-auto max-w-5xl px-6 py-12 md:py-20"
    >
      <div className="mb-6">
        <p className="mb-1 text-base font-normal text-zinc-500 md:text-lg">What’s inside</p>
        <h2 id="features-heading" className="text-2xl font-medium tracking-tight md:text-3xl">
          <span className="font-normal text-zinc-400">All the pieces,</span>{' '}
          <span className="text-white">finally in one place</span>
        </h2>
      </div>

      <div className="mb-12 h-px w-full bg-zinc-800/80 md:mb-16" />

      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[minmax(180px,auto)]"
      >
        {tiles.map((tile, index) => (
          <GlowCard
            key={tile.id}
            className={tile.className}
            revealed={revealed}
            delay={index * 60}
            glow={tile.glow !== false}
          >
            <TileContent tile={tile} />
            <div
              className={
                tile.fill
                  ? 'mt-auto flex min-h-0 flex-1 flex-col pt-5 [&>*]:h-full'
                  : 'mt-auto pt-5'
              }
            >
              <tile.preview />
            </div>
          </GlowCard>
        ))}
      </div>
    </section>
  )
}
