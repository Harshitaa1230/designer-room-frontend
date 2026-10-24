import { Link } from 'react-router-dom'
import type { TopicView } from '@/data/roadmapUtils'
import { getDifficultyLabel, getTopicActionLabel, formatTime } from '@/data/roadmapUtils'

interface TopicRowProps {
  topic: TopicView
  roadmapId: string
}

export function TopicRow({ topic, roadmapId }: TopicRowProps) {
  const actionLabel = getTopicActionLabel(topic.status)
  const isMuted = topic.status === 'done' || topic.status === 'locked'
  const topicHref = `/guidebook/${roadmapId}/${topic.id}`

  // ── Check circle ────────────────────────────────────────────────────────
  const circleBase = 'w-[26px] h-[26px] rounded-full shrink-0 flex items-center justify-center'

  let circleClass = circleBase
  let circleAriaLabel = ''
  let circleInner: React.ReactNode = null

  switch (topic.status) {
    case 'done':
      circleClass = `${circleBase} bg-[#ff6a00]`
      circleAriaLabel = 'Completed'
      circleInner = (
        <span className="text-[#080808] text-[14px] font-semibold leading-none">✓</span>
      )
      break
    case 'in-progress':
      circleClass = `${circleBase} border border-[#302923]`
      circleAriaLabel = 'In progress'
      circleInner = <span className="w-[10px] h-[10px] rounded-full bg-[#ff6a00]" />
      break
    case 'not-started':
      circleClass = `${circleBase} border border-[#302923]`
      circleAriaLabel = 'Not started'
      circleInner = null
      break
    case 'locked':
      circleClass = `${circleBase} border border-[#302923] opacity-40`
      circleAriaLabel = 'Locked'
      circleInner = null
      break
  }

  return (
    <div className="grid grid-cols-[26px_minmax(0,1fr)] items-center gap-x-3 gap-y-2 border-t border-[#302923] px-4 py-4 sm:gap-x-4 sm:px-6 lg:flex lg:items-center lg:gap-5 lg:px-8 lg:py-5">
      {/* Check circle */}
      <div
        className={`${circleClass} col-start-1 row-start-1 lg:col-auto lg:row-auto`}
        aria-label={circleAriaLabel}
      >
        {circleInner}
      </div>

      {/* Title */}
      <Link
        to={topicHref}
        className={[
          'col-start-2 row-start-1 min-w-0 break-words text-[16px] font-medium leading-normal sm:text-[18px] lg:col-auto lg:row-auto lg:flex-1 hover:text-[#ff8a4a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6a00]',
          isMuted ? 'text-[#827a73]' : 'text-[#fff8ee]',
        ].join(' ')}
      >
        {topic.title}
      </Link>

      {/* Metadata + action: second row on mobile, inline on desktop */}
      <div className="col-span-2 row-start-2 flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-4 lg:col-auto lg:row-auto lg:ml-auto lg:flex-nowrap lg:gap-5">
        {/* Needs pill (locked topics only) */}
        {topic.needsStage !== undefined && (
          <span className="shrink-0 whitespace-nowrap rounded-full border border-[#302923] px-3 py-1.5 text-[11px] text-[#827a73] sm:text-[12px]">
            Needs: Stage 0{topic.needsStage}
          </span>
        )}

        {/* Difficulty slot */}
        <span className="text-[12px] text-[#b6ada4] sm:text-[13px] lg:w-[130px] lg:shrink-0">
          {getDifficultyLabel(topic.difficulty)}
        </span>

        {/* Time slot */}
        <span className="text-[12px] text-[#827a73] sm:text-[13px] lg:w-[60px] lg:shrink-0 lg:text-right lg:text-[14px]">
          {formatTime(topic.timeMinutes)}
        </span>

        {/* Action slot */}
        <div className="ml-auto flex items-center justify-end lg:ml-0 lg:w-[90px] lg:shrink-0">
          {actionLabel === 'review' && (
            <Link
              to={topicHref}
              className="inline-flex min-h-[36px] items-center px-1 text-[13px] text-[#827a73] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6a00] sm:min-h-0"
            >
              Review
            </Link>
          )}
          {actionLabel === 'start' && (
            <Link
              to={topicHref}
              className="inline-flex min-h-[36px] items-center rounded-full border border-[#ff6a00] px-3 py-1.5 text-[12px] text-[#ff6a00] hover:bg-[rgba(255,106,0,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6a00] sm:min-h-0 sm:px-[12px] sm:py-[4px]"
            >
              Start →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
