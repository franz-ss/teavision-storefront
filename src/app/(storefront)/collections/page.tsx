import type { Metadata } from 'next'
import Link from 'next/link'

import { Card, Section } from '@/components/ui'
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

      <Section.Root tone="sunken" className="border-default border-b">
        <Section.Container>
          <nav
            aria-label="Breadcrumb"
            className="type-body-sm text-muted mb-8 flex flex-wrap items-center gap-2"
          >
            <Link
              href="/"
              className="focus-visible:ring-ring inline-flex min-h-10 items-center rounded hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-default">
              Collections
            </span>
          </nav>

          <p className="type-eyebrow text-accent">Wholesale range</p>
          <h1 className="type-display-01 text-strong mt-5 max-w-4xl text-balance">
            Tea, herb, spice, and ingredient collections
          </h1>
          <p className="type-body-lg text-muted mt-6 max-w-prose">
            Start with a category, compare adjacent ranges, then move into
            samples or bulk ordering with the Teavision team.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/collections/all"
              className="type-label bg-action-primary text-action-primary-text hover:bg-action-primary-hover focus-visible:ring-ring inline-flex min-h-11 w-full items-center justify-center rounded-md px-5 text-center transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:w-auto"
            >
              Browse all products
            </Link>
            <Link
              href="/pages/wholesale-account-request"
              className="type-label border-action-secondary-border text-action-secondary-text hover:bg-action-secondary-hover focus-visible:ring-ring inline-flex min-h-11 w-full items-center justify-center rounded-md border px-5 text-center transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:w-auto"
            >
              Request wholesale access
            </Link>
          </div>
        </Section.Container>
      </Section.Root>

      <Section.Root tone="transparent">
        <Section.Container>
          <div className="max-w-prose">
            <p className="type-eyebrow text-accent">Popular paths</p>
            <h2 className="type-heading-02 text-strong mt-3">
              Find the right range faster
            </h2>
          </div>

          <ul
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            role="list"
          >
            {featuredCollections.map((collection) => (
              <Card
                as="li"
                key={collection.id}
                interactive
                overflow="hidden"
                className="group h-full"
              >
                <Link
                  href={hrefForHandle(collection.handle)}
                  className="focus-visible:ring-ring block h-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <CollectionCardImage collection={collection} />
                  <div className="p-4">
                    <h3 className="type-heading-04 text-strong group-hover:text-brand transition-colors">
                      {collection.title}
                    </h3>
                    <p className="type-body-sm text-muted mt-3">
                      {getDescription(collection)}
                    </p>
                  </div>
                </Link>
              </Card>
            ))}
          </ul>
        </Section.Container>
      </Section.Root>

      <Section.Root tone="surface" className="border-default border-t">
        <Section.Container>
          <div className="border-default mb-6 flex flex-col gap-3 border-b pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="type-eyebrow text-accent">Directory</p>
              <h2 className="type-heading-02 text-strong mt-3">
                All collections
              </h2>
            </div>
            <p className="type-body-sm text-muted">
              {directoryCollections.length} wholesale ranges
            </p>
          </div>

          <ul
            className="grid gap-x-8 md:grid-cols-2 xl:grid-cols-3"
            role="list"
          >
            {directoryCollections.map((collection) => (
              <li key={collection.id} className="border-default border-b">
                <Link
                  href={hrefForHandle(collection.handle)}
                  className="focus-visible:ring-ring hover:text-brand grid min-h-16 gap-2 py-4 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <span className="type-label text-strong">
                    {collection.title}
                  </span>
                  {collection.description && (
                    <span className="type-body-sm text-muted line-clamp-2">
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
