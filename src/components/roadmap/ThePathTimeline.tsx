import type { StageView } from '@/data/roadmapUtils'

interface ThePathTimelineProps {
  stages: StageView[]
  pace: string
  onExpandAll: () => void
  onCollapseAll: () => void
}

export default function ThePathTimeline({
  stages,
  pace,
  onExpandAll,
  onCollapseAll,
}: ThePathTimelineProps) {
  return (
    <div className="px-5 sm:px-12 md:px-16 py-[0px] flex flex-col gap-0">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-0 pb-[20px] sm:pb-[28px]">
        {/* Left block */}
        <div className="flex flex-col gap-[4px]">
          <span className="text-[12px] text-[var(--text-muted)]">The path</span>
          <span className="text-[24px] font-medium text-[var(--text-primary)] leading-[30px] tracking-[-0.3px] sm:text-[28px] sm:leading-[34px]">
            {pace}
          </span>
        </div>

        {/* Right pills */}
        <div className="flex flex-wrap gap-[8px] sm:gap-[10px]">
          <button
            type="button"
            onClick={onExpandAll}
            aria-label="Expand all stages"
            className="min-h-[36px] border border-[var(--border-subtle)] rounded-full px-[14px] py-[7px] text-[12px] text-[var(--text-body)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-text)] sm:min-h-0 sm:px-[17px] sm:py-[9px] sm:text-[13px]"
          >
            Expand all
          </button>
          <button
            type="button"
            onClick={onCollapseAll}
            aria-label="Collapse all stages"
            className="min-h-[36px] border border-[var(--border-subtle)] rounded-full px-[14px] py-[7px] text-[12px] text-[var(--text-body)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-text)] sm:min-h-0 sm:px-[17px] sm:py-[9px] sm:text-[13px]"
          >
            Collapse all
          </button>
        </div>
      </div>

      {/* Timeline segments row */}
      <div className="flex gap-[10px] sm:gap-[12px] overflow-x-auto pb-[8px] -mx-5 px-5 sm:mx-0 sm:px-0">
        {stages.map((stage) => (
          <div key={stage.id} className="flex-1 min-w-[140px] sm:min-w-[160px] flex flex-col gap-[8px]">
            {/* Top bar */}
            <div
              className={`h-[4px] rounded-full w-full ${
                stage.status === 'done' || stage.status === 'in-progress'
                  ? 'bg-[var(--accent)]'
                  : 'bg-[var(--border-subtle)]'
              }`}
            />
            {/* Stage + week label */}
            <span className="text-[12px] text-[var(--text-muted)]">
              {stage.weekLabel
                ? `${stage.number}\u00a0\u00a0·\u00a0\u00a0${stage.weekLabel}`
                : stage.number}
            </span>
            {/* Stage name */}
            <span className="text-[16px] font-medium text-[var(--text-primary)]">{stage.name}</span>
            {/* Topics count */}
            <span className="text-[13px] text-[var(--text-body)]">
              {stage.topics.length} topic{stage.topics.length === 1 ? '' : 's'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
