import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import glowPrimary from '@/assets/glow-primary.svg'
import { listRoadmaps, type RoadmapSummary } from '@/lib/endpoints'
import { messageOf } from '@/lib/api'
import { Spinner } from '@/components/LoadingState'
import { Seo } from '@/components/Seo'

// ── Card ──────────────────────────────────────────────────────────────────────

function RoadmapCard({ roadmap }: { roadmap: RoadmapSummary }) {
  const number = String(roadmap.position).padStart(2, '0')
  const meta = `${roadmap.stageCount} stage${roadmap.stageCount === 1 ? '' : 's'} · ${
    roadmap.topicCount
  } topic${roadmap.topicCount === 1 ? '' : 's'}`
  const pill = roadmap.metadata?.label ?? 'Full roadmap'

  return (
    <Link
      to={`/guidebook/${roadmap.id}`}
      aria-label={`${roadmap.title} — ${meta}`}
      className={[
        'roadmap-card group relative flex w-full min-h-[220px] min-w-0 flex-col gap-3 rounded-[20px] border p-5 sm:min-h-[260px] sm:p-6',
        'bg-[var(--bg-card)] transition-all duration-300',
        'hover:-translate-y-0.5 hover:border-[var(--accent-text)] hover:shadow-[0_18px_40px_-24px_var(--accent-text)]',
        'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-text)]',
        'border-[var(--border-subtle)]',
      ].join(' ')}
    >
      {/* Top row: number + pill */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold tracking-[1.12px] font-mono text-[var(--text-muted)]">
          {number}
        </span>
        <span className="rounded-full border border-[var(--border-card)] px-2.5 py-1 text-[10px] font-medium text-[var(--text-body)]">
          {pill}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-[22px] font-medium leading-[1.25] tracking-[-0.4px] text-[var(--text-primary)] break-words sm:text-[28px] sm:leading-[34px]">
        {roadmap.title}
      </h2>

      {/* Description */}
      <p className="max-w-[420px] text-[14px] font-normal leading-[21px] text-[var(--text-body)] break-words sm:text-[15px] sm:leading-[22px]">
        {roadmap.description ?? roadmap.metadata?.subtitle ?? ''}
      </p>

      {/* Bottom row: meta + arrow */}
      <div className="mt-auto flex items-center justify-between">
        <span className="text-[12px] text-[var(--text-muted)]">{meta}</span>
        <span
          className={[
            'roadmap-card-arrow text-[20px] font-light transition-all duration-[250ms]',
            'text-[var(--text-faint)]',
            'group-hover:translate-x-1 group-hover:text-[var(--accent-text)]',
            'group-focus-visible:translate-x-1 group-focus-visible:text-[var(--accent-text)]',
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
    <div className="relative min-h-screen w-full bg-[var(--bg-page)] text-[var(--text-primary)] pt-20">
      <Seo
        title="Design roadmaps · Designers Room"
        description="Follow practical, step-by-step design roadmaps you can actually finish."
      />

      {/* Background glow — clipped only within this decorative layer */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-[300px] top-[-240px] h-[420px] w-[820px] select-none">
          <img
            src={glowPrimary}
            alt=""
            width="1140"
            height="740"
            className="absolute block light:opacity-60"
            style={{
              inset: '-38.1% -19.51%',
              width: 'calc(100% + 39.02%)',
              height: 'calc(100% + 76.2%)',
              maxWidth: 'none',
            }}
          />
        </div>
      </div>

      {/* ── Header ── */}
      <header className="relative z-10 flex flex-col gap-3 px-5 pb-6 pt-6 sm:px-12 sm:pb-8 sm:pt-8 md:px-16">
        <h1 id="roadmaps-heading" className="text-[28px] leading-none font-medium tracking-[-0.03em] text-[var(--text-primary)] sm:text-[36px] md:text-[40px] lg:text-[44px]">
          Pick your path.
        </h1>
        <p className="max-w-[52ch] text-[15px] font-normal leading-[23px] text-[var(--text-body)] text-balance sm:text-[16px] sm:leading-[24px]">
          Step-by-step plans you can actually finish. Tick things off, watch the bar move, switch
          paths anytime.
        </p>
      </header>

      {/* ── Grid ── */}
      <section aria-labelledby="roadmaps-heading" className="relative z-10 grid grid-cols-1 gap-4 px-5 pb-12 sm:grid-cols-2 sm:px-12 sm:pb-16 md:px-16 lg:grid-cols-4">
        {roadmaps.isPending && (
          <div className="flex items-center gap-2 rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 text-sm text-[var(--text-muted)] sm:col-span-2 lg:col-span-4">
            <Spinner /> Loading roadmaps…
          </div>
        )}
        {roadmaps.isError && (
          <div className="flex flex-wrap items-center gap-3 rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 sm:col-span-2 lg:col-span-4">
            <p className="text-sm text-[var(--accent-text)]">
              {messageOf(roadmaps.error, 'Could not load roadmaps.')}
            </p>
            <button
              type="button"
              onClick={() => void roadmaps.refetch()}
              className="rounded-full border border-[var(--border-subtle)] px-3.5 py-1.5 text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-hover)]"
            >
              Try again
            </button>
          </div>
        )}
        {roadmaps.data && roadmaps.data.items.length === 0 && (
          <p className="rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 text-sm text-[var(--text-muted)] sm:col-span-2 lg:col-span-4">
            No roadmaps have been published yet.
          </p>
        )}
        {roadmaps.data && roadmaps.data.items.length > 0 &&
          roadmaps.data.items.map((roadmap) => (
            <RoadmapCard key={roadmap.id} roadmap={roadmap} />
          ))}
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 flex flex-col items-start gap-3 border-t border-[var(--border-subtle)] px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-12 sm:py-8 md:px-16">
        <p className="text-[12px] text-[var(--text-muted)]">© 2026 Designer's Room · Beta 1</p>
        <button
          type="button"
          className="rounded-full border border-[var(--border-subtle)] px-4 py-2.5 text-[12px] font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-hover)] sm:py-2"
        >
          Send feedback
        </button>
        <p className="text-[12px] tracking-[0.08em] text-[var(--text-muted)] uppercase">
          Practice Is Portfolio
        </p>
      </footer>
    </div>
  )
}
