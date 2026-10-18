import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AuthModal } from '@/components/AuthModal'
import { ThemeProvider } from '@/lib/theme'

export interface AppOutletContext {
  openAuth: (mode?: 'signup' | 'practice') => void
}

export function AppLayout() {
  const [authModalState, setAuthModalState] = useState<{
    isOpen: boolean
    mode: 'signup' | 'practice'
  }>({
    isOpen: false,
    mode: 'signup',
  })

  const openAuth = (mode: 'signup' | 'practice' = 'signup') => {
    setAuthModalState({ isOpen: true, mode })
  }

  const closeAuth = () => {
    setAuthModalState((prev) => ({ ...prev, isOpen: false }))
  }

  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-300 selection:bg-amber-500/25 selection:text-amber-200">
        {/* Shared navbar across all pages */}
        <Navbar />

        <main className="w-full flex-1">
          <Outlet context={{ openAuth } satisfies AppOutletContext} />
        </main>

        <Footer />

        <AuthModal
          isOpen={authModalState.isOpen}
          onClose={closeAuth}
          initialMode={authModalState.mode}
        />
      </div>
    </ThemeProvider>
  )
}
