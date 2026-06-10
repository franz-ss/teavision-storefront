import type { Metadata } from 'next'

import {
  Contact,
  Cta,
  Faq,
  HomepageHero,
  HomepageNewsletter,
  OrganicHerbs,
  PrivateLabel,
  ProofPoints,
  ProductRange,
  SupplyChain,
  TeaJournal,
  Testimonials,
} from '@/components/homepage'
import {
  ctaCatalogueData,
  HOMEPAGE_PROOF_POINTS,
  organizationJsonLd,
  websiteJsonLd,
} from '@/components/homepage/content'
import {
  submitContactFormAction,
  submitNewsletterSignupFormAction,
} from '@/lib/contact/actions'
import { withNoindexRobots } from '@/lib/seo/noindex'
import { serializeInlineJson } from '@/lib/seo/serialize-inline-json'

export const metadata: Metadata = withNoindexRobots({
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
})

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeInlineJson(organizationJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeInlineJson(websiteJsonLd) }}
      />

      <div className="bg-paper">
        <HomepageHero />
        <ProofPoints points={HOMEPAGE_PROOF_POINTS} />
        <ProductRange />
        <PrivateLabel />
        <OrganicHerbs />
        <Testimonials />
        <SupplyChain />
        <TeaJournal />
        <Cta {...ctaCatalogueData} />
        <HomepageNewsletter action={submitNewsletterSignupFormAction} />
        <Contact action={submitContactFormAction} />
        <Faq />
      </div>
    </>
  )
}
