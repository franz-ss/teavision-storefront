import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import {
  getCollection,
  getCollectionProducts,
} from '@/lib/shopify/operations/collection'
import { ProductCard } from '@/components/ui/product-card'

type Props = {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const collection = await getCollection(handle)
  if (!collection) return { title: 'Collection not found' }
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

  if (!collection) notFound()

  return (
    <div className="md:grid md:grid-cols-[240px_1fr] md:gap-8">
      <aside aria-label="Filters">
        <h2 className="mb-4 font-semibold">Filter</h2>
        <div className="space-y-2">
          {['By Weight', 'By Origin', 'By Price'].map((label) => (
            <div
              key={label}
              className="text-text-muted rounded border border-dashed p-3 text-sm"
            >
              {label} — placeholder
            </div>
          ))}
        </div>
      </aside>

      <div>
        <h1 className="mb-2 text-2xl font-bold">{collection.title}</h1>
        <p className="text-text-muted mb-6">{collection.description}</p>

        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3" role="list">
          {products.map((product, i) => (
            <li key={product.id}>
              <ProductCard product={product} priority={i === 0} />
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
