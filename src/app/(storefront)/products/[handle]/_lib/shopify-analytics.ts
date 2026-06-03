import { serializeInlineJson } from '@/lib/seo/serialize-inline-json'
import type { Product } from '@/lib/shopify/types'

const SHOPIFY_ANALYTICS_SHOP_ID = 7868339

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

export type ShopifyStorefrontContext = {
  a: number
  offset: number
  reqid: string
  pageurl: string
  p: 'product'
  rtyp: 'product'
  rid: number
}

export function getNumericShopifyId(gid: string): number | null {
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

export function getShopifyAnalyticsMeta(
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

export function getShopifyStorefrontContext(
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

export function getShopifyAnalyticsScript(
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
