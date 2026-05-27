import Image from 'next/image'
import Link from 'next/link'
import { LoaderCircle } from 'lucide-react'
import type { MouseEventHandler } from 'react'

import { Price } from '@/components/ui'
import type { ProductSummary } from '@/lib/shopify/types'
import { cn } from '@/lib/utils'

import {
  SUGGESTIONS_LISTBOX_ID,
  SUGGESTIONS_PANEL_ID,
} from './search-constants'
import type { SearchSuggestionsStatus } from './search-types'

function getSizedImageUrl(url: string, width: number): string {
  return `${url}${url.includes('?') ? '&' : '?'}width=${width}`
}

export function SearchSuggestions({
  activeSuggestionIndex = -1,
  onSuggestionMouseDown,
  onSuggestionMouseEnter,
  suggestions,
  status,
}: {
  activeSuggestionIndex?: number
  onSuggestionMouseDown?: MouseEventHandler<HTMLAnchorElement>
  onSuggestionMouseEnter?: (index: number) => void
  suggestions: ProductSummary[]
  status: SearchSuggestionsStatus
}) {
  return (
    <div
      id={SUGGESTIONS_PANEL_ID}
      className="border-subtle bg-surface absolute top-[calc(100%+0.5rem)] right-0 left-0 z-50 max-h-[min(36rem,calc(100vh-10rem))] overflow-y-auto rounded-md border shadow-xl lg:right-auto lg:left-1/2 lg:w-[min(calc(100vw-2rem),72rem)] lg:-translate-x-1/2"
    >
      <div
        className="border-subtle flex justify-end border-b px-3 py-1"
        aria-hidden="true"
      >
        <span className="type-caption text-muted uppercase">Products</span>
      </div>

      {status === 'loading' && (
        <div
          className="text-muted flex items-center gap-2 px-4 py-5"
          role="status"
          aria-live="polite"
        >
          <LoaderCircle
            className="size-4 animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          />
          <span className="type-body-sm">Searching products</span>
        </div>
      )}

      {status === 'empty' && (
        <p
          className="type-body-sm text-muted px-4 py-5"
          role="status"
          aria-live="polite"
        >
          No product suggestions found.
        </p>
      )}

      {status === 'error' && (
        <p
          className="type-body-sm text-muted px-4 py-5"
          role="status"
          aria-live="polite"
        >
          Search suggestions are unavailable.
        </p>
      )}

      {status === 'results' && suggestions.length > 0 && (
        <ul
          id={SUGGESTIONS_LISTBOX_ID}
          role="listbox"
          aria-label="Search suggestions"
        >
          {suggestions.map((product, index) => {
            const productUrl = `/products/${product.handle}`
            const optionId = `${SUGGESTIONS_LISTBOX_ID}-${index}`
            const isActive = index === activeSuggestionIndex

            return (
              <li key={product.id} role="none">
                <Link
                  id={optionId}
                  href={productUrl}
                  role="option"
                  aria-selected={isActive}
                  aria-label={`View ${product.title}`}
                  onMouseDown={onSuggestionMouseDown}
                  onMouseEnter={() => onSuggestionMouseEnter?.(index)}
                  className={cn(
                    'border-subtle hover:bg-surface-sunken focus-visible:ring-ring grid grid-cols-[4rem_minmax(0,1fr)] gap-3 border-b px-3 py-3 transition-colors last:border-b-0 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
                    isActive && 'bg-surface-sunken',
                  )}
                >
                  <span className="bg-surface-sunken relative size-16 overflow-hidden rounded-sm">
                    {product.featuredImage &&
                    product.featuredImage.width &&
                    product.featuredImage.height ? (
                      <Image
                        src={getSizedImageUrl(product.featuredImage.url, 160)}
                        alt={product.featuredImage.altText ?? product.title}
                        width={product.featuredImage.width}
                        height={product.featuredImage.height}
                        sizes="4rem"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="h-full w-full" aria-hidden="true" />
                    )}
                  </span>

                  <span className="min-w-0">
                    <span className="flex items-start justify-between gap-3">
                      <span className="type-label text-link line-clamp-1">
                        {product.title}
                      </span>
                      {product.availableForSale !== undefined && (
                        <span
                          className={cn(
                            'type-caption shrink-0 rounded-full border px-2 py-0.5',
                            product.availableForSale
                              ? 'border-success-border bg-success-bg text-success-text'
                              : 'border-danger-border bg-danger-bg text-danger-text',
                          )}
                        >
                          {product.availableForSale
                            ? 'In stock'
                            : 'Unavailable'}
                        </span>
                      )}
                    </span>

                    {product.description && (
                      <span className="type-body-sm text-muted mt-1 line-clamp-2">
                        {product.description}
                      </span>
                    )}

                    <span className="type-body-sm mt-1 flex flex-wrap items-baseline gap-1.5">
                      <span className="text-muted">From</span>
                      <Price
                        price={product.priceRange.minVariantPrice}
                        size="sm"
                        className="text-strong"
                      />
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
