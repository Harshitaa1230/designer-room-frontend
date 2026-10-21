import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import glowPrimary from '@/assets/glow-primary.svg'
import { listRoadmaps, type RoadmapSummary } from '@/lib/endpoints'
import { messageOf } from '@/lib/api'
import { Spinner } from '@/components/LoadingState'

// ── Card ──────────────────────────────────────────────────────────────────────

function RoadmapCard({ roadmap }: { roadmap: RoadmapSummary }) {
  const number = String(roadmap.position).padStart(2, '0')
  const meta = `${roadmap.stageCount} stage${roadmap.stageCount === 1 ? '' : 's'} · ${
    roadmap.topicCount
  } topic${roadmap.topicCount === 1 ? '' : 's'}`
  const pill = roadmap.metadata?.label ?? 'Full roadmap'

  return (
    <Link
      to={`/roadmaps/${roadmap.id}`}
      aria-label={`${roadmap.title} — ${meta}`}
      className={[
        'roadmap-card group relative flex min-h-[260px] flex-1 min-w-0 flex-col gap-3 rounded-[20px] border p-6',
        'bg-[#11100f] transition-all duration-300',
        'hover:-translate-y-0.5 hover:border-[rgba(255,106,26,0.6)] hover:shadow-[0_0_40px_rgba(255,106,26,0.18)]',
        'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff6a1a]',
        'border-[#302923]',
      ].join(' ')}
    >
      {/* Top row: number + pill */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold tracking-[1.12px] font-mono text-[#827a73]">
          {number}
        </span>
        <span className="rounded-full border border-white/20 px-2.5 py-1 text-[10px] font-medium text-white/70">
          {pill}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-[28px] font-medium leading-[34px] tracking-[-0.4px] text-white">
        {roadmap.title}
      </h2>

      {/* Description */}
      <p className="max-w-[420px] text-[15px] font-normal leading-[22px] text-[#b6ada4]">
        {roadmap.description ?? roadmap.metadata?.subtitle ?? ''}
      </p>

      {/* Bottom row: meta + arrow */}
      <div className="mt-auto flex items-center justify-between">
        <span className="text-[12px] text-white/60">{meta}</span>
        <span
          className={[
            'roadmap-card-arrow text-[20px] font-light transition-all duration-[250ms]',
            'text-white/40',
            'group-hover:translate-x-1 group-hover:text-[#ff6a1a]',
            'group-focus-visible:translate-x-1 group-focus-visible:text-[#ff6a1a]',
          ].join(' ')}
          aria-hidden="true"
        >
          →
        </span>
      </div>
    </Link>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function RoadmapsPage() {
  const roadmaps = useQuery({
    queryKey: ['roadmaps'],
    queryFn: () => listRoadmaps({ limit: 50 }),
  })

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#080808] text-white pt-20">

      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-[300px] top-[-240px] h-[420px] w-[820px] select-none"
        aria-hidden="true"
      >
        <img
          src={glowPrimary}
          alt=""
          className="absolute block"
          style={{
            inset: '-38.1% -19.51%',
            width: 'calc(100% + 39.02%)',
            height: 'calc(100% + 76.2%)',
            maxWidth: 'none',
          }}
        />
      </div>

      {/* ── Header ── */}
      <header className="relative z-10 flex flex-col gap-3 px-8 pb-8 pt-8 sm:px-12 md:px-16">
        <p className="text-[13px] text-white/65">(Roadmaps)</p>
        <h1 className="text-[32px] leading-none font-medium tracking-[-0.03em] text-white sm:text-[36px] md:text-[40px] lg:text-[44px]">
          Pick your path.
        </h1>
        <p className="max-w-[52ch] text-[16px] font-normal leading-[24px] text-white/[0.72] text-balance">
          Step-by-step plans you can actually finish. Tick things off, watch the bar move, switch
          paths anytime.
        </p>
      </header>

      {/* ── Grid ── */}
      <main className="relative z-10 flex flex-col gap-4 px-8 pb-16 sm:px-12 md:px-16">
        {roadmaps.isPending && (
          <div className="flex items-center gap-2 rounded-[20px] border border-[#302923] bg-[#11100f] p-6 text-sm text-[#827a73]">
            <Spinner /> Loading roadmaps…
          </div>
        )}
        {roadmaps.isError && (
          <div className="flex flex-wrap items-center gap-3 rounded-[20px] border border-[#302923] bg-[#11100f] p-6">
            <p className="text-sm text-[#ff6a1a]">
              {messageOf(roadmaps.error, 'Could not load roadmaps.')}
            </p>
            <button
              type="button"
              onClick={() => void roadmaps.refetch()}
              className="rounded-full border border-[#302923] px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:border-[#504740] hover:bg-white/[0.04]"
            >
              Try again
            </button>
          </div>
        )}
        {roadmaps.data && roadmaps.data.items.length === 0 && (
          <p className="rounded-[20px] border border-[#302923] bg-[#11100f] p-6 text-sm text-[#827a73]">
            No roadmaps have been published yet.
          </p>
        )}
        {roadmaps.data && roadmaps.data.items.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {roadmaps.data.items.map((roadmap) => (
              <RoadmapCard key={roadmap.id} roadmap={roadmap} />
            ))}
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 flex items-center justify-between border-t border-[#302923] px-8 py-8 sm:px-12 md:px-16">
        <p className="text-[12px] text-[#827a73]">© 2026 Designer's Room · Beta 1</p>
        <button
          type="button"
          className="rounded-full border border-[#302923] px-4 py-2 text-[12px] font-medium text-white transition-colors hover:border-[#504740] hover:bg-white/[0.04]"
        >
          Send feedback
        </button>
        <p className="text-[12px] tracking-[0.08em] text-[#827a73] uppercase">
          Practice Is Portfolio
        </p>
      </footer>
    </div>
  )
}
