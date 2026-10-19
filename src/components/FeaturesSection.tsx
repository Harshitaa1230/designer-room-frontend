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
    href: '/roadmaps',
  },
  {
    number: '02',
    name: 'Theory',
    status: 'live',
    tagline: 'Chapters, quizzes, zero fluff',
    href: '/theory',
  },
  {
    number: '03',
    name: 'Challenge',
    status: 'live',
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
    className="mx-auto w-full max-w-[1440px] px-8 sm:px-12 md:px-16 pt-16 pb-24"
  >
    {/* Eyebrow */}
    <p
      id="features-list-heading"
      className="mb-6 text-[13px] text-white/65 light:text-zinc-500"
    >
      (What's inside)
    </p>

    {/* Feature rows */}
    <ul className="feature-list border-t border-white/[0.08] light:border-zinc-200">
      {FEATURES.map((f) => (
        <li key={f.number}>
          <Link
            to={f.href}
            className="feature-row group w-full cursor-pointer py-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
          >
            {/* Number */}
            <span className="text-[13px] font-normal tabular-nums text-white/50 light:text-zinc-400">
              {f.number}
            </span>

            {/* Feature name */}
            <span className="feature-title text-[40px] font-normal leading-none tracking-[-1px] text-white light:text-zinc-900 sm:text-[48px] md:text-[56px] lg:text-[64px]">
              {f.name}
            </span>

            {/* Status pill */}
            <span
              className={[
                'feature-pill inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium',
                f.status === 'live'
                  ? 'border-[#ff8a4a]/50 text-[#ff8a4a]'
                  : 'border-white/20 text-white/50 light:border-zinc-300 light:text-zinc-400',
              ].join(' ')}
            >
              {f.status === 'live' && (
                <span
                  className="size-1.5 rounded-full bg-[#ff8a4a] shadow-[0_0_6px_#ff8a4a]"
                  aria-hidden="true"
                />
              )}
              {f.status === 'live' ? 'Live' : 'Soon'}
            </span>

            {/* Description */}
            <span className="feature-desc text-[15px] text-white/70 light:text-zinc-500">
              {f.tagline}
            </span>

            {/* Fixed arrow slot — always reserved, shown on hover */}
            <span className="feature-arrow-slot" aria-hidden="true">
              <span className="feature-arrow translate-x-2 text-[18px] leading-none text-white/70 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                ↗
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </section>
)
