import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Script from 'next/script'

import { getProduct } from '@/lib/shopify/operations/product'
import { withNoindexRobots } from '@/lib/seo/noindex'
import { serializeInlineJson } from '@/lib/seo/serialize-inline-json'
import { getTrustooProductRatings } from '@/lib/reviews/trustoo'
import { sanitizeShopifyCompactHtml } from '@/lib/shopify/html-content'
import { RichText } from '@/components/ui/rich-text'
import { Section, StarRating } from '@/components/ui'
import { ProductForm, ProductGallery } from '@/components/product'

import { CustomersAlsoBought } from './_components/customers-also-bought'
import { RelatedProducts } from './_components/related-products'
import {
  getNumericShopifyId,
  getShopifyAnalyticsMeta,
  getShopifyAnalyticsScript,
  getShopifyStorefrontContext,
} from './_lib/shopify-analytics'

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
  if (!product) return withNoindexRobots({ title: 'Product not found' })
  const description = product.description
    ? product.description.slice(0, 160)
    : `Buy ${product.title} from Teavision, Australia's bulk tea and herb supplier.`
  const imageUrl = product.images[0]?.url
  return withNoindexRobots({
    title: product.title,
    description,
    openGraph: {
      title: product.title,
      description,
      url: `/products/${handle}`,
      ...(imageUrl && { images: [{ url: imageUrl }] }),
    },
    alternates: { canonical: `/products/${handle}` },
  })
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
  const descriptionHtml = sanitizeShopifyCompactHtml(product.descriptionHtml)
  const productReviewSummaries = await getTrustooProductRatings([
    product.handle,
  ])
  const productReviewSummary = productReviewSummaries[product.handle] ?? {
    rating: product.rating,
    reviewCount: product.reviewCount,
  }

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
  const numericProductIdNumber = getNumericShopifyId(product.id)
  const shopifyAnalyticsMeta = numericProductIdNumber
    ? getShopifyAnalyticsMeta(product, numericProductIdNumber)
    : null
  const shopifyStorefrontContext =
    shopifyAnalyticsMeta && numericProductIdNumber
      ? getShopifyStorefrontContext(
          productUrl,
          numericProductIdNumber,
          shopifyAnalyticsMeta.page.requestId,
        )
      : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeInlineJson(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeInlineJson(breadcrumbJsonLd),
        }}
      />
      {shopifyAnalyticsMeta && shopifyStorefrontContext ? (
        <>
          <Script
            id={`shopify-analytics-meta-${numericProductIdNumber}`}
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: getShopifyAnalyticsScript(
                product.priceRange.minVariantPrice.currencyCode,
                shopifyAnalyticsMeta,
              ),
            }}
          />
          <Script
            id={`shopify-storefront-context-${numericProductIdNumber}`}
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `var __st=${serializeInlineJson(shopifyStorefrontContext)};`,
            }}
          />
        </>
      ) : null}

      <nav aria-label="Breadcrumb" className="text-muted mb-6 text-sm">
        <Link
          href="/"
          className="rounded hover:underline focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
        >
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <Link
          href="/collections/all"
          className="rounded hover:underline focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
        >
          Products
        </Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{product.title}</span>
      </nav>

      {/* Main product layout */}
      <div className="grid min-w-0 gap-8 lg:grid-cols-2">
        <div className="min-w-0">
          <ProductGallery images={product.images} title={product.title} />
        </div>

        <div className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-8 lg:self-start">
          <div className="flex flex-col gap-2">
            <h1 className="type-heading-02">{product.title}</h1>
            {productReviewSummary.rating !== undefined && (
              <StarRating
                rating={productReviewSummary.rating}
                count={productReviewSummary.reviewCount}
                size="sm"
              />
            )}
          </div>
          <ProductForm
            variants={product.variants}
            options={product.options}
            bulkPricingTiers={product.bulkPricingTiers}
          />
          <RichText
            html={descriptionHtml}
            variant="compact"
            className="max-w-prose"
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
                    className="border-default bg-surface text-muted type-eyebrow rounded border px-2 py-0.5"
                  >
                    {label}
                  </span>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <Section.Root
        tone="transparent"
        spacing="none"
        className="border-default mt-12 border-t pt-10"
        aria-label="Customer reviews"
      >
        <div className="mb-6 flex flex-wrap items-baseline gap-3">
          <h2 className="text-xl font-semibold">Reviews</h2>
        </div>
        <div id="shopify-product-reviews" data-id={numericProductId} />
      </Section.Root>

      {/* Product recommendations */}
      <div className="mt-12 flex flex-col gap-10">
        <Suspense fallback={null}>
          <RelatedProducts product={product} />
          <CustomersAlsoBought product={product} />
        </Suspense>
      </div>
    </>
  )
}

export default function ProductPage({ params }: Props) {
  return (
    <div className="max-w-wide mx-auto w-full p-4 md:p-6 lg:p-8">
      <Suspense
        fallback={
          <div
            className="grid min-h-screen gap-8 lg:grid-cols-2"
            role="status"
            aria-live="polite"
          >
            <span className="sr-only">Loading product</span>
            <div className="min-w-0">
              <div className="bg-surface-sunken aspect-4/3 w-full animate-pulse rounded motion-reduce:animate-none" />
              <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(4rem,1fr))] gap-2">
                {Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={index}
                    className="bg-surface-sunken aspect-square animate-pulse rounded motion-reduce:animate-none"
                  />
                ))}
              </div>
            </div>
            <div className="flex min-w-0 flex-col gap-4">
              <div className="bg-surface-sunken h-10 w-3/4 animate-pulse rounded motion-reduce:animate-none" />
              <div className="bg-surface-sunken h-5 w-36 animate-pulse rounded motion-reduce:animate-none" />
              <div className="border-default bg-surface flex flex-col gap-3 rounded border p-4">
                <div className="bg-surface-sunken h-5 w-24 animate-pulse rounded motion-reduce:animate-none" />
                <div className="bg-surface-sunken h-12 w-full animate-pulse rounded motion-reduce:animate-none" />
                <div className="bg-surface-sunken h-12 w-full animate-pulse rounded motion-reduce:animate-none" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-surface-sunken h-4 w-full animate-pulse rounded motion-reduce:animate-none" />
                <div className="bg-surface-sunken h-4 w-11/12 animate-pulse rounded motion-reduce:animate-none" />
                <div className="bg-surface-sunken h-4 w-2/3 animate-pulse rounded motion-reduce:animate-none" />
              </div>
            </div>
            <div className="border-default flex flex-col gap-6 border-t pt-10 lg:col-span-2">
              <div className="bg-surface-sunken h-7 w-32 animate-pulse rounded motion-reduce:animate-none" />
              <div className="bg-surface-sunken h-24 w-full animate-pulse rounded motion-reduce:animate-none" />
            </div>
          </div>
        }
      >
        <ProductContent params={params} />
      </Suspense>
    </div>
  )
}
