import type { StageData } from '@/data/roadmapData'
import { TopicRow } from './TopicRow'
import { CheckpointRow } from './CheckpointRow'

interface StageCardProps {
  stage: StageData
  isOpen: boolean
  onToggle: () => void
}

export function StageCard({ stage, isOpen, onToggle }: StageCardProps) {
  const progressPercent =
    stage.totalTopics > 0
      ? Math.round((stage.completedTopics / stage.totalTopics) * 100)
      : 0

  return (
    <div className="bg-[#11100f] border border-[#302923] rounded-[24px] overflow-hidden">
      {/* Header row — always visible */}
      <div className="flex gap-[24px] items-center p-[32px]">
        {/* Stage number */}
        <span className="text-[14px] font-semibold text-[#827a73] tracking-[1.12px] shrink-0">
          {stage.number}
        </span>

        {/* Title block */}
        <div className="flex flex-col gap-[8px] flex-1 min-w-0">
          {/* Stage name */}
          <span className="text-[30px] font-medium text-[#fff8ee] tracking-[-0.3px] leading-none">
            {stage.name}
          </span>

          {/* Subtitle */}
          <span className="text-[15px] text-[#827a73] leading-normal">
            {stage.subtitle}
          </span>

          {/* "BY THE END" inline row */}
          <div className="flex gap-[8px] items-center">
            <span className="text-[11px] font-semibold text-[#ff6a00] tracking-[1.1px] shrink-0">
              BY THE END
            </span>
            <span className="text-[14px] text-[#b6ada4]">{stage.byTheEnd}</span>
          </div>
        </div>

        {/* Prerequisite OR done pill */}
        {stage.prerequisiteStage !== undefined && stage.status !== 'done' ? (
          <span className="border border-[#302923] rounded-full px-[13px] py-[7px] text-[12px] text-[#827a73] shrink-0 whitespace-nowrap">
            Needs: Stage 0{stage.prerequisiteStage}
          </span>
        ) : stage.status === 'done' ? (
          <span className="bg-[#4a1b0c] rounded-full px-[14px] py-[7px] text-[13px] font-medium text-[#ffd0a3] shrink-0 whitespace-nowrap">
            ✓&nbsp;&nbsp;Done
          </span>
        ) : null}

        {/* Progress fraction + bar */}
        <div className="flex flex-col gap-[6px] items-end shrink-0">
          <span className="text-[14px] text-[#827a73]">
            {stage.completedTopics} / {stage.totalTopics}
          </span>
          <div className="w-[96px] h-[4px] rounded-full bg-[#302923] overflow-hidden">
            <div
              className="h-full bg-[#ff6a00]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Toggle button */}
        <button
          type="button"
          onClick={onToggle}
          aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${stage.name} stage`}
          className="text-[24px] font-light text-[#827a73] shrink-0 hover:text-white focus-visible:outline-2 focus-visible:outline-[#ff6a00] focus-visible:outline-offset-2 transition-colors"
        >
          {isOpen ? '−' : '+'}
        </button>
      </div>

      {/* Collapsible body */}
      {isOpen && (
        <div>
          {stage.topics.map(topic => (
            <TopicRow key={topic.id} topic={topic} />
          ))}
          {stage.checkpoints.map(cp => (
            <CheckpointRow key={cp.id} checkpoint={cp} />
          ))}
        </div>
      )}
    </div>
  )
}
