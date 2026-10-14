const MEMBERS = [
  { initials: 'AK', tone: 'from-pink-400/50 to-orange-400/20' },
  { initials: 'MJ', tone: 'from-sky-400/50 to-indigo-400/20' },
  { initials: 'RS', tone: 'from-amber-300/50 to-orange-500/20' },
  { initials: 'LP', tone: 'from-emerald-400/50 to-teal-400/20' },
]

export const CommunityPreview = () => (
  <div className="w-full opacity-60" aria-hidden="true">
    <div className="flex items-center">
      <div className="flex -space-x-2.5">
        {MEMBERS.map((member) => (
          <span
            key={member.initials}
            className={`flex size-9 items-center justify-center rounded-full border-2 border-[#171717] bg-gradient-to-br ${member.tone} text-[10px] font-semibold text-white/80`}
          >
            {member.initials}
          </span>
        ))}
      </div>
      <span className="ml-3 text-[12px] text-white/50">+128 designers</span>
    </div>

    <div className="mt-4 space-y-2">
      <div className="h-2 w-4/5 rounded-full bg-white/10" />
      <div className="h-2 w-3/5 rounded-full bg-white/10" />
    </div>
  </div>
)
