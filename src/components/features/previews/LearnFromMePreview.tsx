export const LearnFromMePreview = () => (
  <div className="w-full" aria-hidden="true">
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/30 to-amber-300/10 ring-1 ring-white/10">
          <span className="text-[13px] font-semibold text-amber-100/90">DR</span>
          <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-[#171717] bg-emerald-400" />
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[9px] tracking-[0.16em] text-amber-300/60 uppercase">
            Tip of the week
          </p>
          <p className="font-hand text-[26px] leading-none text-amber-100">
            Constrain first, decorate second.
          </p>
        </div>
      </div>
      <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-white/55">
        Watch · 90s
      </span>
    </div>

    <p className="mt-4 border-l border-white/10 pl-3 text-[12px] leading-relaxed text-white/50">
      A short clip and the messy Figma file behind one decision I make on every project before
      touching a single pixel.
    </p>
  </div>
)
