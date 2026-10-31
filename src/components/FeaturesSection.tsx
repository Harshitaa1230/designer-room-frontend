import { Link } from 'react-router-dom'

interface Feature {
  number: string
  name: string
  status: 'live' | 'soon'
  tagline: string
  href: string
}

const FEATURES: Feature[] = [
  {
    number: '01',
    name: 'Roadmaps',
    status: 'live',
    tagline: 'Step-by-step paths for every discipline',
            href: '/guidebook',
  },
  {
    number: '02',
    name: 'Theory',
    status: 'soon',
    tagline: 'Chapters, quizzes, zero fluff',
    href: '/theory',
  },
  {
    number: '03',
    name: 'Challenge',
    status: 'soon',
    tagline: 'One theme. Seven days. Every week.',
    href: '/challenge',
  },
  {
    number: '04',
    name: 'Community',
    status: 'soon',
    tagline: 'Blogs, showcase, honest critique',
    href: '/community',
  },
]

export const FeaturesSection = () => (
  <section
    aria-labelledby="features-list-heading"
    className="mx-auto w-full max-w-[1440px] px-5 pt-12 pb-16 sm:px-12 sm:pt-16 sm:pb-24 md:px-16"
  >

    <h2 id="features-list-heading" className="sr-only">
      What&apos;s inside
    </h2>

    {/* Feature rows */}
    <ul className="feature-list border-t border-white/[0.08] light:border-zinc-200">
      {FEATURES.map((f) => (
        <li key={f.number}>
          <Link
            to={f.href}
            className="feature-row w-full cursor-pointer py-5 focus-visible:outline-2 sm:py-7 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-primary)]"
          >
            {/* Number */}
            <span className="text-[12px] font-normal tabular-nums text-white/50 light:text-zinc-600 sm:text-[13px]">
              {f.number}
            </span>

            {/* Feature name */}
            <span className="feature-title text-[28px] font-normal leading-none tracking-[-0.5px] text-white light:text-zinc-900 sm:text-[44px] sm:tracking-[-1px] md:text-[56px] lg:text-[64px]">
              {f.name}
            </span>

            {/* Status pill */}
            <span
              className={[
                'feature-pill inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium sm:px-3 sm:py-1 sm:text-[11px]',
                f.status === 'live'
                  ? 'border-[var(--border-accent)] text-[var(--accent-text)]'
                  : 'border-white/20 text-white/50 light:border-zinc-400 light:text-zinc-600',
              ].join(' ')}
            >
              {f.status === 'live' && (
                <span
                  className="size-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]"
                  aria-hidden="true"
                />
              )}
              {f.status === 'live' ? 'Live' : 'Soon'}
            </span>

            {/* Description */}
            <span className="feature-desc text-[13px] text-white/70 light:text-zinc-600 sm:text-[15px]">
              {f.tagline}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </section>
)
