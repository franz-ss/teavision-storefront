import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/shopify/operations/product'
import { ProductForm } from '@/components/product/product-form'
import { Price } from '@/components/ui/price'

type Props = {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)
  if (!product) return { title: 'Product not found' }
  return { title: product.title }
}

async function ProductContent({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const product = await getProduct(handle)
  if (!product) notFound()

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div
        className="bg-surface aspect-square rounded"
        role="img"
        aria-label={product.featuredImage?.altText ?? `${product.title} image`}
      />

      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <Price price={product.priceRange.minVariantPrice} size="lg" />
        <ProductForm variants={product.variants} />
        <p className="text-text-muted">{product.description}</p>
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
