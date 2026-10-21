import type { StageData } from '@/data/roadmapData'

interface ThePathTimelineProps {
  stages: StageData[]
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
    <div className="px-8 sm:px-12 md:px-16 py-[0px] flex flex-col gap-0">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-0 pb-[28px]">
        {/* Left block */}
        <div className="flex flex-col gap-[4px]">
          <span className="text-[12px] text-[#827a73]">(The path)</span>
          <span className="text-[28px] font-medium text-[#fff8ee] leading-[34px] tracking-[-0.3px]">
            {pace}
          </span>
        </div>

        {/* Right pills */}
        <div className="flex gap-[10px]">
          <button
            type="button"
            onClick={onExpandAll}
            aria-label="Expand all stages"
            className="border border-[#302923] rounded-full px-[17px] py-[9px] text-[13px] text-[#b6ada4] hover:text-white hover:border-[#504740] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6a00]"
          >
            Expand all
          </button>
          <button
            type="button"
            onClick={onCollapseAll}
            aria-label="Collapse all stages"
            className="border border-[#302923] rounded-full px-[17px] py-[9px] text-[13px] text-[#b6ada4] hover:text-white hover:border-[#504740] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6a00]"
          >
            Collapse all
          </button>
        </div>
      </div>

      {/* Timeline segments row */}
      <div className="flex gap-[12px] overflow-x-auto pb-[8px]">
        {stages.map((stage) => (
          <div key={stage.id} className="flex-1 min-w-[120px] flex flex-col gap-[8px]">
            {/* Top bar */}
            <div
              className={`h-[4px] rounded-full w-full ${
                stage.status === 'done' || stage.status === 'in-progress'
                  ? 'bg-[#ff6a00]'
                  : 'bg-[#302923]'
              }`}
            />
            {/* Stage + week label */}
            <span className="text-[12px] text-[#827a73]">
              {stage.number}&nbsp;&nbsp;·&nbsp;&nbsp;{stage.weekLabel}
            </span>
            {/* Stage name */}
            <span className="text-[16px] font-medium text-[#fff8ee]">{stage.name}</span>
            {/* Topics count */}
            <span className="text-[13px] text-[#b6ada4]">{stage.topics.length} topics</span>
          </div>
        ))}
      </div>
    </div>
  )
}
