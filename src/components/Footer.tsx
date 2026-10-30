import { useNavigate } from 'react-router-dom'

const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Threads',   href: 'https://threads.net'   },
  { label: 'LinkedIn',  href: 'https://linkedin.com'  },
  { label: 'X',         href: 'https://x.com'         },
]

export const Footer = () => {
  const navigate = useNavigate()

  return (
    <footer className="relative w-full overflow-hidden">
      {/* Bottom glow — matches the orange warmth in the screenshot */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-[200px] w-[320px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_bottom,#ff4500_0%,#c2400c_35%,transparent_70%)] opacity-30 blur-[60px] sm:h-[320px] sm:w-[900px] sm:blur-[80px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pt-12 sm:px-12 sm:pt-16 md:px-16 md:pt-20">
        {/* Social row + CTA */}
        <div className="flex flex-col items-start justify-between gap-5 pb-8 sm:flex-row sm:items-center sm:gap-6 sm:pb-12">
          <div className="flex flex-wrap gap-x-5 gap-y-3 sm:gap-8">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="text-[13px] font-normal text-[#827a73] transition-colors hover:text-white light:text-zinc-600 light:hover:text-zinc-900 sm:text-[14px]"
              >
                {s.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate('/waitlist')}
            className="rounded-full border border-[#302923] px-5 py-2 text-[13px] font-medium text-white transition-all hover:border-[#504740] hover:bg-white/[0.04] light:border-zinc-300 light:text-zinc-800 light:hover:bg-zinc-100 sm:px-6 sm:py-2.5 sm:text-[14px]"
          >
            Join the waitlist
          </button>
        </div>

        {/* Brand watermark */}
        <p
          aria-hidden="true"
          className="select-none whitespace-nowrap pt-1 text-center text-[clamp(38px,12vw,220px)] sm:pt-2 font-normal leading-none tracking-[-0.04em] text-white/[0.045] -translate-x-[5%] light:text-zinc-900/[0.06]"
        >
          Designer's Room
        </p>

        {/* Bottom bar */}
        <div className="flex items-center justify-between gap-3 border-t border-[#1e1c1a] py-4 light:border-zinc-200 sm:py-6">
          <p className="text-[10px] text-[#827a73] light:text-zinc-600 sm:text-[12px]">
            © 2026 Designer's Room
          </p>
          <p className="text-[10px] tracking-[0.08em] text-[#827a73] uppercase light:text-zinc-600 sm:text-[12px]">
            Practice is PORTFOLIO
          </p>
        </div>
      </div>
    </footer>
  )
}
