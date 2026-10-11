interface CtaBannerProps {
  onOpenAuth?: (action: 'signup') => void
}

export const CtaBanner = ({ onOpenAuth }: CtaBannerProps) => {
  return (
    <section className="relative z-10 mx-auto max-w-4xl px-6 pt-6 pb-20 md:pb-28">
      {/* The Glow Card Container */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-700/20 bg-gradient-to-b from-[#241208]/90 via-[#140a04]/95 to-[#090503] px-6 py-16 text-center shadow-[0_20px_60px_-15px_rgba(217,103,58,0.15)] sm:py-20 md:rounded-3xl">
        {/* Ambient Top Radial Light */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-[240px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,#ea580c_0%,#c2410c_50%,transparent_75%)] opacity-60 blur-[60px] filter"
          aria-hidden="true"
        />

        {/* Ambient Subtle Center Light */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(249,115,22,0.18)_0%,transparent_60%)] opacity-40"
          aria-hidden="true"
        />

        {/* SVG Wireframe Illustration: Top Left - Triangle Ruler & Drafting Pencil */}
        <div
          className="pointer-events-none absolute top-6 left-6 opacity-30 select-none sm:opacity-40 md:top-8 md:left-10"
          aria-hidden="true"
        >
          <svg
            width="72"
            height="72"
            viewBox="0 0 72 72"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-amber-200"
          >
            {/* 45-degree triangle ruler */}
            <path d="M12 56 L56 56 L12 12 Z" />
            <path d="M20 48 L44 48 L20 24 Z" strokeDasharray="1.5 1.5" />
            {/* Ruler tick marks */}
            <line x1="20" y1="56" x2="20" y2="52" />
            <line x1="28" y1="56" x2="28" y2="52" />
            <line x1="36" y1="56" x2="36" y2="52" />
            <line x1="44" y1="56" x2="44" y2="52" />
            <line x1="12" y1="20" x2="16" y2="20" />
            <line x1="12" y1="28" x2="16" y2="28" />
            <line x1="12" y1="36" x2="16" y2="36" />
            <line x1="12" y1="44" x2="16" y2="44" />
            {/* Pencil across top corner */}
            <path d="M42 12 L56 26 L52 30 L38 16 Z" />
            <path d="M56 26 L60 22 L56 18 L52 22 Z" />
            <path d="M38 16 L34 14 L36 18 Z" />
          </svg>
        </div>

        {/* SVG Wireframe Illustration: Top Right - Isometric 3D Cylinder & Cube */}
        <div
          className="pointer-events-none absolute top-6 right-6 opacity-30 select-none sm:opacity-40 md:top-8 md:right-10"
          aria-hidden="true"
        >
          <svg
            width="72"
            height="72"
            viewBox="0 0 72 72"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-amber-200"
          >
            {/* Isometric Cylinder top */}
            <ellipse cx="26" cy="22" rx="14" ry="7" />
            <path d="M12 22 V34 C12 38 18 41 26 41 C34 41 40 38 40 34 V22" />
            {/* Isometric Box / Cube overlapping */}
            <path d="M44 32 L58 24 L58 44 L44 52 Z" />
            <path d="M44 32 L30 24 L30 44 L44 52 Z" />
            <path d="M44 32 L30 24 L44 16 L58 24 Z" />
          </svg>
        </div>

        {/* SVG Wireframe Illustration: Bottom Left - Pen Tool Nib / Drafting Curve */}
        <div
          className="pointer-events-none absolute bottom-5 left-8 opacity-25 select-none sm:opacity-35 md:bottom-7 md:left-14"
          aria-hidden="true"
        >
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-amber-200"
          >
            {/* Fountain pen / pen tool nib */}
            <path d="M28 8 L38 24 L32 38 L24 38 L18 24 Z" />
            <circle cx="28" cy="25" r="2" />
            <line x1="28" y1="8" x2="28" y2="23" />
            <line x1="24" y1="38" x2="20" y2="48" />
            <line x1="32" y1="38" x2="36" y2="48" />
          </svg>
        </div>

        {/* SVG Wireframe Illustration: Bottom Right - Isometric Floating Blocks / Polyhedra */}
        <div
          className="pointer-events-none absolute right-8 bottom-5 opacity-25 select-none sm:opacity-35 md:right-14 md:bottom-7"
          aria-hidden="true"
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-amber-200"
          >
            {/* Small isometric diamond cube 1 */}
            <path d="M36 28 L48 21 L48 35 L36 42 Z" />
            <path d="M36 28 L24 21 L24 35 L36 42 Z" />
            <path d="M36 28 L24 21 L36 14 L48 21 Z" />
            {/* Offset mini cube */}
            <path d="M20 40 L28 35 L28 45 L20 50 Z" />
            <path d="M20 40 L12 35 L12 45 L20 50 Z" />
            <path d="M20 40 L12 35 L20 30 L28 35 Z" />
          </svg>
        </div>

        {/* Floating sparkles */}
        <div className="pointer-events-none absolute top-12 left-28 text-amber-200 opacity-25">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
          </svg>
        </div>
        <div className="pointer-events-none absolute right-32 bottom-14 text-amber-200 opacity-25">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
          </svg>
        </div>

        {/* Center Headline & Call To Action */}
        <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center">
          <h2 className="text-2xl leading-snug font-medium tracking-tight text-white sm:text-3xl md:text-[34px]">
            <span>Your room is ready. Come in</span>
            <span className="mt-1 block">and start growing.</span>
          </h2>

          <div className="mt-7">
            <button
              type="button"
              onClick={() => onOpenAuth?.('signup')}
              className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#f4ece1] px-7 py-3 text-xs font-semibold text-zinc-900 shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-200 hover:bg-white active:scale-[0.98] sm:text-sm"
            >
              Create an Account
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
