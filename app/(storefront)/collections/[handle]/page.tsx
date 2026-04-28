import type { Metadata } from 'next'
import { cacheLife, cacheTag } from 'next/cache'
import { Suspense } from 'react'

type Collection = {
  handle: string
  title: string
  description: string
}

type ProductCard = {
  id: string
  title: string
  price: string
  handle: string
}

async function getCollection(handle: string): Promise<Collection> {
  'use cache'
  cacheTag('collection', `collection-${handle}`)
  cacheLife('hours')

  return {
    handle,
    title: 'Black Tea',
    description:
      'Premium black teas sourced from Assam, Darjeeling, and Sri Lanka.',
  }
}

async function getCollectionProducts(handle: string): Promise<ProductCard[]> {
  'use cache'
  cacheTag('collection', `collection-${handle}`)
  cacheLife('hours')

  return Array.from({ length: 8 }, (_, i) => ({
    id: String(i + 1),
    title: `Product Placeholder ${i + 1}`,
    price: '$0.00',
    handle: `product-placeholder-${i + 1}`,
  }))
}

type Props = {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const collection = await getCollection(handle)
  return { title: collection.title }
}

async function CollectionContent({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const [collection, products] = await Promise.all([
    getCollection(handle),
    getCollectionProducts(handle),
  ])

  return (
    <div className="md:grid md:grid-cols-[240px_1fr] md:gap-8">
      {/* Filter sidebar placeholder */}
      <aside aria-label="Filters">
        <h2 className="mb-4 font-semibold">Filter</h2>
        <div className="space-y-2">
          {['By Weight', 'By Origin', 'By Price'].map((label) => (
            <div
              key={label}
              className="rounded border border-dashed p-3 text-sm text-gray-400"
            >
              {label} — placeholder
            </div>
          ))}
        </div>
      </aside>

      {/* Product grid */}
      <div>
        <h1 className="mb-2 text-2xl font-bold">{collection.title}</h1>
        <p className="mb-6 text-gray-600">{collection.description}</p>

        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3" role="list">
          {products.map((product) => (
            <li key={product.id}>
              <a
                href={`/products/${product.handle}`}
                className="group block focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                <div
                  className="aspect-square rounded bg-gray-100"
                  aria-hidden="true"
                />
                <p className="mt-2 font-medium group-hover:underline">
                  {product.title}
                </p>
                <p className="text-sm text-gray-500">{product.price}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function CollectionPage({ params }: Props) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Suspense fallback={<div aria-live="polite">Loading collection…</div>}>
        <CollectionContent params={params} />
      </Suspense>
    </div>
  )
}
