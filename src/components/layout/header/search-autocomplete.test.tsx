/**
 * @vitest-environment jsdom
 */
import type {
  AnchorHTMLAttributes,
  ComponentType,
  MouseEvent,
  ReactNode,
} from 'react'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'

import type { ProductSummary } from '@/lib/shopify/types'

import { SearchAutocomplete } from './search-autocomplete'

;(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true

const push = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    onClick,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: ReactNode
    href: string
  }) => (
    <a
      href={href}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event)
        event.preventDefault()
      }}
      {...props}
    >
      {children}
    </a>
  ),
}))

const suggestion: ProductSummary = {
  id: 'gid://shopify/Product/organic-ashwagandha',
  handle: 'organic-ashwagandha-cut',
  title: 'Organic Ashwagandha Cut',
  description: 'A grounding herb for evening blends.',
  availableForSale: true,
  featuredImage: null,
  priceRange: {
    minVariantPrice: { amount: '28.18', currencyCode: 'AUD' },
  },
}

function setInputValue(input: HTMLInputElement, value: string) {
  const valueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value',
  )?.set

  valueSetter?.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

const SearchAutocompleteWithClose = SearchAutocomplete as ComponentType<{
  initialQuery: string
  onNavigate?: () => void
}>

describe('SearchAutocomplete', () => {
  it('notifies the parent when a product suggestion is clicked', async () => {
    const onNavigate = vi.fn()
    const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ products: [suggestion] }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }),
    )
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)

    try {
      await act(async () => {
        root.render(
          <SearchAutocompleteWithClose
            initialQuery=""
            onNavigate={onNavigate}
          />,
        )
      })

      const input = host.querySelector<HTMLInputElement>('[data-search-input]')
      if (!input) throw new Error('Expected header search input to render')

      await act(async () => {
        input.focus()
        setInputValue(input, 'ash')
        await new Promise((resolve) => window.setTimeout(resolve, 220))
      })

      const suggestionLink = host.querySelector<HTMLAnchorElement>(
        'a[href="/products/organic-ashwagandha-cut"]',
      )
      if (!suggestionLink) {
        throw new Error('Expected product suggestion link to render')
      }

      await act(async () => {
        suggestionLink.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true }),
        )
      })

      expect(onNavigate).toHaveBeenCalledOnce()
    } finally {
      await act(async () => {
        root.unmount()
      })
      host.remove()
      fetch.mockRestore()
    }
  })
})
