import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Button, Eyebrow, Section } from '@/components/ui'
import {
  getCollectionMenuSummaries,
  getCollectionSummaries,
} from '@/lib/shopify/operations/collection'
import type { CollectionSummary } from '@/lib/shopify/types'
import { withNoindexRobots } from '@/lib/seo/noindex'
import { serializeInlineJson } from '@/lib/seo/serialize-inline-json'
import { SITE_URL } from '@/lib/seo/site-url'
import { SHOPIFY_COLLECTIONS_INDEX_MENU_HANDLE } from '@/lib/shopify/env'

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

const FEATURED_COLLECTION_LIMIT = 8

function hrefForHandle(handle: string): string {
  return `/collections/${handle}`
}

function sortByTitle(
  collectionA: CollectionSummary,
  collectionB: CollectionSummary,
): number {
  return collectionA.title.localeCompare(collectionB.title)
}

function getDescription(collection: CollectionSummary): string {
  return collection.description || `Browse ${collection.title} from Teavision.`
}

function isPublicCollection(collection: CollectionSummary): boolean {
  return collection.handle !== 'all' && collection.handle !== 'frontpage'
}

function getFallbackFeatured(
  collections: CollectionSummary[],
): CollectionSummary[] {
  const publicCollections = collections.filter(isPublicCollection)
  const collectionsWithImages = publicCollections.filter(
    (collection) => collection.featuredImage,
  )
  const collectionsWithContent = publicCollections.filter(
    (collection) => collection.description,
  )

  return (
    collectionsWithImages.length >= FEATURED_COLLECTION_LIMIT
      ? collectionsWithImages
      : collectionsWithContent.length > 0
        ? collectionsWithContent
        : publicCollections
  )
    .sort(sortByTitle)
    .slice(0, FEATURED_COLLECTION_LIMIT)
}

function mergeFeaturedCollections(
  primaryCollections: CollectionSummary[],
  fallbackCollections: CollectionSummary[],
): CollectionSummary[] {
  const featuredCollections: CollectionSummary[] = []
  const seenHandles = new Set<string>()

  for (const collectionGroup of [primaryCollections, fallbackCollections]) {
    for (const collection of collectionGroup) {
      if (
        featuredCollections.length >= FEATURED_COLLECTION_LIMIT ||
        seenHandles.has(collection.handle)
      ) {
        continue
      }

      featuredCollections.push(collection)
      seenHandles.add(collection.handle)
    }
  }

  return featuredCollections
}

function getFeatured(
  menuCollections: CollectionSummary[],
  collections: CollectionSummary[],
): CollectionSummary[] {
  const featuredMenuCollections = menuCollections.filter(isPublicCollection)
  const fallbackCollections = getFallbackFeatured(
    collections.filter(
      (collection) =>
        !featuredMenuCollections.some(
          (menuCollection) => menuCollection.handle === collection.handle,
        ),
    ),
  )

  return mergeFeaturedCollections(
    featuredMenuCollections,
    fallbackCollections.length > 0
      ? fallbackCollections
      : collections.filter(isPublicCollection).sort(sortByTitle),
  )
}

export default async function Page() {
  const [collections, menuCollections] = await Promise.all([
    getCollectionSummaries(),
    getCollectionMenuSummaries(SHOPIFY_COLLECTIONS_INDEX_MENU_HANDLE),
  ])
  const featuredCollections = getFeatured(menuCollections, collections)
  const directoryCollections = collections
    .filter((collection) => collection.handle !== 'all')
    .sort(sortByTitle)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Wholesale Tea Collections',
    description: metadata.description,
    url: `${SITE_URL}/collections`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: directoryCollections
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
              className="focus-visible:ring-ring rounded hover:text-paper/90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
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
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              href="/collections/all"
              variant="inverse"
              size="md"
              className="w-full sm:w-auto"
            >
              Browse all products
            </Button>
            <Button
              href="/pages/wholesale-account-request"
              variant="inverseSecondary"
              size="md"
              className="w-full sm:w-auto"
            >
              Request wholesale access
            </Button>
          </div>
        </Section.Container>
      </Section.Root>

      {/* Featured collection tiles (.rtile) */}
      <Section.Root tone="transparent">
        <Section.Container>
          <div className="max-w-prose">
            <Eyebrow>Popular paths</Eyebrow>
            <h2 className="type-heading-02 text-ink mt-3">
              Find the right range faster
            </h2>
          </div>

          <ul
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            role="list"
          >
            {featuredCollections.map((collection) => (
              <li
                key={collection.id}
                className="group relative aspect-[1/1.08] overflow-hidden rounded-lg"
              >
                <Link
                  href={hrefForHandle(collection.handle)}
                  className="focus-visible:ring-ring block h-full w-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <CollectionCardImage collection={collection} />

                  {/* Bottom gradient scrim */}
                  <div
                    className="absolute inset-0 bg-linear-to-t from-ink/70 via-ink/20 to-transparent"
                    aria-hidden="true"
                  />

                  {/* Card content */}
                  <div className="absolute right-0 bottom-0 left-0 p-4">
                    <p className="type-mono-meta text-gold mb-1">
                      {getDescription(collection).slice(0, 30)}
                    </p>
                    <h3 className="font-display text-paper text-[1.15rem] leading-[1.1]">
                      {collection.title}
                    </h3>

                    {/* Hover-reveal "Shop now" — always visible on touch/mobile */}
                    <span
                      className="mt-2 inline-flex items-center gap-1.5 text-paper/90 text-xs font-semibold opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 max-lg:opacity-100"
                      aria-hidden="true"
                    >
                      Shop now
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Section.Container>
      </Section.Root>

      {/* Full directory listing */}
      <Section.Root tone="sunken">
        <Section.Container>
          <div className="border-hairline mb-6 flex flex-col gap-3 border-b pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>Directory</Eyebrow>
              <h2 className="type-heading-02 text-ink mt-3">
                All collections
              </h2>
            </div>
            <p className="type-mono-meta text-ink-faint">
              {directoryCollections.length} wholesale ranges
            </p>
          </div>

          <ul
            className="grid gap-x-8 md:grid-cols-2 xl:grid-cols-3"
            role="list"
          >
            {directoryCollections.map((collection) => (
              <li key={collection.id} className="border-hairline border-b">
                <Link
                  href={hrefForHandle(collection.handle)}
                  className="focus-visible:ring-ring hover:text-brand grid min-h-16 gap-2 py-4 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <span className="type-label text-ink">
                    {collection.title}
                  </span>
                  {collection.description && (
                    <span className="type-body-sm text-ink-soft line-clamp-2">
                      {collection.description}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </Section.Container>
      </Section.Root>
    </>
  )
}
