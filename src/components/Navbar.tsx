import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '@/assets/logo.svg'
import arrow from '@/assets/icon/arrow.svg'
import { cn } from '@/lib/utils'
import { useTheme } from '@/lib/theme'
import { useAuthStore } from '@/store/auth'

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="4" />
    <line x1="12" y1="20" x2="12" y2="22" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="2" y1="12" x2="4" y2="12" />
    <line x1="20" y1="12" x2="22" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const NAV_LINKS = [
  { label: 'Guidebook', to: '/roadmaps' },
  { label: 'Challenge', to: '/challenge' },
  { label: 'Community', to: '/community' },
]

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const status = useAuthStore((s) => s.status)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onPopState = () => setMenuOpen(false)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-30 bg-black/[0.18] backdrop-blur-[12px] light:bg-white/50 transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        scrolled ? 'pt-3' : 'pt-0',
      )}
    >
      <nav
        className={cn(
          'mx-auto flex items-center justify-between border backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[max-width,border-radius]',
          'border-white/10',
          scrolled
            ? cn(
                'max-w-4xl rounded-full px-4 py-2 sm:px-5 sm:py-2.5 shadow-lg',
                'bg-white/[0.08]',
                'light:bg-white/80 light:shadow-black/10',
              )
            : cn(
                'max-w-full rounded-none border-x-transparent border-t-transparent py-3 px-4 sm:py-3.5 sm:px-0 shadow-none',
                'bg-white/[0.06]',
                'light:bg-white/60 light:border-black/5',
              ),
        )}
      >
        {/* Brand */}
        <div className={cn('flex shrink-0 items-center gap-[10px]', !scrolled && 'sm:pl-12 md:pl-16')}>
          <NavLink to="/" className="flex shrink-0 items-center transition-opacity hover:opacity-90">
            <img src={logo} alt="Designers Room" className="h-8 w-auto shrink-0 sm:h-12 md:h-8.5 dark:invert-0 light:invert" />
          </NavLink>
          <span className="hidden items-center rounded-full border border-white/20 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium tracking-widest text-[#fffaee] select-none sm:inline-flex light:border-zinc-300 light:bg-zinc-100 light:text-zinc-500">
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
                  'text-base font-medium opacity-95 transition-colors duration-150',
                  isActive
                    ? 'text-[#fffaee] light:text-zinc-900'
                    : 'text-[#fffaee] hover:text-[#fffaee] light:text-zinc-400 light:hover:text-zinc-700',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right side: theme toggle + CTA + mobile menu trigger */}
        <div className={cn('flex shrink-0 items-center gap-1 sm:gap-2 md:gap-3', !scrolled && 'sm:pr-12 md:pr-16')}>
          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-full border transition-all duration-200',
              'border-white/15 bg-white/[0.06] text-[#fffaee] hover:bg-white/[0.12] hover:text-[#fffaee]',
              'light:border-zinc-300 light:bg-zinc-100 light:text-zinc-500 light:hover:bg-zinc-200 light:hover:text-zinc-800',
            )}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* CTA */}
          <Link
            to={status === 'authed' ? '/dashboard' : '/login'}
            className="btn-3d btn-3d--nav hidden items-center gap-2 px-5 py-2.5 text-sm sm:inline-flex"
          >
            {status === 'authed' ? 'Dashboard' : 'Get Started'}
            <img src={arrow} alt="" aria-hidden="true" className="invert" />
          </Link>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-full border transition-all duration-200 md:hidden',
              'border-white/15 bg-white/[0.06] text-[#fffaee] hover:bg-white/[0.12]',
              'light:border-zinc-300 light:bg-zinc-100 light:text-zinc-600 light:hover:bg-zinc-200',
            )}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        inert={!menuOpen}
        aria-hidden={!menuOpen}
        className={cn(
          'overflow-hidden md:hidden transition-[max-height] duration-320 ease-[cubic-bezier(0.25,0.8,0.25,1)]',
          menuOpen ? 'max-h-[80vh]' : 'max-h-0 pointer-events-none',
        )}
      >
        <div
          data-open={menuOpen}
          className={cn(
            'mobile-menu-panel mx-4 mt-2 mb-3 rounded-2xl border p-2 shadow-xl',
            'border-white/10 bg-[#0b0b0b]/95 backdrop-blur-xl',
            'light:border-black/10 light:bg-[#faf8f4]/95',
          )}
        >
          <nav aria-label="Mobile" className="flex flex-col">
            {NAV_LINKS.map((link, idx) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'mobile-menu-item flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors',
                    isActive
                      ? 'bg-white/[0.06] text-[#fffaee] light:bg-zinc-100 light:text-zinc-900'
                      : 'text-[#fffaee]/80 hover:bg-white/[0.04] hover:text-[#fffaee] light:text-zinc-500 light:hover:bg-zinc-100 light:hover:text-zinc-900',
                  )
                }
                style={{ animationDelay: `${60 + idx * 35}ms` }}
              >
                {link.label}
                <img src={arrow} alt="" aria-hidden="true" className="h-3 w-3 invert opacity-60 light:invert-0 light:opacity-40" />
              </NavLink>
            ))}
          </nav>

          <div
            className={cn(
              'mobile-menu-item mt-2 border-t border-white/10 p-2 light:border-black/10',
              menuOpen ? '' : 'pointer-events-none',
            )}
            style={{ animationDelay: menuOpen ? '165ms' : '0ms' }}
          >
            <Link
              to={status === 'authed' ? '/dashboard' : '/login'}
              onClick={() => setMenuOpen(false)}
              className="btn-3d btn-3d--nav flex w-full items-center justify-center gap-2 px-5 py-3 text-sm"
            >
              {status === 'authed' ? 'Dashboard' : 'Get Started'}
              <img src={arrow} alt="" aria-hidden="true" className="invert" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
