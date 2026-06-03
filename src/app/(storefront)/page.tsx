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
import { serializeInlineJson } from '@/lib/seo/serialize-inline-json'

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
        dangerouslySetInnerHTML={{
          __html: serializeInlineJson(organizationJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeInlineJson(websiteJsonLd) }}
      />

      <div className="bg-canvas">
        <HomepageHero />
        <ProofPoints points={HOMEPAGE_PROOF_POINTS} />
        <ProductRange />
        <HomepageNewsletter action={submitNewsletterSignupFormAction} />
        <PrivateLabel />
        <OrganicHerbs />
        <Cta
          tone="brand"
          intro={{
            title: 'Source wholesale ingredients with Teavision',
            copy: 'Talk with our team about samples, bulk supply, private-label packing, or custom blending for your range.',
          }}
          cta={{
            children: 'Contact the team',
            href: '/pages/contact',
            variant: 'inverseSecondary',
          }}
        />

        <Testimonials />
        <TeaJournal />
        <Contact action={submitContactFormAction} />
        <Cta {...ctaCatalogueData} />
        <Faq />
      </div>
    </>
  )
}
