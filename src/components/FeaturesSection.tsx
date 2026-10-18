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
    className="mx-auto w-full max-w-[1440px] px-8 sm:px-12 md:px-16 pt-16 md:pt-24 pb-24"
  >
    {/* Eyebrow */}
    <p
      id="features-list-heading"
      className="mb-6 text-[12px] text-[#827a73] light:text-zinc-400"
    >
      (What's inside)
    </p>

    {/* Divider */}
    <div className="h-px w-full bg-[#1e1c1a] light:bg-zinc-200" />

    {/* Feature rows */}
    <ul className="divide-y divide-[#1e1c1a] light:divide-zinc-200">
      {FEATURES.map((f) => (
        <li key={f.number}>
          <Link
            to={f.href}
            className="group flex w-full items-center gap-6 py-7 transition-opacity hover:opacity-80 sm:py-8"
          >
            {/* Number */}
            <span className="w-8 shrink-0 text-[13px] font-normal text-[#827a73] light:text-zinc-400">
              {f.number}
            </span>

            {/* Feature name */}
            <span className="flex-1 text-[56px] font-normal leading-none tracking-[-1px] text-white light:text-zinc-900 sm:text-[72px] md:text-[80px] lg:text-[96px]">
              {f.name}
            </span>

            {/* Right: pill + tagline */}
            <div className="hidden items-center gap-3 sm:flex">
              <span
                className={[
                  'rounded-full border px-3 py-1 text-[11px] font-medium',
                  f.status === 'live'
                    ? 'border-[#ff6a00]/50 text-[#ff6a00]'
                    : 'border-[#302923] text-[#827a73] light:border-zinc-300 light:text-zinc-400',
                ].join(' ')}
              >
                {f.status === 'live' ? 'Live' : 'Soon'}
              </span>
              <span className="text-[13px] text-[#827a73] light:text-zinc-400">
                {f.tagline}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  </section>
)
