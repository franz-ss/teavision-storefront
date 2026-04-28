import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import {
  getCollection,
  getCollectionProducts,
} from '@/lib/shopify/operations/collection'

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
              className="rounded border border-dashed p-3 text-sm text-gray-400"
            >
              {label} — placeholder
            </div>
          ))}
        </div>
      </aside>

      <div>
        <h1 className="mb-2 text-2xl font-bold">{collection.title}</h1>
        <p className="mb-6 text-gray-600">{collection.description}</p>

        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3" role="list">
          {products.map((product) => (
            <li key={product.id}>
              <Link
                href={`/products/${product.handle}`}
                className="group block focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                {product.featuredImage &&
                product.featuredImage.width &&
                product.featuredImage.height ? (
                  <Image
                    src={`${product.featuredImage.url}&width=400`}
                    alt={product.featuredImage.altText ?? product.title}
                    width={product.featuredImage.width}
                    height={product.featuredImage.height}
                    className="aspect-square w-full rounded object-cover"
                  />
                ) : (
                  <div
                    className="aspect-square rounded bg-gray-100"
                    aria-hidden="true"
                  />
                )}
                <p className="mt-2 font-medium group-hover:underline">
                  {product.title}
                </p>
                <p className="text-sm text-gray-500">
                  {product.priceRange.minVariantPrice.currencyCode}{' '}
                  {product.priceRange.minVariantPrice.amount}
                </p>
              </Link>
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
