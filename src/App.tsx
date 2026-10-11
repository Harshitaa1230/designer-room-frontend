import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Footer } from '@/components/Footer'
import { AuthModal } from '@/components/AuthModal'

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
    <div className="flex min-h-screen flex-col bg-[#080808] text-white selection:bg-amber-500/25 selection:text-amber-200">
      {/* Main Page Content */}
      <main className="w-full flex-1">
        <Outlet context={{ openAuth } satisfies AppOutletContext} />
      </main>

      {/* Minimal Footer */}
      <Footer />

      {/* Global Interactive Auth Modal */}
      <AuthModal
        isOpen={authModalState.isOpen}
        onClose={closeAuth}
        initialMode={authModalState.mode}
      />
    </div>
  )
}
