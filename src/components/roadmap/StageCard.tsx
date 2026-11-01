import type { StageView } from '@/data/roadmapUtils'
import { TopicRow } from './TopicRow'
// import { CheckpointRow } from './CheckpointRow'

interface StageCardProps {
  stage: StageView
  roadmapId: string
  isOpen: boolean
  onToggle: () => void
}

export function StageCard({ stage, roadmapId, isOpen, onToggle }: StageCardProps) {
  const progressPercent =
    stage.totalTopics > 0 ? Math.round((stage.completedTopics / stage.totalTopics) * 100) : 0

  return (
    <div className="overflow-hidden rounded-[16px] border border-[var(--border-subtle)] bg-[var(--bg-card)] sm:rounded-[24px]">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-3 gap-y-3 p-4 sm:gap-x-4 sm:p-6 lg:flex lg:items-center lg:gap-6 lg:p-8">
        {/* Stage number */}
        <span className="col-start-1 row-start-1 shrink-0 text-[13px] font-semibold tracking-[1.12px] text-[var(--text-muted)] sm:text-[14px] lg:col-auto lg:row-auto">
          {stage.number}
        </span>

        {/* Title block */}
        <div className="col-start-2 row-start-1 flex min-w-0 flex-col gap-1.5 sm:gap-2 lg:col-auto lg:row-auto lg:flex-1">
          <span className="break-words text-[22px] font-medium leading-tight tracking-[-0.3px] text-[var(--text-primary)] sm:text-[26px] lg:text-[30px] lg:leading-none">
            {stage.name}
          </span>

          <span className="break-words text-[14px] leading-normal text-[var(--text-muted)] sm:text-[15px]">
            {stage.subtitle}
          </span>

          <div className="flex flex-wrap items-start gap-x-2 gap-y-1">
            <span className="shrink-0 text-[11px] font-semibold tracking-[1.1px] text-[var(--accent-label)]">
              BY THE END
            </span>
            <span className="min-w-0 break-words text-[13px] text-[var(--text-body)] sm:text-[14px]">
              {stage.byTheEnd}
            </span>
          </div>
        </div>

        {/* Mobile: status + progress stack under the title. Desktop: inline. */}
        <div className="col-span-3 row-start-2 flex flex-col gap-2.5 lg:contents">
          {/* Prerequisite OR done pill */}
          {stage.prerequisiteStage !== null && stage.status !== 'done' ? (
            <span className="self-start whitespace-nowrap rounded-full border border-[var(--border-subtle)] px-3 py-1.5 text-[11px] text-[var(--text-muted)] sm:text-[12px] lg:self-auto lg:px-[13px] lg:py-[7px]">
              Needs: Stage 0{stage.prerequisiteStage}
            </span>
          ) : stage.status === 'done' ? (
            <span className="self-start whitespace-nowrap rounded-full bg-[var(--done-pill-bg)] px-3 py-1.5 text-[12px] font-medium text-[var(--accent-soft-text)] sm:text-[13px] lg:self-auto lg:px-[14px] lg:py-[7px]">
              ✓&nbsp;&nbsp;Done
            </span>
          ) : null}

          {/* Progress fraction + bar */}
          <div className="flex items-center gap-3 lg:flex-col lg:items-end lg:gap-1.5">
            <span className="shrink-0 text-[13px] text-[var(--text-muted)] sm:text-[14px]">
              {stage.completedTopics} / {stage.totalTopics}
            </span>
            <div className="h-[4px] flex-1 overflow-hidden rounded-full bg-[var(--border-subtle)] lg:w-[96px] lg:flex-none">
              <div className="h-full bg-[var(--accent)]" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Toggle button */}
        <button
          type="button"
          onClick={onToggle}
          aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${stage.name} stage`}
          className="col-start-3 row-start-1 flex size-9 shrink-0 items-center justify-center justify-self-end rounded-full border border-[var(--border-subtle)] text-[22px] font-light leading-none text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-text)] lg:col-auto lg:row-auto lg:size-auto lg:border-0"
        >
          {isOpen ? '−' : '+'}
        </button>
      </div>

      {/* Collapsible body */}
      {isOpen && (
        <div>
          {stage.topics.map((topic) => (
            <TopicRow key={topic.id} topic={topic} roadmapId={roadmapId} />
          ))}
          {/* Checkpoints are temporarily hidden from the frontend. */}
          {/* {stage.checkpoints.map((checkpoint) => (
            <CheckpointRow key={checkpoint.id} checkpoint={checkpoint} />
          ))} */}
        </div>
      )}
    </div>
  )
}
