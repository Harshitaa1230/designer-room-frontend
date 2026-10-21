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
    <div className="flex gap-[20px] items-center px-[32px] py-[20px] border-t border-[#302923]">
      {/* Check circle */}
      <div className={circleClass} aria-label={circleAriaLabel}>
        {circleInner}
      </div>

      {/* Title */}
      <Link
        to={topicHref}
        className={[
          'text-[18px] font-medium leading-normal min-w-0 flex-1 hover:text-[#ff8a4a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6a00]',
          isMuted ? 'text-[#827a73]' : 'text-[#fff8ee]',
        ].join(' ')}
      >
        {topic.title}
      </Link>

      {/* Needs pill (locked topics only) */}
      {topic.needsStage !== undefined && (
        <span className="border border-[#302923] rounded-full px-[12px] py-[6px] text-[12px] text-[#827a73] shrink-0 whitespace-nowrap">
          Needs: Stage 0{topic.needsStage}
        </span>
      )}

      {/* Difficulty slot */}
      <span className="w-[130px] shrink-0 text-[13px] text-[#b6ada4]">
        {getDifficultyLabel(topic.difficulty)}
      </span>

      {/* Time slot */}
      <span className="w-[60px] shrink-0 text-right text-[14px] text-[#827a73]">
        {formatTime(topic.timeMinutes)}
      </span>

      {/* Action slot */}
      <div className="w-[90px] shrink-0 flex justify-end">
        {actionLabel === 'review' && (
          <Link to={topicHref} className="text-[13px] text-[#827a73] hover:text-white">
            Review
          </Link>
        )}
        {actionLabel === 'start' && (
          <Link
            to={topicHref}
            className="border border-[#ff6a00] rounded-full px-[12px] py-[4px] text-[12px] text-[#ff6a00] hover:bg-[rgba(255,106,0,0.12)]"
          >
            Start →
          </Link>
        )}
      </div>
    </div>
  )
}
