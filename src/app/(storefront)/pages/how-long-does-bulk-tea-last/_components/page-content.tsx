import { CtaSection } from './cta-section'
import { FactorsSection } from './factors-section'
import { HeroSection } from './hero-section'
import { JsonLd } from './json-ld'
import { LongevitySection } from './longevity-section'
import { PrepareSection } from './prepare-section'

export function PageContent() {
  return (
    <>
      <JsonLd />
      <HeroSection />
      <LongevitySection />
      <FactorsSection />
      <PrepareSection />
      <CtaSection />
    </>
  )
}
