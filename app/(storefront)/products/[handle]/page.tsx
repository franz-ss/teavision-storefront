import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  getProduct,
  getProductRecommendations,
} from '@/lib/shopify/operations/product'
import { ProductCard, StarRating } from '@/components/ui'
import { ProductForm, ProductGallery } from '@/components/product'
import type { ProductSummary } from '@/lib/shopify/types'

// Mirrors the Liquid tag display logic from the Teavision theme:
// - Package_ tags are internal only, never shown
// - Underscored tags: strip "filter_" prefix, replace first _ with ": "
// - Plain strings: display as-is
function formatTag(tag: string): string | null {
  if (tag.includes('Package_')) return null
  if (tag.includes('_')) return tag.replace('filter_', '').replace('_', ': ')
  return tag
}

type Props = {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)
  if (!product) return { title: 'Product not found' }
  const description = product.description
    ? product.description.slice(0, 160)
    : `Buy ${product.title} from Teavision — Australia's bulk tea and herb supplier.`
  const imageUrl = product.images[0]?.url
  return {
    title: product.title,
    description,
    openGraph: {
      title: product.title,
      description,
      url: `/products/${handle}`,
      ...(imageUrl && { images: [{ url: imageUrl }] }),
    },
    alternates: { canonical: `/products/${handle}` },
  }
}

function ProductGrid({ products }: { products: ProductSummary[] }) {
  if (products.length === 0) return null
  return (
    <ul
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      role="list"
    >
      {products.map((product, i) => (
        <li key={product.id}>
          <ProductCard product={product} priority={i === 0} />
        </li>
      ))}
    </ul>
  )
}

async function RelatedProducts({ productId }: { productId: string }) {
  const products = await getProductRecommendations(productId, 'RELATED')
  const shown = products.slice(0, 4)
  if (shown.length === 0) return null
  return (
    <section className="border-border border-t pt-10">
      <h2 className="mb-6 text-xl font-semibold">You May Also Like</h2>
      <ProductGrid products={shown} />
    </section>
  )
}

async function ComplementaryProducts({ productId }: { productId: string }) {
  const products = await getProductRecommendations(productId, 'COMPLEMENTARY')
  const shown = products.slice(0, 4)
  if (shown.length === 0) return null
  return (
    <section className="border-border border-t pt-10">
      <h2 className="mb-6 text-xl font-semibold">
        Customers Who Bought This Also Bought
      </h2>
      <ProductGrid products={shown} />
    </section>
  )
}

async function ProductContent({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const product = await getProduct(handle)
  if (!product) notFound()

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://teavision.com.au'
  const productUrl = `${baseUrl}/products/${product.handle}`
  const hasAvailableVariant = product.variants.some((v) => v.availableForSale)

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    ...(product.images[0] && { image: product.images[0].url }),
    offers: {
      '@type': 'Offer',
      url: productUrl,
      price: product.priceRange.minVariantPrice.amount,
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      availability: hasAvailableVariant
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: `${baseUrl}/collections/all`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.title,
        item: productUrl,
      },
    ],
  }

  const numericProductId = product.id.replace('gid://shopify/Product/', '')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
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
          Products
        </Link>
        <span aria-hidden="true"> › </span>
        <span aria-current="page">{product.title}</span>
      </nav>

      {/* Main product layout */}
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <ProductGallery images={product.images} title={product.title} />

        <div className="flex flex-col gap-4 lg:sticky lg:top-8 lg:self-start">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <ProductForm variants={product.variants} options={product.options} />
          <div
            className="text-text-muted [&_h2]:text-text [&_h3]:text-text [&_strong]:text-text max-w-prose text-sm leading-relaxed [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 [&_h3]:text-sm [&_h3]:font-semibold [&_li]:mb-1 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />

          {/* Tags */}
          {product.tags.some((t) => formatTag(t) !== null) && (
            <div className="flex flex-wrap gap-1.5">
              {product.tags.map((tag) => {
                const label = formatTag(tag)
                if (!label) return null
                return (
                  <span
                    key={tag}
                    className="border-border bg-surface text-text-muted rounded border px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide uppercase"
                  >
                    {label}
                  </span>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Reviews — Shopify Product Reviews (SPR) */}
      <section
        className="border-border mt-12 border-t pt-10"
        aria-label="Customer reviews"
      >
        <div className="mb-6 flex flex-wrap items-baseline gap-3">
          <h2 className="text-xl font-semibold">Reviews</h2>
          {product.rating !== undefined && (
            <StarRating
              rating={product.rating}
              count={product.reviewCount}
              size="sm"
            />
          )}
        </div>
        {/* SPR embed — the app injects review HTML into this element */}
        <div id="shopify-product-reviews" data-id={numericProductId} />
      </section>

      {/* Related products and complementary — parallel server fetches */}
      <div className="mt-12 flex flex-col gap-10">
        <Suspense fallback={null}>
          <RelatedProducts productId={product.id} />
        </Suspense>
        <Suspense fallback={null}>
          <ComplementaryProducts productId={product.id} />
        </Suspense>
      </div>
    </>
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
