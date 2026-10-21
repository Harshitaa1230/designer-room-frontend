import { GradientBackground } from '@/components/GradientBackground'
import { Hero } from '@/components/Hero'
import { FeaturesSection } from '@/components/FeaturesSection'

export function HomePage() {
  return (
    <div className="relative w-full">
      <h1 className="sr-only">Designers Room</h1>

      {/* Hero with gradient background */}
      <div className="relative isolate overflow-hidden">
        <GradientBackground />
        <Hero />
      </div>

      {/* What's inside — feature list */}
      <FeaturesSection />
    </div>
  )
}
