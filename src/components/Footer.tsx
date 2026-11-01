export const Footer = () => {
  return (
    <footer className="relative w-full overflow-hidden">
      {/* Bottom glow — matches the orange warmth in the screenshot */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-[200px] w-[320px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_bottom,#ff4500_0%,#c2400c_35%,transparent_70%)] opacity-30 blur-[60px] sm:h-[320px] sm:w-[900px] sm:blur-[80px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pt-12 sm:px-12 sm:pt-16 md:px-16 md:pt-20">
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
