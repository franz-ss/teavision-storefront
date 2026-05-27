'use client'

import { Suspense, type ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { Section } from '@/components/ui'

import { RelatedProductsCarousel } from '../related-products-carousel'
import { SearchaniseScriptLoader } from './searchanise-script-loader'
import { useSearchaniseRecommendations } from './use-searchanise-recommendations'

const DEFAULT_WIDGET_ID = '1T8K1Y6Q6G8R3B3'
const DEFAULT_FALLBACK_DELAY_MS = 2500
const SEARCHANISE_API_KEY = process.env.NEXT_PUBLIC_SEARCHANISE_API_KEY
const SEARCHANISE_ENABLED =
  process.env.NEXT_PUBLIC_SEARCHANISE_ENABLED === 'true'

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

export { parseSearchaniseProducts } from './searchanise-product-parser'

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
  const hasFallback =
    fallback !== undefined && fallback !== null && fallback !== false
  const { products, renderState, widgetRef } = useSearchaniseRecommendations({
    fallbackDelayMs,
    hasFallback,
    widgetId,
  })

  const visibleContent =
    renderState === 'waiting' ? (
      <p className="type-body-sm text-muted" role="status" aria-live="polite">
        Loading recommendations…
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
          className={sectionClassName}
          aria-labelledby={titleId}
        >
          <h2 id={titleId} className={headingClassName}>
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
