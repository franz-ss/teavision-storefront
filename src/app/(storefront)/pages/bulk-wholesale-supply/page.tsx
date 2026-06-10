import type { Metadata } from 'next'

import { ContactSection } from '@/components/contact'
import { submitContactFormAction } from '@/lib/contact/actions'
import { withNoindexRobots } from '@/lib/seo/noindex'

import { BannerSection } from './_components/banner-section'
import { CtaSection } from './_components/cta-section'
import { FaqSection } from './_components/faq-section'
import { FeaturesGrid3 } from './_components/features-grid-3'
import { HeroSection } from './_components/hero-section'
import { ImportFeaturesSection } from './_components/import-features-section'
import { JsonLd } from './_components/json-ld'
import { LogisticsSection } from './_components/logistics-section'
import { ProcessSection } from './_components/process-section'
import { WhyChooseSection } from './_components/why-choose-section'

const PAGE_PATH = '/pages/bulk-wholesale-supply'
const PAGE_TITLE = 'Bulk Wholesale Supply | Teavision'
const PAGE_DESCRIPTION =
  'Import premium teas, herbs and botanicals at scale with Teavision. Container freight to Melbourne, 1500+ ingredients direct from farms, ACO/HACCP certified supply chain.'

export const metadata: Metadata = withNoindexRobots({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_PATH,
    type: 'website',
  },
  alternates: { canonical: PAGE_PATH },
})

export default function Page() {
  return (
    <>
      <JsonLd />
      {/* Section 1 — Wholesale account banner */}
      <BannerSection />
      {/* Section 2 — Hero split */}
      <HeroSection />
      {/* Section 3 — Features grid 3-col */}
      <FeaturesGrid3 />
      {/* Section 4 — Freight & logistics */}
      <LogisticsSection />
      {/* Section 5 — What you can import */}
      <ImportFeaturesSection />
      {/* Section 6 — Why choose Teavision */}
      <WhyChooseSection />
      {/* Section 7 — How it works */}
      <ProcessSection />
      {/* Section 8 — FAQ */}
      <FaqSection />
      {/* Section 9 — CTA banner */}
      <CtaSection />
      {/* Section 10 — Contact */}
      <ContactSection action={submitContactFormAction} />
    </>
  )
}
