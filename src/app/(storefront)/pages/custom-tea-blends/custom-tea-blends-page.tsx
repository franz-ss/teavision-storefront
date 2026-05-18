import { BlendDetailsSection } from './blend-details-section'
import { CtaSection } from './cta-section'
import { CustomTeaBlendJsonLd } from './custom-tea-blend-json-ld'
import { FaqSection } from './faq-section'
import { HeroSection } from './hero-section'
import { IntroSection } from './intro-section'
import { ProcessSection } from './process-section'
import { QualitySection } from './quality-section'

export function CustomTeaBlendsPageContent() {
  return (
    <>
      <CustomTeaBlendJsonLd />
      <HeroSection />
      <IntroSection />
      <BlendDetailsSection />
      <QualitySection />
      <ProcessSection />
      <CtaSection />
      <FaqSection />
    </>
  )
}
