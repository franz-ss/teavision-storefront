import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Card, Section } from '@/components/ui'
import { getCollectionSummaries } from '@/lib/shopify/operations/collection'
import type { CollectionSummary } from '@/lib/shopify/types'

export const metadata: Metadata = {
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
}

const FEATURED_COLLECTION_HANDLES = [
  'wholesale-bulk-tea',
  'herbs-and-spices',
  'wellness-functional-tea',
  'bulk-tea-bags',
  'cafe-range',
  'superfood-extract-powders-proteins-supplements',
  'organic-tea',
  'australian-native-ingredients',
] as const

const FEATURED_COLLECTION_COPY: Partial<Record<string, string>> = {
  'wholesale-bulk-tea':
    'Bulk loose leaf teas, botanicals, organic blends, and everyday service staples.',
  'herbs-and-spices':
    'Commercial herbs and spices for blending, manufacturing, foodservice, and retail.',
  'wellness-functional-tea':
    'Functional blends and botanicals for wellness ranges and product development.',
  'bulk-tea-bags':
    'Tea bag formats for hospitality, office supply, service counters, and resale.',
  'cafe-range':
    'Cafe-ready tea, powders, beverage ingredients, and high-repeat service options.',
  'superfood-extract-powders-proteins-supplements':
    'Powders, extracts, proteins, and supplements for functional beverage ranges.',
  'organic-tea':
    'Certified organic teas and botanicals with documentation-led supply support.',
  'australian-native-ingredients':
    'Native ingredients for provenance-led blends, menus, and product concepts.',
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://teavision.com.au'

function collectionHref(handle: string): string {
  return `/collections/${handle}`
}

function sortByTitle(
  collectionA: CollectionSummary,
  collectionB: CollectionSummary,
): number {
  return collectionA.title.localeCompare(collectionB.title)
}

function getCollectionDescription(collection: CollectionSummary): string {
  return (
    FEATURED_COLLECTION_COPY[collection.handle] ??
    collection.description ??
    `Browse ${collection.title} from Teavision.`
  )
}

function getFeaturedCollections(
  collections: CollectionSummary[],
): CollectionSummary[] {
  const byHandle = new Map(
    collections.map((collection) => [collection.handle, collection]),
  )

  return FEATURED_COLLECTION_HANDLES.map((handle) =>
    byHandle.get(handle),
  ).filter((collection): collection is CollectionSummary => Boolean(collection))
}

function CollectionImage({ collection }: { collection: CollectionSummary }) {
  if (
    !collection.featuredImage ||
    !collection.featuredImage.width ||
    !collection.featuredImage.height
  ) {
    return <div className="bg-surface-sunken aspect-4/3 w-full" />
  }

  return (
    <Image
      src={`${collection.featuredImage.url}&width=640`}
      alt={collection.featuredImage.altText ?? collection.title}
      width={collection.featuredImage.width}
      height={collection.featuredImage.height}
      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
      className="aspect-4/3 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    />
  )
}

export default async function CollectionsPage() {
  const collections = await getCollectionSummaries()
  const featuredCollections = getFeaturedCollections(collections)
  const directoryCollections = collections
    .filter((collection) => collection.handle !== 'all')
    .sort(sortByTitle)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Wholesale Tea Collections',
    description: metadata.description,
    url: `${BASE_URL}/collections`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: directoryCollections
        .slice(0, 120)
        .map((collection, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: collection.title,
          url: `${BASE_URL}${collectionHref(collection.handle)}`,
        })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="bg-canvas">
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
                    href={collectionHref(collection.handle)}
                    className="focus-visible:ring-ring block h-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <CollectionImage collection={collection} />
                    <div className="p-4">
                      <h3 className="type-heading-04 text-strong group-hover:text-brand transition-colors">
                        {collection.title}
                      </h3>
                      <p className="type-body-sm text-muted mt-3">
                        {getCollectionDescription(collection)}
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
                    href={collectionHref(collection.handle)}
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
      </main>
    </>
  )
}
