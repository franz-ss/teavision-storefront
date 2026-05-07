import type { Metadata } from 'next'

import {
  Catalogues,
  CertificationCoverage,
  Contact,
  ExpertsHelp,
  Faq,
  HomepageHero,
  HomepageNewsletter,
  OrganicHerbs,
  PrivateLabel,
  ProductRange,
  ProofPoints,
  SupplyChain,
  TeaJournal,
  Testimonials,
} from '@/components/homepage'
import { organizationJsonLd, websiteJsonLd } from '@/components/homepage/content'
import {
  submitContactFormAction,
  submitNewsletterSignupFormAction,
} from '@/lib/contact/actions'

export const metadata: Metadata = {
  title: 'Teavision | Teas Australia: Online Wholesale Store',
  description:
    'Looking to Buy Tea Online at Wholesale Prices? Our award-winning Australian tea company provide Organic, Natural & Healthy ingredients. Visit our site today!',
  openGraph: {
    title: 'Teavision | Teas Australia: Online Wholesale Store',
    description:
      'Looking to Buy Tea Online at Wholesale Prices? Our award-winning Australian tea company provide Organic, Natural & Healthy ingredients. Visit our site today!',
    url: '/',
  },
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      <div className="bg-canvas">
        <HomepageHero />
        <CertificationCoverage />
        <ProofPoints />
        <ProductRange />
        <HomepageNewsletter action={submitNewsletterSignupFormAction} />
        <PrivateLabel />
        <OrganicHerbs />
        <ExpertsHelp />
        <SupplyChain />
        <Testimonials />
        <TeaJournal />
        <Contact action={submitContactFormAction} />
        <Catalogues />
        <Faq />
      </div>
    </>
  )
}
