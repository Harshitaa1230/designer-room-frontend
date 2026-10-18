import { useOutletContext } from 'react-router-dom'
import { GradientBackground } from '@/components/GradientBackground'
import { Hero } from '@/components/Hero'
import { SectionSeam } from '@/components/SectionSeam'
import { FeaturesSection } from '@/components/FeaturesSection'
import type { AppOutletContext } from '@/App'

export function HomePage() {
  useOutletContext<AppOutletContext | null>()

  return (
    <div className="relative w-full">
      <h1 className="sr-only">Designers Room</h1>

      {/* Hero with gradient background */}
      <div className="relative isolate overflow-hidden">
        <GradientBackground />
        <Hero />
      </div>

      {/* Glassmorphism seam — straddles the hero / features boundary */}
      <SectionSeam />

      {/* What's inside — feature list */}
      <FeaturesSection />
    </div>
  )
}
