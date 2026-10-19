import { Link } from 'react-router-dom'
import glowPrimary from '@/assets/glow-primary.svg'

// ── Data ─────────────────────────────────────────────────────────────────────

interface Roadmap {
  id: string
  number: string
  title: string
  description: string
  meta: string
  pill: { label: string; active: boolean }
  active: boolean
}

const ROADMAPS: Roadmap[] = [
  {
    id: 'ui-ux',
    number: '01',
    title: 'UI/UX Designer',
    description: 'Research, wireframes, Figma and a case study that gets replies.',
    meta: '6 stages · 38 topics · ~13 hrs',
    pill: { label: 'Full roadmap', active: true },
    active: true,
  },
  {
    id: 'graphic',
    number: '02',
    title: 'Graphic Designer',
    description: 'Layout, type, branding and print. Make things worth stopping for.',
    meta: '3 stages · 16 topics',
    pill: { label: 'Stage 01 live', active: false },
    active: false,
  },
  {
    id: 'product',
    number: '03',
    title: 'Product Designer',
    description: 'Frame problems, prioritise, work with engineers, prove impact.',
    meta: '3 stages · 16 topics',
    pill: { label: 'Stage 01 live', active: false },
    active: false,
  },
  {
    id: 'design-engineer',
    number: '04',
    title: 'Design Engineer',
    description: 'HTML, CSS, tokens and components. Close the Figma-to-browser gap.',
    meta: '3 stages · 16 topics',
    pill: { label: 'Stage 01 live', active: false },
    active: false,
  },
]

// ── Card ──────────────────────────────────────────────────────────────────────

function RoadmapCard({ roadmap }: { roadmap: Roadmap }) {
  return (
    <Link
      to={`/roadmaps/${roadmap.id}`}
      aria-label={`${roadmap.title} — ${roadmap.meta}`}
      className={[
        'roadmap-card group relative flex min-h-[260px] flex-1 min-w-0 flex-col gap-3 rounded-[20px] border p-6',
        'bg-[#11100f] transition-all duration-300',
        'hover:-translate-y-0.5 hover:border-[rgba(255,106,26,0.6)] hover:shadow-[0_0_40px_rgba(255,106,26,0.18)]',
        'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff6a1a]',
        roadmap.active
          ? 'border-[rgba(255,106,0,0.5)] shadow-[0_0_25px_rgba(255,89,0,0.14)]'
          : 'border-[#302923]',
      ].join(' ')}
    >
      {/* Top row: number + pill */}
      <div className="flex items-center justify-between">
        <span
          className={[
            'text-[12px] font-semibold tracking-[1.12px] font-mono',
            roadmap.active ? 'text-[#ff6a00]' : 'text-[#827a73]',
          ].join(' ')}
        >
          {roadmap.number}
        </span>
        <span
          className={[
            'rounded-full px-2.5 py-1 text-[10px] font-medium',
            roadmap.active
              ? 'border border-[rgba(255,106,26,0.4)] bg-[rgba(255,106,26,0.18)] text-[#ff8a4a]'
              : 'border border-white/20 text-white/70',
          ].join(' ')}
        >
          {roadmap.pill.label}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-[28px] font-medium leading-[34px] tracking-[-0.4px] text-white">
        {roadmap.title}
      </h2>

      {/* Description */}
      <p className="max-w-[420px] text-[15px] font-normal leading-[22px] text-[#b6ada4]">
        {roadmap.description}
      </p>

      {/* Bottom row: meta + arrow */}
      <div className="mt-auto flex items-center justify-between">
        <span className="text-[12px] text-white/60">{roadmap.meta}</span>
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
        {/* Row 1 */}
        <div className="flex gap-4">
          {ROADMAPS.slice(0, 2).map((r) => (
            <RoadmapCard key={r.id} roadmap={r} />
          ))}
        </div>
        {/* Row 2 */}
        <div className="flex gap-4">
          {ROADMAPS.slice(2, 4).map((r) => (
            <RoadmapCard key={r.id} roadmap={r} />
          ))}
        </div>
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
