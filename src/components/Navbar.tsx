import logo from '@/assets/logo.svg'
import arrow from '@/assets/icon/arrow.svg' 

export const Navbar = () => {
  return (
    <header className="relative z-30 mx-auto w-full max-w-[1280px] pt-[20px] pr-[10px] pl-0 md:pt-[32px] md:pr-[28px] lg:pr-[40px]">
      <nav className="flex items-center justify-between">
        {/* Brand Logo & Beta Tag */}
        <div className="flex items-center gap-[10px]">
          <a href="/" className="flex items-center transition-opacity hover:opacity-90">
            <img src={logo} alt="Designers Room" className="h-12 w-auto md:h-8.5" />
          </a>
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium tracking-widest text-zinc-300 backdrop-blur-xs select-none">
            BETA
          </span>
        </div>
        
        {/* CTA */}
        <a
          href="#start-practising"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#FFF8EE] to -{#E8DDD0} to-[#B9ADA0] px-5 py-2.5 text-sm font-medium text-black transition-all duration-200 hover:opacity-90"
        >
          Start Practising
          <span> 
            <img src={arrow} alt="arrow" /> </span>
        </a>

      </nav>
    </header>
  )
}
