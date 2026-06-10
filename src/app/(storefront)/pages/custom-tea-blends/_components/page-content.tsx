import { ContactSection } from '@/components/contact/contact-section'
import { submitContactFormAction } from '@/lib/contact/actions'

import { BlendDetailsSection } from './blend-details-section'
import { FlavourPicker } from './flavour-picker'
import { JsonLd } from './json-ld'
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
      {/* Shared contact section replaces the blend-brief form + FAQ (owner directive) */}
      <ContactSection action={submitContactFormAction} />
    </>
  )
}
