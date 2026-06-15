import { CataloguesSection } from './catalogues-section'
import { CtaSection } from './cta-section'
import { HeroSection } from './hero-section'
import { JsonLd } from './json-ld'

export function PageContent() {
  return (
    <>
      <JsonLd />
      <HeroSection />
      <CataloguesSection />
      <CtaSection />
    </>
  )
}
