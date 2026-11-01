import type { RoadmapMetadata } from '@/lib/endpoints'
import type { ProgressState } from '@/data/roadmapUtils'
import ProgressCard from './ProgressCard'

interface PageHeaderProps {
  title: string
  metadata: RoadmapMetadata | null
  progress: ProgressState
  roadmapId: string
  continueTopicId?: string
}

/**
 * Page header section for the roadmap detail page.
 * Displays the roadmap identity (label, title, subtitle, meta pills),
 * a ProgressCard, and discipline tabs.
 */
export default function PageHeader({
  title,
  metadata,
  progress,
  roadmapId,
  continueTopicId,
}: PageHeaderProps) {
  return (
    <section className="px-5 sm:px-12 md:px-16 pt-[28px] sm:pt-[40px] pb-[24px] sm:pb-[32px] flex flex-col gap-[28px] sm:gap-[40px]">
      {/* Title row: left block + ProgressCard */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 lg:gap-8">
        {/* Left block */}
        <div className="flex flex-col gap-[16px] sm:gap-[20px] flex-1 min-w-0">
          {/* Large title */}
          <h1
            className="text-[42px] sm:text-[64px] md:text-[80px] lg:text-[96px] font-medium leading-[1.02] break-words"
            style={{
              color: 'var(--text-primary)',
              letterSpacing: '-2.88px',
            }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          <p
            className="text-[16px] sm:text-[18px] font-normal leading-[26px] sm:leading-[28px] max-w-[560px] break-words"
            style={{ color: 'var(--text-body)' }}
          >
            {metadata?.subtitle ?? ''}
          </p>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-[8px] sm:gap-[10px]">
            {(metadata?.metaPills ?? []).map((pill) => (
              <span
                key={pill}
                className="rounded-full px-[12px] py-[6px] text-[12px] sm:px-[14px] sm:py-[7px] sm:text-[13px]"
                style={{
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-body)',
                }}
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* Right block: ProgressCard */}
        <div className="shrink-0 w-full lg:w-auto">
          <ProgressCard
            completedTopics={progress.completedTopics}
            totalTopics={progress.totalTopics}
            continueTopicTitle={progress.continueTopicTitle}
            roadmapId={roadmapId}
            continueTopicId={continueTopicId}
          />
        </div>
      </div>

      {/* Discipline tabs row */}
      <div className="flex flex-wrap gap-[8px] sm:gap-[12px]">
        {(metadata?.disciplines ?? []).map((discipline) =>
          discipline.active ? (
            <button
              key={discipline.label}
              type="button"
              className="rounded-full px-[16px] py-[9px] text-[13px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-text)] sm:px-[20px] sm:py-[11px] sm:text-[14px]"
              style={{ background: 'var(--text-primary)', color: 'var(--bg-page)' }}
            >
              {discipline.label}
            </button>
          ) : (
            <button
              key={discipline.label}
              type="button"
              className="rounded-full px-[16px] py-[9px] text-[13px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-text)] sm:px-[20px] sm:py-[11px] sm:text-[14px]"
              style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-body)' }}
            >
              {discipline.label}
            </button>
          ),
        )}
      </div>
    </section>
  )
}
