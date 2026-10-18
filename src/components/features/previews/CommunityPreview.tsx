import type { CSSProperties } from 'react'
import { useCountUp } from '@/lib/useCountUp'

const MEMBERS = [
  { initials: 'AK', tone: 'from-pink-400/60 to-orange-400/30' },
  { initials: 'MJ', tone: 'from-sky-400/60 to-indigo-400/30' },
  { initials: 'RS', tone: 'from-amber-300/60 to-orange-500/30' },
  { initials: 'LP', tone: 'from-emerald-400/60 to-teal-400/30' },
]

const MEMBER_TARGET = 128
// Avatar delays: start at 600ms, 60ms stagger
const AVATAR_BASE_DELAY = 600
const AVATAR_STAGGER = 60

interface CommunityPreviewProps {
  revealed?: boolean
}

export const CommunityPreview = ({ revealed = false }: CommunityPreviewProps) => {
  const memberCount = useCountUp(MEMBER_TARGET, 900, revealed)

  return (
    <div className="w-full" aria-hidden="true">
      <div className="flex items-center">
        <div className="flex -space-x-2.5">
          {MEMBERS.map((member, i) => (
            <span
              key={member.initials}
              className={`bb-avatar flex size-10.5 items-center justify-center rounded-full border-2 border-[#171717] bg-gradient-to-br ${member.tone} text-[12px] font-semibold text-white shadow-sm`}
              style={{ '--bb-avatar-delay': `${AVATAR_BASE_DELAY + i * AVATAR_STAGGER}ms` } as CSSProperties}
            >
              {member.initials}
            </span>
          ))}
        </div>
        <span className="ml-3.5 text-[13px] font-medium text-white">
          {/* Counting number */}
          +<span aria-hidden="true">{memberCount}</span>
          <span className="sr-only">{MEMBER_TARGET}</span>
          {' '}designers
        </span>
      </div>

      <div className="mt-4 space-y-2.5">
        <div className="bb-skeleton h-2.5 w-4/5 rounded-full bg-white/15" />
        <div className="bb-skeleton h-2.5 w-3/5 rounded-full bg-white/15" style={{ animationDelay: '60ms' }} />
        <div className="bb-skeleton h-2.5 w-2/5 rounded-full bg-white/10" style={{ animationDelay: '120ms' }} />
      </div>
    </div>
  )
}
