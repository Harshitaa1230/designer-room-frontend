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
        'group relative flex h-[360px] flex-1 min-w-0 flex-col gap-5 rounded-[28px] border p-10',
        'bg-[#11100f] transition-all duration-300',
        'hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(255,89,0,0.08)]',
        roadmap.active
          ? 'border-[rgba(255,106,0,0.5)] shadow-[0_0_25px_rgba(255,89,0,0.14)]'
          : 'border-[#302923]',
      ].join(' ')}
    >
      {/* Top row: number + pill */}
      <div className="flex items-center justify-between">
        <span
          className={[
            'text-[14px] font-semibold tracking-[1.12px] font-mono',
            roadmap.active ? 'text-[#ff6a00]' : 'text-[#827a73]',
          ].join(' ')}
        >
          {roadmap.number}
        </span>
        <span
          className={[
            'rounded-full px-3 py-1.5 text-[12px] font-medium',
            roadmap.active
              ? 'bg-[#4a1b0c] text-[#ffd0a3]'
              : 'border border-[#302923] text-[#b6ada4]',
          ].join(' ')}
        >
          {roadmap.pill.label}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-[44px] font-medium leading-[48px] tracking-[-0.66px] text-white">
        {roadmap.title}
      </h2>

      {/* Description */}
      <p className="text-[17px] font-normal leading-[26px] text-[#b6ada4] max-w-[520px]">
        {roadmap.description}
      </p>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom row: meta + arrow */}
      <div className="flex items-center justify-between">
        <span className="text-[14px] text-[#827a73]">{roadmap.meta}</span>
        <span
          className={[
            'text-[28px] font-light transition-transform duration-300',
            'group-hover:translate-x-1',
            'text-[#ff6a00]',
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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#080808] text-white pt-24">

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
      <header className="relative z-10 flex flex-col gap-5 px-16 pb-12 pt-14">
        <p className="text-[12px] text-[#827a73]">(Roadmaps)</p>
        <h1 className="text-[120px] font-medium leading-[120px] tracking-[-4.8px] text-white whitespace-nowrap">
          Pick your path.
        </h1>
        <p className="w-[640px] text-[20px] font-normal leading-[30px] text-[#b6ada4]">
          Step-by-step plans you can actually finish. Tick things off, watch the bar move, switch
          paths anytime.
        </p>
      </header>

      {/* ── Grid ── */}
      <main className="relative z-10 flex flex-col gap-4 px-16 pb-24">
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
      <footer className="relative z-10 flex items-center justify-between border-t border-[#302923] px-16 py-10">
        <p className="text-[12px] text-[#827a73]">© 2026 Designer's Room · Beta 1</p>
        <button
          type="button"
          className="rounded-full border border-[#302923] px-[18px] py-[9px] text-[13px] font-medium text-white transition-colors hover:border-[#504740] hover:bg-white/[0.04]"
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
