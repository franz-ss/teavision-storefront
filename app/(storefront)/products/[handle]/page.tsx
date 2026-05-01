import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { notFound } from 'next/navigation'

import { getProduct, getProductRecommendations } from '@/lib/shopify/operations/product'
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
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" role="list">
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
      <h2 className="mb-6 text-xl font-semibold">Customers Who Bought This Also Bought</h2>
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
      availability: 'https://schema.org/InStock',
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

      {/* Trustoo reviews widget script — loads only when configured */}
      {process.env.NEXT_PUBLIC_TRUSTOO_SHOP_DOMAIN && (
        <Script
          src="https://cdn.trustoo.io/widget/v2/widget.js"
          strategy="lazyOnload"
        />
      )}

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-text-muted">
        <Link href="/" className="rounded hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1">Home</Link>
        <span aria-hidden="true"> › </span>
        <Link href="/collections/all" className="rounded hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1">Products</Link>
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
            className="text-text-muted max-w-prose text-sm leading-relaxed [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-text [&_h3]:mb-1 [&_h3]:mt-3 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-text [&_li]:mb-1 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-text [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5"
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
                    className="border-border bg-surface rounded border px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-text-muted"
                  >
                    {label}
                  </span>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Reviews — Trustoo widget */}
      <section className="border-border mt-12 border-t pt-10" aria-label="Customer reviews">
        <div className="mb-6 flex flex-wrap items-baseline gap-3">
          <h2 className="text-xl font-semibold">Reviews</h2>
          {/* Aggregate star rating — populated by Trustoo widget on mount */}
          <div
            id="trustoo-aggregate-rating"
            className="trustoo-star-rating"
            data-product-id={numericProductId}
          >
            {/* Trustoo injects aggregate score here; StarRating shown as placeholder */}
            <StarRating rating={0} size="sm" />
          </div>
        </div>
        {process.env.NEXT_PUBLIC_TRUSTOO_SHOP_DOMAIN ? (
          <div
            className="trustoo-widget"
            data-product-id={numericProductId}
            data-shop={process.env.NEXT_PUBLIC_TRUSTOO_SHOP_DOMAIN}
          />
        ) : (
          <p className="text-text-muted text-sm">
            Reviews are powered by Trustoo. Configure{' '}
            <code className="bg-surface rounded px-1 py-0.5 text-xs">NEXT_PUBLIC_TRUSTOO_SHOP_DOMAIN</code>
            {' '}to enable.
          </p>
        )}
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
