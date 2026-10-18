const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Threads',   href: 'https://threads.net'   },
  { label: 'LinkedIn',  href: 'https://linkedin.com'  },
  { label: 'X',         href: 'https://x.com'         },
]

export const Footer = () => (
  <footer className="relative w-full overflow-hidden">
    {/* Bottom glow — matches the orange warmth in the screenshot */}
    <div
      className="pointer-events-none absolute bottom-0 left-1/2 h-[320px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_bottom,#ff4500_0%,#c2400c_35%,transparent_70%)] opacity-30 blur-[80px]"
      aria-hidden="true"
    />

    <div className="relative z-10 mx-auto w-full max-w-[1440px] px-8 sm:px-12 md:px-16">
      {/* "Building in public." headline */}
      <p className="pt-20 pb-16 text-[clamp(56px,9vw,120px)] font-normal leading-none tracking-[-3px] text-white light:text-zinc-900">
        Building in public.
      </p>

      {/* Social row + CTA */}
      <div className="flex flex-col items-start justify-between gap-6 pb-12 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-8">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="text-[14px] font-normal text-[#827a73] transition-colors hover:text-white light:text-zinc-400 light:hover:text-zinc-900"
            >
              {s.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          className="rounded-full border border-[#302923] px-6 py-2.5 text-[14px] font-medium text-white transition-all hover:border-[#504740] hover:bg-white/[0.04] light:border-zinc-300 light:text-zinc-800 light:hover:bg-zinc-100"
        >
          Join the waitlist
        </button>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between border-t border-[#1e1c1a] py-6 light:border-zinc-200">
        <p className="text-[12px] text-[#827a73] light:text-zinc-400">
          © 2026 Designer's Room
        </p>
        <p className="text-[12px] tracking-[0.08em] text-[#827a73] uppercase light:text-zinc-400">
          Practice is PORTFOLIO
        </p>
      </div>
    </div>
  </footer>
)
