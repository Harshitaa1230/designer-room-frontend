import type { CheckpointView } from '@/data/roadmapUtils'

interface CheckpointRowProps {
  checkpoint: CheckpointView
}

export function CheckpointRow({ checkpoint }: CheckpointRowProps) {
  return (
    <div className="flex gap-[24px] items-center px-[32px] py-[24px] border-t border-[#302923] bg-[rgba(74,27,12,0.35)]">
      {/* "CHECKPOINT" label */}
      <span className="text-[11px] font-semibold text-[#ff6a00] tracking-[1.32px] shrink-0">
        CHECKPOINT
      </span>

      {/* Task description */}
      <span className="text-[20px] font-medium text-[#fff8ee] tracking-[-0.1px] leading-normal min-w-0 flex-1">
        {checkpoint.task}
      </span>

      {/* Time estimate */}
      <span className="text-[14px] text-[#b6ada4] shrink-0 whitespace-nowrap">
        {checkpoint.timeEstimate}
      </span>

      {/* Status pill */}
      {checkpoint.status === 'done' ? (
        <span className="bg-[#4a1b0c] rounded-full px-[14px] py-[7px] text-[13px] font-medium text-[#ffd0a3] shrink-0">
          ✓&nbsp;&nbsp;Done
        </span>
      ) : (
        <span className="border border-[#302923] rounded-full px-[17px] py-[9px] text-[13px] text-[#fff8ee] shrink-0">
          See brief →
        </span>
      )}
    </div>
  )
}
