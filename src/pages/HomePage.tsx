import { GradientBackground } from '@/components/GradientBackground'
import { Hero } from '@/components/Hero'
import { FeaturesSection } from '@/components/FeaturesSection'
import { Seo } from '@/components/Seo'
import { organizationJsonLd, websiteJsonLd } from '@/components/seo-data'

export function HomePage() {
  return (
    <div className="relative w-full">
      <Seo
        title="Designers Room — Your design journey, all in one room"
        jsonLd={{ '@context': 'https://schema.org', '@graph': [organizationJsonLd, websiteJsonLd] }}
      />
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
