export const Navbar = () => {
  return (
    <header className="relative z-30 mx-auto w-full max-w-7xl px-6 pt-6 md:px-12 md:pt-8 lg:px-16">
      <nav className="flex items-center justify-between">
        {/* Brand Logo & Beta Tag */}
        <div className="flex items-center gap-2.5">
          <a
            href="/"
            className="flex items-center gap-2 text-sm font-semibold tracking-wider text-white/95 transition-colors hover:text-white md:text-base"
          >
            <span className="tracking-[0.18em]">DESIGNER</span>
            <span className="-ml-1 text-[0.8em] font-normal tracking-[0.1em] text-white/80 lowercase">
              s
            </span>
            <span className="ml-0.5 tracking-[0.18em]">ROOM</span>
          </a>
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium tracking-widest text-zinc-300 backdrop-blur-xs select-none">
            BETA
          </span>
        </div>
      </nav>
    </header>
  )
}
