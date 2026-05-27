import Form from 'next/form'
import Image from 'next/image'
import Link from 'next/link'
import { LoaderCircle, Search } from 'lucide-react'
import type {
  ChangeEventHandler,
  FocusEventHandler,
  FormEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
} from 'react'

import { IconButton, Price, TextInput } from '@/components/ui'
import type { ProductSummary } from '@/lib/shopify/types'
import { cn } from '@/lib/utils'

export type HeaderSearchSuggestionsStatus =
  | 'idle'
  | 'loading'
  | 'results'
  | 'empty'
  | 'error'

type HeaderSearchFormProps = {
  activeSuggestionIndex?: number
  className?: string
  defaultQuery?: string
  isSuggestionsOpen?: boolean
  onBlur?: FocusEventHandler<HTMLFormElement>
  onInputChange?: ChangeEventHandler<HTMLInputElement>
  onInputFocus?: FocusEventHandler<HTMLInputElement>
  onKeyDown?: KeyboardEventHandler<HTMLFormElement>
  onSubmit?: FormEventHandler<HTMLFormElement>
  onSuggestionMouseDown?: MouseEventHandler<HTMLAnchorElement>
  onSuggestionMouseEnter?: (index: number) => void
  suggestions?: ProductSummary[]
  suggestionsStatus?: HeaderSearchSuggestionsStatus
  value?: string
}

const SUGGESTIONS_PANEL_ID = 'site-search-suggestions'
const SUGGESTIONS_LISTBOX_ID = 'site-search-suggestions-listbox'

function getSizedImageUrl(url: string, width: number): string {
  return `${url}${url.includes('?') ? '&' : '?'}width=${width}`
}

function HeaderSearchSuggestions({
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
  status: HeaderSearchSuggestionsStatus
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

export function HeaderSearchForm({
  activeSuggestionIndex = -1,
  className,
  defaultQuery = '',
  isSuggestionsOpen = false,
  onBlur,
  onInputChange,
  onInputFocus,
  onKeyDown,
  onSubmit,
  onSuggestionMouseDown,
  onSuggestionMouseEnter,
  suggestions = [],
  suggestionsStatus = 'idle',
  value,
}: HeaderSearchFormProps) {
  const activeDescendant =
    isSuggestionsOpen &&
    suggestionsStatus === 'results' &&
    activeSuggestionIndex >= 0
      ? `${SUGGESTIONS_LISTBOX_ID}-${activeSuggestionIndex}`
      : undefined
  const shouldShowSuggestions =
    isSuggestionsOpen && suggestionsStatus !== 'idle'
  const controls =
    suggestionsStatus === 'results' && suggestions.length > 0
      ? SUGGESTIONS_LISTBOX_ID
      : undefined

  return (
    <Form
      action="/search"
      role="search"
      aria-label="Site search"
      className={cn('relative w-full', className)}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      onSubmit={onSubmit}
    >
      <TextInput
        key={value === undefined ? defaultQuery : undefined}
        role="combobox"
        aria-label="Search products and articles"
        aria-autocomplete="list"
        aria-controls={controls}
        aria-expanded={isSuggestionsOpen}
        aria-activedescendant={activeDescendant}
        autoComplete="off"
        className="border-default bg-canvas min-h-12 rounded-lg py-0 pr-12 pl-5"
        data-header-search-input
        defaultValue={value === undefined ? defaultQuery : undefined}
        enterKeyHint="search"
        inputMode="search"
        name="q"
        onChange={onInputChange}
        onFocus={onInputFocus}
        placeholder="Find products and articles"
        type="search"
        value={value}
      />
      <IconButton
        type="submit"
        variant="ghost"
        size="sm"
        className="absolute top-1/2 right-1 size-10 -translate-y-1/2"
        aria-label="Submit search"
      >
        <Search className="size-4" aria-hidden="true" strokeWidth={1.8} />
      </IconButton>
      {shouldShowSuggestions && (
        <HeaderSearchSuggestions
          activeSuggestionIndex={activeSuggestionIndex}
          onSuggestionMouseDown={onSuggestionMouseDown}
          onSuggestionMouseEnter={onSuggestionMouseEnter}
          suggestions={suggestions}
          status={suggestionsStatus}
        />
      )}
    </Form>
  )
}
