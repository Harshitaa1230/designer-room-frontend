import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '@/assets/logo.svg'
import arrow from '@/assets/icon/arrow.svg'
import { cn } from '@/lib/utils'
import { useTheme } from '@/lib/theme'

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2"  x2="12" y2="4"  />
    <line x1="12" y1="20" x2="12" y2="22" />
    <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"  />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="2"  y1="12" x2="4"  y2="12" />
    <line x1="20" y1="12" x2="22" y2="12" />
    <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
    <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
  </svg>
)

const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const NAV_LINKS = [
  { label: 'Guidebook', to: '/roadmaps' },
  { label: 'Challenge', to: '/challenge' },
  { label: 'Community', to: '/community' },
]

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggle } = useTheme()

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
          'mx-auto flex items-center justify-between border backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[max-width,border-radius]',
          'border-white/10',
          scrolled
            ? cn(
                'max-w-4xl rounded-full px-5 py-2.5 shadow-lg',
                'bg-white/[0.08]',
                'light:bg-white/80 light:shadow-black/10',
              )
            : cn(
                'max-w-full rounded-none border-x-transparent border-t-transparent py-3.5 shadow-none',
                'bg-white/[0.06]',
                'light:bg-white/60 light:border-black/5',
              ),
        )}
      >
        {/* Brand */}
        <div className={cn('flex items-center gap-[10px]', !scrolled && 'pl-8 sm:pl-12 md:pl-16')}>
          <NavLink to="/" className="flex items-center transition-opacity hover:opacity-90">
            <img src={logo} alt="Designers Room" className="h-12 w-auto md:h-8.5 dark:invert-0 light:invert" />
          </NavLink>
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium tracking-widest text-zinc-300 select-none light:border-zinc-300 light:bg-zinc-100 light:text-zinc-500">
            BETA
          </span>
        </div>

        {/* Centre nav links — hidden on small screens */}
        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'text-base transition-colors duration-150',
                  isActive
                    ? 'font-medium text-white light:text-zinc-900'
                    : 'font-normal text-white hover:text-white light:text-zinc-400 light:hover:text-zinc-700',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right side: theme toggle + CTA */}
        <div className={cn('flex items-center gap-3', !scrolled && 'pr-8 sm:pr-12 md:pr-16')}>
          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className={cn(
              'flex size-8 items-center justify-center rounded-full border transition-all duration-200',
              'border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.12] hover:text-white',
              'light:border-zinc-300 light:bg-zinc-100 light:text-zinc-500 light:hover:bg-zinc-200 light:hover:text-zinc-800',
            )}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* CTA */}
          <a
            href="#start-practising"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#FFF8EE] via-[#E8DDD0] to-[#B9ADA0] px-5 py-2.5 text-sm font-medium text-black transition-all duration-200 hover:opacity-90"
          >
            Start Practising
            <img src={arrow} alt="" aria-hidden="true" />
          </a>
        </div>
      </nav>
    </header>
  )
}
