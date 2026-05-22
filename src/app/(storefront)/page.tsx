import type { Metadata } from 'next'

import {
  Contact,
  Cta,
  Faq,
  HomepageNewsletter,
  OrganicHerbs,
  PrivateLabel,
  ProductRange,
  TeaJournal,
  Testimonials,
} from '@/components/homepage'
import {
  ctaCatalogueData,
  organizationJsonLd,
  websiteJsonLd,
} from '@/components/homepage/content'
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
        <ProductRange />
        <HomepageNewsletter action={submitNewsletterSignupFormAction} />
        <PrivateLabel />
        <OrganicHerbs />
        <Cta
          tone="brand"
          intro={{
            title: 'Let the experts help GROW your business',
            copy: 'Let the experts help GROW your business',
          }}
          cta={{
            children: 'Contact the team',
            href: '/contact',
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
