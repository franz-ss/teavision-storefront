import type { Metadata } from 'next'
import Link from 'next/link'

import { Eyebrow, Section } from '@/components/ui'
import { ContactSection } from '@/components/contact'
import { getCollectionSummaries } from '@/lib/shopify/operations/collection'
import type { CollectionSummary } from '@/lib/shopify/types'
import { submitContactFormAction } from '@/lib/contact/actions'
import { withNoindexRobots } from '@/lib/seo/noindex'
import { serializeInlineJson } from '@/lib/seo/serialize-inline-json'
import { SITE_URL } from '@/lib/seo/site-url'

import { CollectionCardImage } from './_components/collection-card-image'

export const metadata: Metadata = withNoindexRobots({
  title: 'Wholesale Tea Collections | Teavision',
  description:
    'Browse Teavision wholesale tea, herbs, spices, tea bags, superfood powders, wellness blends, and Australian native ingredient collections.',
  openGraph: {
    title: 'Wholesale Tea Collections | Teavision',
    description:
      'Browse Teavision wholesale tea, herbs, spices, tea bags, superfood powders, wellness blends, and Australian native ingredient collections.',
    url: '/collections',
  },
  alternates: { canonical: '/collections' },
})

function hrefForHandle(handle: string): string {
  return `/collections/${handle}`
}

function sortByTitle(
  collectionA: CollectionSummary,
  collectionB: CollectionSummary,
): number {
  if (collectionA.handle === 'all') return -1
  if (collectionB.handle === 'all') return 1
  return collectionA.title.localeCompare(collectionB.title)
}

export default async function Page() {
  const collections = await getCollectionSummaries()

  // Full grid: include 'all', exclude 'frontpage', sorted alphabetically
  const gridCollections = collections
    .filter((collection) => collection.handle !== 'frontpage')
    .sort(sortByTitle)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Wholesale Tea Collections',
    description: metadata.description,
    url: `${SITE_URL}/collections`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: gridCollections
        .slice(0, 120)
        .map((collection, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: collection.title,
          url: `${SITE_URL}${hrefForHandle(collection.handle)}`,
        })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeInlineJson(structuredData),
        }}
      />

      {/* Page header */}
      <Section.Root tone="brand" spacing="compact">
        <Section.Container>
          <nav
            aria-label="Breadcrumb"
            className="type-mono-meta text-paper/60 mb-6 flex flex-wrap items-center gap-2"
          >
            <Link
              href="/"
              className="focus-visible:ring-ring hover:text-paper/90 rounded focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-gold">
              Collections
            </span>
          </nav>

          <Eyebrow tone="gold">Wholesale range</Eyebrow>
          <h1 className="type-heading-01 text-paper mt-4 max-w-4xl text-balance">
            Tea, herb, spice, and ingredient collections
          </h1>
          <p className="text-paper/85 mt-4 max-w-prose text-[1.02rem]">
            Start with a category, compare adjacent ranges, then move into
            samples or bulk ordering with the Teavision team.
          </p>
        </Section.Container>
      </Section.Root>

      {/* Full collection card grid — All first, then alphabetical */}
      <Section.Root tone="transparent">
        <Section.Container>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" role="list">
            {gridCollections.map((collection) => (
              <li
                key={collection.id}
                className="group relative aspect-[1/1.08] overflow-hidden rounded-lg"
              >
                <Link
                  href={hrefForHandle(collection.handle)}
                  className="focus-visible:ring-ring block size-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <CollectionCardImage collection={collection} />

                  {/* Bottom gradient scrim */}
                  <div
                    className="from-ink/70 via-ink/20 absolute inset-0 bg-linear-to-t to-transparent"
                    aria-hidden="true"
                  />

                  {/* Card content */}
                  <div className="absolute right-0 bottom-0 left-0 p-4">
                    <h2 className="font-display text-paper text-[1.15rem] leading-[1.1]">
                      {collection.title}
                    </h2>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Section.Container>
      </Section.Root>

      {/* Contact section */}
      <ContactSection action={submitContactFormAction} />
    </>
  )
}
