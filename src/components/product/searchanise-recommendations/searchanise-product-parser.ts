import type { ProductSummary } from '@/lib/shopify/types'

const DEFAULT_IMAGE_DIMENSION = 800
const DEFAULT_CURRENCY_CODE = 'AUD'

function getTrimmedText(element: Element, selectors: string[]): string | null {
  for (const selector of selectors) {
    const text = element.querySelector(selector)?.textContent?.trim()
    if (text) return text
  }

  return null
}

function getProductHandle(href: string): string | null {
  try {
    const url = new URL(href, window.location.origin)
    const parts = url.pathname.split('/').filter(Boolean)
    const productsIndex = parts.indexOf('products')
    if (productsIndex === -1) return null

    const handle = parts[productsIndex + 1]

    return handle ? decodeURIComponent(handle) : null
  } catch {
    return null
  }
}

function getSearchaniseProductId(element: Element, handle: string): string {
  const rawId =
    element.getAttribute('data-original-product-id') ??
    element.getAttribute('data-product-id') ??
    element
      .querySelector('[data-original-product-id]')
      ?.getAttribute('data-original-product-id') ??
    element.querySelector('[data-product-id]')?.getAttribute('data-product-id')

  if (!rawId) return `searchanise:${handle}`
  if (rawId.startsWith('gid://')) return rawId

  return `gid://shopify/Product/${rawId}`
}

function getAbsoluteImageUrl(image: HTMLImageElement): string | null {
  const src =
    image.currentSrc ||
    image.getAttribute('src') ||
    image.getAttribute('data-src') ||
    image.getAttribute('data-original') ||
    image.getAttribute('data-lazy-src')

  if (!src || src.startsWith('data:')) return null

  try {
    const url = new URL(src, window.location.origin)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null

    return url.toString()
  } catch {
    return null
  }
}

function getImageDimension(
  image: HTMLImageElement,
  attributeName: 'height' | 'width',
): number {
  const attributeValue = image.getAttribute(attributeName)
  const parsedValue = attributeValue ? Number.parseInt(attributeValue, 10) : NaN

  return Number.isFinite(parsedValue) && parsedValue > 0
    ? parsedValue
    : DEFAULT_IMAGE_DIMENSION
}

function getMoneyAmount(text: string): string | null {
  const match = text.replace(/,/g, '').match(/\d+(?:\.\d+)?/)
  if (!match) return null

  const amount = Number.parseFloat(match[0])
  if (!Number.isFinite(amount)) return null

  return amount.toFixed(2)
}

function parseSearchaniseProduct(element: Element): ProductSummary | null {
  const link = element.querySelector<HTMLAnchorElement>(
    'a.snize-view-link[href], a[href*="/products/"]',
  )
  const href = link?.getAttribute('href')
  if (!href) return null

  const handle = getProductHandle(href)
  if (!handle) return null

  const title = getTrimmedText(element, [
    '.snize-title',
    '.snize-product-title',
    '[data-product-title]',
  ])
  if (!title) return null

  const priceText = getTrimmedText(element, [
    '.snize-price',
    '.snize-discounted-price',
    '.snize-price-list',
  ])
  const amount = priceText ? getMoneyAmount(priceText) : null
  if (!amount) return null

  const image = element.querySelector<HTMLImageElement>(
    'img.snize-item-image, .snize-thumbnail img, img',
  )
  const imageUrl = image ? getAbsoluteImageUrl(image) : null

  return {
    id: getSearchaniseProductId(element, handle),
    handle,
    title,
    featuredImage:
      image && imageUrl
        ? {
            url: imageUrl,
            altText: image.getAttribute('alt') || title,
            width: getImageDimension(image, 'width'),
            height: getImageDimension(image, 'height'),
          }
        : null,
    priceRange: {
      minVariantPrice: {
        amount,
        currencyCode: DEFAULT_CURRENCY_CODE,
      },
    },
  }
}

export function parseSearchaniseProducts(
  sourceElement: HTMLElement,
): ProductSummary[] {
  const seenHandles = new Set<string>()
  const products: ProductSummary[] = []
  const searchaniseProductElements = Array.from(
    sourceElement.querySelectorAll('.snize-product'),
  )
  const fallbackProductElements = Array.from(
    sourceElement.querySelectorAll(
      '[data-product-id], [data-original-product-id]',
    ),
  )
  const productElements =
    searchaniseProductElements.length > 0
      ? searchaniseProductElements
      : fallbackProductElements

  for (const productElement of productElements) {
    const product = parseSearchaniseProduct(productElement)
    if (!product || seenHandles.has(product.handle)) continue

    seenHandles.add(product.handle)
    products.push(product)
  }

  return products
}
