import { BlendDetailsSection } from './blend-details-section'
import { CtaSection } from './cta-section'
import { FlavourPicker } from './flavour-picker'
import { JsonLd } from './json-ld'
import { FaqSection } from './faq-section'
import { HeroSection } from './hero-section'
import { IntroSection } from './intro-section'
import { ProcessSection } from './process-section'
import { QualitySection } from './quality-section'

export function PageContent() {
  return (
    <>
      <JsonLd />
      <HeroSection />
      <IntroSection />
      <FlavourPicker />
      <BlendDetailsSection />
      <QualitySection />
      <ProcessSection />
      <CtaSection />
      <FaqSection />
    </>
  )
}
