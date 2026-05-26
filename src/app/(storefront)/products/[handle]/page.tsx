import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  getProduct,
  getProductRecommendations,
} from '@/lib/shopify/operations/product'
import { getCollectionProducts } from '@/lib/shopify/operations/collection'
import { getTrustooProductRatings } from '@/lib/reviews/trustoo'
import { sanitizeShopifyCompactHtml } from '@/lib/shopify/html-content'
import { RichText } from '@/components/ui/rich-text'
import { Section, StarRating } from '@/components/ui'
import {
  ProductForm,
  ProductGallery,
  RelatedProductsCarousel,
  SearchaniseRecommendations,
} from '@/components/product'
import type { Product, ProductSummary } from '@/lib/shopify/types'

const RELATED_COLLECTION_FETCH_LIMIT = 12
const CUSTOMERS_ALSO_BOUGHT_TITLE =
  'Customers Who Bought This Product Also Bought'
const RELATED_PRODUCTS_TITLE = 'Related Products'
const SEARCHANISE_API_KEY = process.env.NEXT_PUBLIC_SEARCHANISE_API_KEY
const SEARCHANISE_ENABLED =
  process.env.NEXT_PUBLIC_SEARCHANISE_ENABLED === 'true'
const SHOPIFY_ANALYTICS_SHOP_ID = 7868339

const RELATED_COLLECTION_BY_TAG = new Map<string, string>([
  ['categories_All Herbs', 'dried-herbs'],
])

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

type ShopifyAnalyticsMeta = {
  product: {
    id: number
    gid: string
    vendor: string
    type: string
    handle: string
    variants: Array<{
      id: number
      price: number
      name: string
      public_title: string | null
      sku: string
    }>
    remote: boolean
  }
  page: {
    pageType: 'product'
    resourceType: 'product'
    resourceId: number
    requestId: string
  }
}

type ShopifyStorefrontContext = {
  a: number
  offset: number
  reqid: string
  pageurl: string
  p: 'product'
  rtyp: 'product'
  rid: number
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)
  if (!product) return { title: 'Product not found' }
  const description = product.description
    ? product.description.slice(0, 160)
    : `Buy ${product.title} from Teavision, Australia's bulk tea and herb supplier.`
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

function getRelatedCollectionHandle(product: Product): string | null {
  for (const tag of product.tags) {
    const handle = RELATED_COLLECTION_BY_TAG.get(tag)
    if (handle) return handle
  }

  return null
}

function getNumericShopifyId(gid: string): number | null {
  const id = gid.split('/').at(-1)
  if (!id) return null

  const numericId = Number(id)
  return Number.isFinite(numericId) ? numericId : null
}

function getPriceCents(amount: string): number {
  const numericAmount = Number.parseFloat(amount)
  if (!Number.isFinite(numericAmount)) return 0

  return Math.round(numericAmount * 100)
}

