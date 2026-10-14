import { useEffect, useState } from 'react'
import logo from '@/assets/logo.svg'
import arrow from '@/assets/icon/arrow.svg'
import { cn } from '@/lib/utils'

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-30 transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        scrolled ? 'pt-3' : 'pt-0',
      )}
    >
      <nav
        className={cn(
          'mx-auto flex items-center justify-between border border-white/10 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[max-width,border-radius]',
          scrolled
            ? 'max-w-3xl rounded-full bg-white/[0.08] px-4 py-2.5 shadow-lg shadow-black/30'
            : 'max-w-full rounded-none border-x-transparent border-t-transparent bg-white/[0.06] py-3.5 shadow-none',
        )}
      >
        {/* Brand Logo & Beta Tag */}
        <div className={cn('flex items-center gap-[10px]', !scrolled && 'pl-12 md:pl-32')}>
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
          className={cn(
            'inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#FFF8EE] via-[#E8DDD0] to-[#B9ADA0] px-5 py-2.5 text-sm font-medium text-black transition-all duration-200 hover:opacity-90',
            !scrolled && 'mr-12 md:mr-32',
          )}
        >
          Start Practising
          <span>
            <img src={arrow} alt="arrow" />
          </span>
        </a>
      </nav>
    </header>
  )
}
