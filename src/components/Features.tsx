// Features data matching Figma design
interface FeatureItem {
  id: string
  title: string
  description: string
  badge?: string
}

const features: FeatureItem[] = [
  {
    id: 'roadmaps',
    title: 'Roadmaps',
    description:
      'Step-by-step learning paths for every design discipline, from UI/UX to branding. No more guessing what to learn next.',
  },
  {
    id: 'theory',
    title: 'Theory',
    description:
      'Real-world design lessons that skip the fluff. Short chapters, clear examples, and quick exercises so the knowledge actually sticks.',
  },
  {
    id: 'challenges',
    title: 'Weekly Challenge',
    description:
      'One theme, seven days, one real design brief. Every week you get a fresh problem to solve, so you build skills.',
  },
  {
    id: 'community',
    title: 'Community (Soon)',
    description:
      'A space for designers to share their work, swap honest feedback, and grow together. Learning is easier when you’re not doing it alone.',
  },
  {
    id: 'progress',
    title: 'Progress & Streaks',
    description:
      'Track every lesson, challenge, and milestone in one place. Daily streaks keep you consistent, so showing up becomes a habit.',
  },
  {
    id: 'learn',
    title: 'Learn From Me',
    description:
      'I’m in the room too. Every week I’ll share design tips and the senior-level tricks that usually take years to pick up. No gatekeeping, just what I wish someone had told me earlier.',
  },
]

export const Features = () => {
  return (
    <section className="relative z-10 mx-auto max-w-5xl px-6 py-12 md:py-20">
      {/* Section Header */}
      <div className="mb-6">
        <p className="mb-1 text-base font-normal text-zinc-500 md:text-lg">What’s inside</p>
        <h2 className="text-2xl font-medium tracking-tight text-white md:text-3xl">
          All the pieces, <span className="font-normal text-zinc-300">finally in one place</span>
        </h2>
      </div>

      {/* Thin Divider Line */}
      <div className="mb-12 h-px w-full bg-zinc-800/80 md:mb-16" />

      {/* 3-Column Features Grid */}
      <div className="grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-3 lg:gap-x-16 lg:gap-y-14">
        {features.map((feature) => (
          <div key={feature.id} className="group flex flex-col transition-all duration-200">
            <h3 className="mb-2.5 text-sm font-medium tracking-tight text-white transition-colors group-hover:text-amber-200/90 md:text-base">
              {feature.title}
            </h3>
            <p className="text-xs leading-relaxed font-normal text-balance text-zinc-400 sm:text-[13px]">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
