import type { Metadata } from 'next'

import {
  CertificationCoverage,
  Cta,
  Faq,
  HomepageHero,
  HomepageNewsletter,
  OrganicHerbs,
  PrivateLabel,
  ProductRange,
  SupplyChain,
  SupplyChainProtection,
  TeaJournal,
  Testimonials,
} from '@/components/homepage'
import { ContactSection } from '@/components/contact'
import {
  ctaCatalogueData,
  HOMEPAGE_HERO_FIXTURE,
  organizationJsonLd,
  PRODUCT_RANGE_FIXTURE,
  PRODUCT_RANGE_INTRO_FIXTURE,
  websiteJsonLd,
} from '@/components/homepage/content'
import {
  sendNewsletterSignupAction,
  submitContactFormAction,
} from '@/lib/contact/actions'
import { withNoindexRobots } from '@/lib/seo/noindex'
import { serializeInlineJson } from '@/lib/seo/serialize-inline-json'

const HOME_TITLE = 'Teavision | Teas Australia: Online Wholesale Store'
const HOME_DESCRIPTION =
  'Looking to Buy Tea Online at Wholesale Prices? Our award-winning Australian tea company provide Organic, Natural & Healthy ingredients. Visit our site today!'

export const metadata: Metadata = withNoindexRobots({
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
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
        <HomepageHero hero={HOMEPAGE_HERO_FIXTURE} />
        <ProductRange
          cards={PRODUCT_RANGE_FIXTURE}
          intro={PRODUCT_RANGE_INTRO_FIXTURE}
        />
        <HomepageNewsletter action={sendNewsletterSignupAction} />
        <PrivateLabel />
        <OrganicHerbs />
        <SupplyChain />
        <CertificationCoverage />
        <SupplyChainProtection />
        <Testimonials />
        <TeaJournal />
        <ContactSection action={submitContactFormAction} />
        <Cta {...ctaCatalogueData} />
        <Faq />
      </div>
    </>
  )
}
