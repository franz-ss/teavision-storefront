import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
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
      <div className="bg-surface relative aspect-square overflow-hidden rounded">
        {product.featuredImage &&
        product.featuredImage.width &&
        product.featuredImage.height ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            width={product.featuredImage.width}
            height={product.featuredImage.height}
            priority
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="h-full w-full"
            role="img"
            aria-label={`${product.title} image`}
          />
        )}
      </div>

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