function getPageUrlWithoutProtocol(url: string): string {
  return url.replace(/^https?:\/\//, '')
}

function serializeInlineJson(value: unknown): string {
  return (JSON.stringify(value) ?? 'null').replace(/</g, '\\u003c')
}

function getShopifyAnalyticsMeta(
  product: Product,
  productId: number,
): ShopifyAnalyticsMeta {
  const variants = product.variants
    .map((variant) => {
      const variantId = getNumericShopifyId(variant.id)
      if (!variantId) return null

      const publicTitle =
        variant.title === 'Default Title' ? null : variant.title

      return {
        id: variantId,
        price: getPriceCents(variant.price.amount),
        name: `${product.title} - ${variant.title}`,
        public_title: publicTitle,
        sku: '',
      }
    })
    .filter((variant) => variant !== null)

  return {
    product: {
      id: productId,
      gid: product.id,
      vendor: 'teavision.com.au',
      type: '',
      handle: product.handle,
      variants,
      remote: false,
    },
    page: {
      pageType: 'product',
      resourceType: 'product',
      resourceId: productId,
      requestId: `product-${productId}`,
    },
  }
}

function getShopifyStorefrontContext(
  productUrl: string,
  productId: number,
  requestId: string,
): ShopifyStorefrontContext {
  return {
    a: SHOPIFY_ANALYTICS_SHOP_ID,
    offset: 36000,
    reqid: requestId,
    pageurl: getPageUrlWithoutProtocol(productUrl),
    p: 'product',
    rtyp: 'product',
    rid: productId,
  }
}

function getShopifyAnalyticsScript(
  currencyCode: string,
  meta: ShopifyAnalyticsMeta,
): string {
  return `
window.ShopifyAnalytics = window.ShopifyAnalytics || {};
window.ShopifyAnalytics.meta = window.ShopifyAnalytics.meta || {};
window.ShopifyAnalytics.meta.currency = ${serializeInlineJson(currencyCode)};
var meta = ${serializeInlineJson(meta)};
for (var attr in meta) {
  window.ShopifyAnalytics.meta[attr] = meta[attr];
}
`
}

async function getRelatedProducts(product: Product): Promise<ProductSummary[]> {
  const relatedCollectionHandle = getRelatedCollectionHandle(product)
  let products: ProductSummary[]

  if (relatedCollectionHandle) {
    const collectionProducts = await getCollectionProducts(
      relatedCollectionHandle,
      RELATED_COLLECTION_FETCH_LIMIT,
    )

    products = collectionProducts
      .filter((item) => item.handle !== product.handle)
      .slice(0, RELATED_COLLECTION_FETCH_LIMIT)
  } else {
    products = await getProductRecommendations(product.id, 'RELATED')
  }

  const reviewSummaries = await getTrustooProductRatings(
    products.map((relatedProduct) => relatedProduct.handle),
  )

  return products.map((relatedProduct) => {
    const reviewSummary = reviewSummaries[relatedProduct.handle]
    if (!reviewSummary) return relatedProduct

    return {
      ...relatedProduct,
      rating: reviewSummary.rating,
      reviewCount: reviewSummary.reviewCount,
    }
  })
}

function RelatedProductsContent({ products }: { products: ProductSummary[] }) {
  if (products.length === 0) return null

  return <RelatedProductsCarousel products={products} />
}

async function RelatedProducts({ product }: { product: Product }) {
  const products = await getRelatedProducts(product)
  if (products.length === 0) return null

  return (
    <Section.Root
      tone="transparent"
      spacing="none"
      className="border-default border-t pt-10"
      aria-labelledby="related-products-title"
    >
      <h2 id="related-products-title" className="mb-6 text-xl font-semibold">
        {RELATED_PRODUCTS_TITLE}
      </h2>
      <RelatedProductsContent products={products} />
    </Section.Root>
  )
}

function CustomersAlsoBought() {
  if (!SEARCHANISE_ENABLED || !SEARCHANISE_API_KEY) return null

  return (
    <Section.Root
      tone="transparent"
      spacing="none"
      className="border-default border-t pt-10"
      aria-labelledby="customers-also-bought-title"
    >
      <h2
        id="customers-also-bought-title"
        className="mb-6 text-xl font-semibold"
      >
        {CUSTOMERS_ALSO_BOUGHT_TITLE}
      </h2>
      <SearchaniseRecommendations />
    </Section.Root>
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
          <script
            dangerouslySetInnerHTML={{
              __html: getShopifyAnalyticsScript(
                product.priceRange.minVariantPrice.currencyCode,
                shopifyAnalyticsMeta,
              ),
            }}
          />
          <script
            id="__st"
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
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <ProductGallery images={product.images} title={product.title} />

        <div className="flex flex-col gap-4 lg:sticky lg:top-8 lg:self-start">
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
          <ProductForm variants={product.variants} options={product.options} />
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
          <CustomersAlsoBought />
        </Suspense>
      </div>
    </>
  )
}

export default function ProductPage({ params }: Props) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Suspense fallback={<div aria-live="polite">Loading product...</div>}>
        <ProductContent params={params} />
      </Suspense>
    </div>
  )
}
