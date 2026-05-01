import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  getCollection,
  getCollectionProducts,
} from '@/lib/shopify/operations/collection'
import { ProductCollectionSortKeys } from '@/lib/shopify/types'
import { SortSelect } from '@/components/collection'
import { ProductCard } from '@/components/ui'

type Props = {
  params: Promise<{ handle: string }>
  searchParams: Promise<{ sort?: string }>
}

const SORT_MAP: Record<
  string,
  { sortKey: ProductCollectionSortKeys; reverse: boolean }
> = {
  featured: {
    sortKey: ProductCollectionSortKeys.CollectionDefault,
    reverse: false,
  },
  'title-asc': { sortKey: ProductCollectionSortKeys.Title, reverse: false },
  'title-desc': { sortKey: ProductCollectionSortKeys.Title, reverse: true },
  'price-asc': { sortKey: ProductCollectionSortKeys.Price, reverse: false },
  'price-desc': { sortKey: ProductCollectionSortKeys.Price, reverse: true },
  newest: { sortKey: ProductCollectionSortKeys.Created, reverse: true },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const collection = await getCollection(handle)
  if (!collection) return { title: 'Collection not found' }
  const description = collection.description
    ? collection.description.slice(0, 160)
    : `Browse ${collection.title} from Teavision — Australia's bulk tea and herb supplier.`
  return {
    title: collection.title,
    description,
    openGraph: {
      title: collection.title,
      description,
      url: `/collections/${handle}`,
    },
    alternates: { canonical: `/collections/${handle}` },
  }
}

async function CollectionContent({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>
  searchParams: Promise<{ sort?: string }>
}) {
  const [{ handle }, { sort: sortParam }] = await Promise.all([
    params,
    searchParams,
  ])

  const sort = sortParam && sortParam in SORT_MAP ? sortParam : 'featured'
  const { sortKey, reverse } = SORT_MAP[sort]

  const [collection, products] = await Promise.all([
    getCollection(handle),
    getCollectionProducts(handle, 250, sortKey, reverse),
  ])

  if (!collection) notFound()

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://teavision.com.au'
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Collections',
        item: `${baseUrl}/collections/all`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: collection.title,
        item: `${baseUrl}/collections/${handle}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="text-text-muted mb-6 text-sm">
        <Link
          href="/"
          className="rounded hover:underline focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
        >
          Home
        </Link>
        <span aria-hidden="true"> › </span>
        <Link
          href="/collections/all"
          className="rounded hover:underline focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
        >
          Collections
        </Link>
        <span aria-hidden="true"> › </span>
        <span aria-current="page">{collection.title}</span>
      </nav>

      <h1 className="mb-2 text-2xl font-bold">{collection.title}</h1>
      {collection.description && (
        <p className="text-text-muted mb-0">{collection.description}</p>
      )}

      <div className="border-border mt-4 mb-6 flex items-center justify-between border-t pt-3">
        <span className="text-text-muted text-sm">
          {products.length} {products.length === 1 ? 'product' : 'products'}
        </span>
        <Suspense fallback={null}>
          <SortSelect currentSort={sort} />
        </Suspense>
      </div>

      <ul
        className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4"
        role="list"
      >
        {products.length === 0 ? (
          <li className="text-text-muted col-span-full py-16 text-center">
            No products in this collection yet.
          </li>
        ) : (
          products.map((product, i) => (
            <li key={product.id}>
              <ProductCard product={product} priority={i === 0} />
            </li>
          ))
        )}
      </ul>
    </>
  )
}

export default function CollectionPage({ params, searchParams }: Props) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Suspense fallback={<div aria-live="polite">Loading collection…</div>}>
        <CollectionContent params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
