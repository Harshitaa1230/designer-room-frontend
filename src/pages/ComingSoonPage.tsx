import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Sparkles, Trophy, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Seo } from '@/components/Seo'

type ComingSoonKind = 'challenge' | 'community'

interface ComingSoonCopy {
  eyebrow: string
  title: string
  description: string
  icon: LucideIcon
  points: string[]
}

const COPY: Record<ComingSoonKind, ComingSoonCopy> = {
  challenge: {
    eyebrow: 'Weekly challenge',
    title: 'The weekly challenge is almost here.',
    description:
      'One theme. Seven days. A small brief that turns the theory you just read into something you can show.',
    icon: Trophy,
    points: [
      'A new brief every week',
      'A focused scope you can actually finish',
      'A place to share the result when you are done',
    ],
  },
  community: {
    eyebrow: 'Community',
    title: 'The community is almost here.',
    description:
      'Blogs, showcases and honest critique from people learning the same things, building in the open.',
    icon: Users,
    points: [
      'Member blogs and design breakdowns',
      'A showcase for work in progress',
      'Critique that helps the work get better',
    ],
  },
}

interface ComingSoonPageProps {
  kind: ComingSoonKind
}

export function ComingSoonPage({ kind }: ComingSoonPageProps) {
  const copy = COPY[kind]
  const Icon = copy.icon

  useEffect(() => {
    document.title = `${copy.eyebrow} coming soon · Designers Room`
  }, [copy.eyebrow])

  return (
    <section
      aria-labelledby="coming-soon-title"
      className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--bg-page)] px-5 pt-28 pb-20 text-[var(--text-primary)] sm:px-8 sm:pt-32"
    >
      <Seo title={`${copy.eyebrow} coming soon · Designers Room`} description={copy.description} />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[360px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,#ff7a29_0%,#ea580c_35%,transparent_70%)] opacity-30 blur-[90px] light:opacity-15"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[-160px] bottom-[-180px] h-[360px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,#c2410c_0%,transparent_70%)] opacity-25 blur-[100px] light:opacity-15"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl text-center">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl border border-[var(--border-accent)] bg-[var(--accent-soft)] text-[var(--accent-text)]">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-accent)] bg-[var(--accent-soft)] px-3.5 py-1.5 text-[11px] font-medium tracking-[0.12em] text-[var(--accent-text)] uppercase">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          Coming soon
        </span>

        <p className="mt-6 text-[11px] font-medium tracking-[0.18em] text-[var(--text-muted)] uppercase">
          {copy.eyebrow}
        </p>
        <h1
          id="coming-soon-title"
          className="mt-3 text-[34px] leading-[1.05] font-medium tracking-[-0.03em] text-[var(--text-primary)] sm:text-[52px]"
        >
          {copy.title}
        </h1>
        <p className="mx-auto mt-5 max-w-[52ch] text-[15px] leading-7 text-[var(--text-body)] sm:text-[17px]">
          {copy.description}
        </p>

        <ul className="mx-auto mt-8 flex max-w-md flex-col gap-2.5 text-left">
          {copy.points.map((point) => (
            <li
              key={point}
              className="flex items-start gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-3 text-[13px] leading-6 text-[var(--text-soft)] sm:text-[14px]"
            >
              <span
                className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                aria-hidden="true"
              />
              {point}
            </li>
          ))}
        </ul>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/guidebook"
            className="btn-3d inline-flex min-h-[44px] w-full items-center justify-center gap-2 px-6 py-3 text-[14px] sm:w-auto"
          >
            Explore the guidebook
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to="/"
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-[var(--border-subtle)] px-6 py-3 text-[14px] font-medium text-[var(--text-soft)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-text)] sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back home
          </Link>
        </div>

        <p className="mt-6 text-[12px] text-[var(--text-muted)]">
          Want a nudge when it opens?{' '}
          <Link
            to="/waitlist"
            className="text-[var(--accent-text)] underline underline-offset-2 hover:text-[var(--accent-strong)]"
          >
            Join the waitlist
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
