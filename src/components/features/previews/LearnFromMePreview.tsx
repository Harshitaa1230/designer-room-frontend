interface LearnFromMePreviewProps {
  revealed?: boolean
}

export const LearnFromMePreview = ({ revealed: _revealed }: LearnFromMePreviewProps) => (
  <div
    className="flex min-w-0 w-full flex-1 flex-col rounded-2xl border border-[var(--border-card)] bg-white/[0.04] dark:bg-white/[0.04] light:bg-black/[0.03] backdrop-blur-sm p-6 shadow-lg bb-tip-card"
    aria-hidden="true"
  >
    {/* Row 1: avatar + name/role on left, Watch pill on right */}
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/30 to-amber-300/10 ring-1 ring-black/10 dark:ring-white/10">
          <span className="text-[12px] font-semibold text-amber-700 dark:text-amber-100/90">DR</span>
          <span className="bb-online-dot absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-[var(--bg-page)] bg-emerald-400" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[12px] font-semibold leading-tight text-[var(--text-primary)]">
            Designer Room
          </p>
          <p className="truncate text-[11px] leading-tight text-[var(--text-faint)]">Senior Design Lead</p>
        </div>
      </div>
      <span className="shrink-0 rounded-full border border-[var(--border-card)] bg-black/[0.04] dark:bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-[var(--text-muted)]">
        Watch · 90s
      </span>
    </div>

    {/* Middle: eyebrow + quote + caption */}
    <div className="flex flex-1 flex-col justify-center py-4">
      <p className="font-mono text-[10px] font-medium tracking-[0.16em] text-amber-500/80 dark:text-amber-300/70 uppercase whitespace-nowrap">
        Tip of the week
      </p>
      <p
        className="bb-quote mt-2 leading-[1.3] text-amber-700 dark:text-amber-100"
        style={{
          fontFamily: '"Georgia", "Times New Roman", serif',
          fontStyle: 'italic',
          fontSize: '28px',
          overflowWrap: 'anywhere',
        }}
      >
        Constrain first, decorate second.
      </p>
      <p className="mt-3 border-l-2 border-black/15 dark:border-white/15 pl-3 text-[13px] leading-relaxed text-[var(--text-muted)]">
        A short clip and the messy Figma file behind one decision I make on every project before
        touching a single pixel.
      </p>
    </div>

    {/* Footer */}
    <div className="bb-tip-footer flex items-center justify-between gap-3 pt-1">
      <span className="text-[12px] text-[var(--text-faint)]">New tip every Monday</span>
      <span className="text-[12px] text-[var(--text-faint)]">Next in 3d</span>
    </div>
  </div>
)
