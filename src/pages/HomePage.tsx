import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { GradientBackground } from '@/components/GradientBackground'
import { Hero } from '@/components/Hero'
import { Features } from '@/components/Features'
import { CtaBanner } from '@/components/CtaBanner'
import { AuthModal } from '@/components/AuthModal'
import type { AppOutletContext } from '@/App'

export function HomePage() {
  const outletContext = useOutletContext<AppOutletContext | null>()
  const [localModalOpen, setLocalModalOpen] = useState(false)

  const handleOpenAuth = (action: 'signup' | 'practice' = 'signup') => {
    if (outletContext?.openAuth) {
      outletContext.openAuth(action)
    } else {
      setLocalModalOpen(true)
    }
  }

  return (
    <div className="relative w-full">
      {/* Accessible Title */}
      <h1 className="sr-only">Designers Room</h1>

      {/* Hero region: gradient background behind the navbar and hero copy only */}
      <div className="relative isolate overflow-hidden">
        <GradientBackground />

        {/* Top Navigation */}
        <Navbar />

        {/* Hero Section with Glowing Arc */}
        <Hero />
      </div>

      {/* Features Grid ("What's inside") */}
      <Features />

      {/* Call to Action Banner */}
      <CtaBanner onOpenAuth={handleOpenAuth} />

      {/* Fallback Auth Modal for standalone rendering */}
      {!outletContext && (
        <AuthModal isOpen={localModalOpen} onClose={() => setLocalModalOpen(false)} />
      )}
    </div>
  )
}
