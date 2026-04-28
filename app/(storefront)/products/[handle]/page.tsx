import type { Metadata } from 'next'
import { cacheLife, cacheTag } from 'next/cache'
import { Suspense } from 'react'
import { VariantSelector } from '@/components/product/variant-selector'

type Product = {
  handle: string
  title: string
  description: string
  price: string
}

async function getProduct(handle: string): Promise<Product> {
  'use cache'
  cacheTag('product', `product-${handle}`)
  cacheLife('hours')

  return {
    handle,
    title: 'English Breakfast — Bulk Loose Leaf',
    description:
      'Premium Assam-based black tea blend. Available in 250g, 1kg, 5kg, and 10kg.',
    price: '$18.00',
  }
}

type Props = {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)
  return { title: product.title }
}

async function ProductContent({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const product = await getProduct(handle)

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Image gallery placeholder */}
      <div
        className="aspect-square rounded bg-gray-100"
        role="img"
        aria-label="Product image placeholder"
      />

      {/* Product details */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="text-xl font-semibold">{product.price}</p>

        <VariantSelector />

        <button
          type="button"
          aria-label="Add to cart"
          className="rounded bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Add to Cart
        </button>

        <p className="text-gray-600">{product.description}</p>
      </div>
    </div>
  )
}

export default function ProductPage({ params }: Props) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Suspense fallback={<div aria-live="polite">Loading product…</div>}>
        <ProductContent params={params} />
      </Suspense>
    </div>
  )
}
