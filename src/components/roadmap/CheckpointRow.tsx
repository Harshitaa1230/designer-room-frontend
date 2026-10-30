import type { CheckpointView } from '@/data/roadmapUtils'

interface CheckpointRowProps {
  checkpoint: CheckpointView
}

export function CheckpointRow({ checkpoint }: CheckpointRowProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 border-t border-[var(--border-subtle)] bg-[var(--checkpoint-bg)] px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] sm:gap-x-4 sm:px-6 sm:py-5 lg:gap-x-6 lg:px-8 lg:py-6">
      {/* "CHECKPOINT" label */}
      <span className="col-span-2 text-[11px] font-semibold tracking-[1.32px] text-[var(--accent-label)] sm:col-span-1 sm:shrink-0">
        CHECKPOINT
      </span>

      {/* Task description */}
      <span className="col-span-2 min-w-0 break-words text-[16px] font-medium leading-normal tracking-[-0.1px] text-[var(--text-primary)] sm:col-span-1 sm:text-[18px] lg:text-[20px]">
        {checkpoint.task}
      </span>

      {/* Time estimate */}
      <span className="text-[12px] text-[var(--text-body)] sm:text-[13px] lg:text-[14px]">
        {checkpoint.timeEstimate}
      </span>

      {/* Status pill */}
      {checkpoint.status === 'done' ? (
        <span className="justify-self-end whitespace-nowrap rounded-full bg-[var(--done-pill-bg)] px-3 py-1.5 text-[12px] font-medium text-[var(--accent-soft-text)] sm:px-[14px] sm:py-[7px] sm:text-[13px]">
          ✓&nbsp;&nbsp;Done
        </span>
      ) : (
        <span className="justify-self-end whitespace-nowrap rounded-full border border-[var(--border-subtle)] px-3 py-1.5 text-[12px] text-[var(--text-primary)] sm:px-[17px] sm:py-[9px] sm:text-[13px]">
          See brief →
        </span>
      )}
    </div>
  )
}
