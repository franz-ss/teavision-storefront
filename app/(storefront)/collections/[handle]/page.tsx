import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import {
  getCollection,
  getCollectionProducts,
} from '@/lib/shopify/operations/collection'
import { ProductCard } from '@/components/ui/product-card'
import { SortSelect } from '@/components/collection/sort-select'

type Props = {
  params: Promise<{ handle: string }>
  searchParams: Promise<{ sort?: string }>
}

const SORT_MAP: Record<string, { sortKey: string; reverse: boolean }> = {
  featured: { sortKey: 'COLLECTION_DEFAULT', reverse: false },
  'title-asc': { sortKey: 'TITLE', reverse: false },
  'title-desc': { sortKey: 'TITLE', reverse: true },
  'price-asc': { sortKey: 'PRICE', reverse: false },
  'price-desc': { sortKey: 'PRICE', reverse: true },
  newest: { sortKey: 'CREATED', reverse: true },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const collection = await getCollection(handle)
  if (!collection) return { title: 'Collection not found' }
  return { title: collection.title }
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
    getCollectionProducts(handle, 24, sortKey, reverse),
  ])

  if (!collection) notFound()

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">{collection.title}</h1>
      <p className="text-text-muted mb-6">{collection.description}</p>

      <div className="mb-4 flex justify-end">
        <Suspense fallback={null}>
          <SortSelect currentSort={sort} />
        </Suspense>
      </div>

      <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3" role="list">
        {products.map((product, i) => (
          <li key={product.id}>
            <ProductCard product={product} priority={i === 0} />
          </li>
        ))}
      </ul>
    </div>
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
