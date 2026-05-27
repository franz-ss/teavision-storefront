'use client'

import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react'

import type { ProductSummary } from '@/lib/shopify/types'
import { cn } from '@/lib/utils'
import { Section } from '@/components/ui'

import { RelatedProductsCarousel } from '../related-products-carousel'
import {
  isSearchaniseFailed,
  isSearchaniseReady,
  SEARCHANISE_FAILED_EVENT,
  SEARCHANISE_READY_EVENT,
  SearchaniseScriptLoader,
} from './searchanise-script-loader'

const DEFAULT_WIDGET_ID = '1T8K1Y6Q6G8R3B3'
const DEFAULT_FALLBACK_DELAY_MS = 2500
const DEFAULT_IMAGE_DIMENSION = 800
const DEFAULT_CURRENCY_CODE = 'AUD'
const SEARCHANISE_API_KEY = process.env.NEXT_PUBLIC_SEARCHANISE_API_KEY
const SEARCHANISE_ENABLED =
  process.env.NEXT_PUBLIC_SEARCHANISE_ENABLED === 'true'

type SearchaniseRenderState = 'waiting' | 'rendered' | 'fallback' | 'empty'

export type SearchaniseRecommendationsProps = {
  className?: string
  fallback?: ReactNode
  fallbackDelayMs?: number
  headingClassName?: string
  sectionClassName?: string
  title?: ReactNode
  titleId?: string
  widgetId?: string
}

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

export function SearchaniseRecommendations({
  className,
  fallback,
  fallbackDelayMs = DEFAULT_FALLBACK_DELAY_MS,
  headingClassName,
  sectionClassName,
  title,
  titleId,
  widgetId = DEFAULT_WIDGET_ID,
}: SearchaniseRecommendationsProps) {
  const widgetRef = useRef<HTMLDivElement>(null)
  const [renderState, setRenderState] =
    useState<SearchaniseRenderState>('waiting')
  const [products, setProducts] = useState<ProductSummary[]>([])
  const hasFallback =
    fallback !== undefined && fallback !== null && fallback !== false

  useEffect(() => {
    const widget = widgetRef.current
    if (!widget) return
    const searchaniseWidget = widget

    let fallbackTimer: number | null = null
    let observer: MutationObserver | null = null
    let productsKey = ''

    function clearFallbackTimer() {
      if (fallbackTimer === null) return

      window.clearTimeout(fallbackTimer)
      fallbackTimer = null
    }

    function markRenderedIfProductsFound(): boolean {
      const nextProducts = parseSearchaniseProducts(searchaniseWidget)
      if (nextProducts.length === 0) return false

      clearFallbackTimer()
      observer?.disconnect()

      const nextProductsKey = nextProducts
        .map((product) => `${product.id}:${product.handle}`)
        .join('|')

      if (nextProductsKey !== productsKey) {
        productsKey = nextProductsKey
        setProducts(nextProducts)
      }

      setRenderState('rendered')
      return true
    }

    function markFallbackIfEmpty() {
      const nextProducts = parseSearchaniseProducts(searchaniseWidget)
      observer?.disconnect()

      if (nextProducts.length > 0) {
        setProducts(nextProducts)
        setRenderState('rendered')
        return
      }

      if (!hasFallback) {
        setRenderState('empty')
        return
      }

      setRenderState('fallback')
    }

    function startFallbackTimer() {
      clearFallbackTimer()

      if (fallbackDelayMs <= 0) {
        markFallbackIfEmpty()
        return
      }

      fallbackTimer = window.setTimeout(markFallbackIfEmpty, fallbackDelayMs)
    }

    function handleSearchaniseReady() {
      if (!markRenderedIfProductsFound()) {
        startFallbackTimer()
      }
    }

    function handleSearchaniseFailed() {
      markFallbackIfEmpty()
    }

    observer = new MutationObserver(markRenderedIfProductsFound)

    observer.observe(searchaniseWidget, {
      childList: true,
      characterData: true,
      subtree: true,
    })

    if (!markRenderedIfProductsFound()) {
      startFallbackTimer()
    }

    window.addEventListener(SEARCHANISE_READY_EVENT, handleSearchaniseReady)
    window.addEventListener(SEARCHANISE_FAILED_EVENT, handleSearchaniseFailed)

    if (fallbackDelayMs <= 0 || isSearchaniseReady()) {
      handleSearchaniseReady()
    } else if (isSearchaniseFailed()) {
      handleSearchaniseFailed()
    }

    return () => {
      clearFallbackTimer()
      observer?.disconnect()
      window.removeEventListener(
        SEARCHANISE_READY_EVENT,
        handleSearchaniseReady,
      )
      window.removeEventListener(
        SEARCHANISE_FAILED_EVENT,
        handleSearchaniseFailed,
      )
    }
  }, [fallbackDelayMs, hasFallback, widgetId])

  const visibleContent =
    renderState === 'waiting' ? (
      <p className="type-body-sm text-muted" role="status" aria-live="polite">
        Loading recommendations
      </p>
    ) : renderState === 'rendered' && products.length > 0 ? (
      <RelatedProductsCarousel
        products={products}
        ariaLabel="Customers also bought products"
      />
    ) : renderState === 'fallback' && fallback ? (
      <div data-searchanise-fallback>{fallback}</div>
    ) : renderState === 'empty' ? (
      <p className="type-body-sm text-muted" role="status">
        No recommendations are available.
      </p>
    ) : null

  return (
    <div
      className={cn('relative min-w-0', className)}
      data-searchanise-state={renderState}
    >
      {SEARCHANISE_ENABLED && SEARCHANISE_API_KEY ? (
        <Suspense fallback={null}>
          <SearchaniseScriptLoader apiKey={SEARCHANISE_API_KEY} />
        </Suspense>
      ) : null}

      <div
        className="pointer-events-none absolute top-0 left-0 h-0 w-full overflow-hidden opacity-0"
        aria-hidden="true"
        inert
      >
        <div
          ref={widgetRef}
          className="searchanise-recommendations"
          id={widgetId}
        />
      </div>

      {visibleContent && title ? (
        <Section.Root
          tone="transparent"
          spacing="none"
          className={cn(sectionClassName)}
          aria-labelledby={titleId}
        >
          <h2 id={titleId} className={cn(headingClassName)}>
            {title}
          </h2>
          {visibleContent}
        </Section.Root>
      ) : (
        visibleContent
      )}
    </div>
  )
}
