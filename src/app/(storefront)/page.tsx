import type { Metadata } from 'next'
import { connection } from 'next/server'
import { Suspense } from 'react'

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
  sendNewsletterSignupAction,
  submitContactFormAction,
} from '@/lib/contact/actions'
import { getHomepage } from '@/lib/sanity/home-page'
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo/homepage-json-ld'
import { withNoindexRobots } from '@/lib/seo/noindex'
import { serializeInlineJson } from '@/lib/seo/serialize-inline-json'

export async function generateMetadata(): Promise<Metadata> {
  await connection()
  const homepage = await getHomepage()
  const { seo } = homepage

  return withNoindexRobots({
    title: { absolute: seo.title },
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonicalPath,
      type: 'website',
      images: seo.ogImage
        ? [
            {
              url: seo.ogImage.src,
              alt: seo.ogImage.alt,
              width: seo.ogImage.width,
              height: seo.ogImage.height,
            },
          ]
        : undefined,
    },
    alternates: { canonical: seo.canonicalPath },
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
  })
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

      <Suspense fallback={null}>
        <HomePageContent />
      </Suspense>
    </>
  )
}

export async function HomePageContent() {
  await connection()
  const homepage = await getHomepage()

  return (
    <div className="bg-paper">
      <HomepageHero hero={homepage.hero} />
      <ProductRange
        cards={homepage.productRange.cards}
        intro={homepage.productRange.intro}
      />
      <HomepageNewsletter
        action={sendNewsletterSignupAction}
        intro={homepage.newsletter.intro}
      />
      <PrivateLabel
        cards={homepage.privateLabel.cards}
        intro={homepage.privateLabel.intro}
      />
      <OrganicHerbs {...homepage.organicHerbs} />
      <SupplyChain {...homepage.supplyChain} />
      <CertificationCoverage {...homepage.certificationCoverage} />
      <SupplyChainProtection {...homepage.supplyChainProtection} />
      <Testimonials {...homepage.testimonials} />
      <TeaJournal {...homepage.teaJournal} />
      <ContactSection action={submitContactFormAction} {...homepage.contact} />
      <Cta {...homepage.catalogueCta} />
      <Faq {...homepage.faq} />
    </div>
  )
}
