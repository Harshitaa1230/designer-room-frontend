import type { RoadmapData, ProgressState } from '@/data/roadmapData'
import ProgressCard from './ProgressCard'

interface PageHeaderProps {
  roadmap: RoadmapData
  progress: ProgressState
}

/**
 * Page header section for the roadmap detail page.
 * Displays the roadmap identity (label, title, subtitle, meta pills),
 * a ProgressCard, and discipline tabs.
 *
 * Requirements: 2.1, 2.2, 2.3, 2.11
 */
export default function PageHeader({ roadmap, progress }: PageHeaderProps) {
  return (
    <section className="px-8 sm:px-12 md:px-16 pt-[40px] pb-[32px] flex flex-col gap-[40px]">
      {/* Title row: left block + ProgressCard */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 md:gap-6">
        {/* Left block */}
        <div className="flex flex-col gap-[20px] flex-1 min-w-0">
          {/* Roadmap label e.g. "(Roadmap 01)" */}
          <span className="text-[12px]" style={{ color: '#827a73' }}>
            {roadmap.label}
          </span>

          {/* Large title */}
          <h1
            className="text-[64px] md:text-[96px] font-medium leading-[1] whitespace-pre-line"
            style={{
              color: '#fff8ee',
              letterSpacing: '-2.88px',
            }}
          >
            {roadmap.title}
          </h1>

          {/* Subtitle */}
          <p
            className="text-[18px] font-normal leading-[28px] max-w-[560px]"
            style={{ color: '#b6ada4' }}
          >
            {roadmap.subtitle}
          </p>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-[10px]">
            {roadmap.metaPills.map((pill) => (
              <span
                key={pill}
                className="rounded-full px-[14px] py-[7px] text-[13px]"
                style={{
                  border: '1px solid #302923',
                  color: '#b6ada4',
                }}
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* Right block: ProgressCard */}
        <div className="shrink-0 w-full md:w-auto">
          <ProgressCard
            completedTopics={progress.completedTopics}
            totalTopics={progress.totalTopics}
            continueTopicTitle={progress.continueTopicTitle}
          />
        </div>
      </div>

      {/* Discipline tabs row */}
      <div className="flex flex-wrap gap-[12px]">
        {roadmap.disciplines.map((discipline) =>
          discipline.active ? (
            <button
              key={discipline.label}
              type="button"
              className="rounded-full px-[20px] py-[11px] text-[14px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6a00]"
              style={{ background: '#fff8ee', color: '#080808' }}
            >
              {discipline.label}
            </button>
          ) : (
            <button
              key={discipline.label}
              type="button"
              className="rounded-full px-[20px] py-[11px] text-[14px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6a00]"
              style={{ border: '1px solid #302923', color: '#b6ada4' }}
            >
              {discipline.label}
            </button>
          )
        )}
      </div>
    </section>
  )
}
