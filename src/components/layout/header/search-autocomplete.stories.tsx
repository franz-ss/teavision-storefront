import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import type { ProductSummary } from '@/lib/shopify/types'

import { SearchAutocomplete } from './search-autocomplete'

const suggestions: ProductSummary[] = [
  {
    id: 'gid://shopify/Product/1',
    handle: 'organic-ashwaghanda-root',
    title: 'Organic Ashwagandha Cut',
    description:
      'Sip into serenity with a soothing brew that calms the mind naturally.',
    availableForSale: true,
    featuredImage: {
      url: 'https://cdn.shopify.com/s/files/1/0786/8339/products/ashwaghanda.jpg?v=1574632489',
      altText: 'Organic Ashwagandha Cut',
      width: 1191,
      height: 1118,
    },
    priceRange: {
      minVariantPrice: { amount: '28.18', currencyCode: 'AUD' },
    },
  },
]

function setInputValue(input: HTMLInputElement, value: string) {
  const valueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value',
  )?.set

  valueSetter?.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

async function waitForText(canvasElement: HTMLElement, text: string) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (canvasElement.textContent?.includes(text)) return
    await wait(50)
  }

  throw new Error(`Expected story text not found: ${text}`)
}

const meta: Meta<typeof SearchAutocomplete> = {
  title: 'Layout/Header/Search Autocomplete',
  component: SearchAutocomplete,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    nextjs: { appDirectory: true },
  },
  decorators: [
    (Story) => (
      <div className="bg-paper border-b-2 border-ink w-[min(42rem,calc(100vw-2rem))] p-6">
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof SearchAutocomplete>

export const InteractiveSuggestions: Story = {
  args: {
    initialQuery: '',
  },
  play: async ({ canvasElement }) => {
    const originalFetch = window.fetch
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url =
        typeof input === 'string'
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url

      if (!url.includes('/api/search/suggestions')) {
        return originalFetch(input, init)
      }

      return new Response(JSON.stringify({ products: suggestions }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    try {
      const input = canvasElement.querySelector<HTMLInputElement>(
        '[data-search-input]',
      )
      if (!input) throw new Error('Header search input not found')

      input.focus()
      setInputValue(input, 'ash')

      await waitForText(canvasElement, 'Organic Ashwagandha Cut')

      input.dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }),
      )
      await wait(16)

      const firstOption = canvasElement.querySelector<HTMLElement>(
        '#site-search-suggestions-listbox-0',
      )
      if (firstOption?.getAttribute('aria-selected') !== 'true') {
        throw new Error('ArrowDown did not select the first suggestion')
      }

      input.dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }),
      )
      await wait(16)

      if (canvasElement.querySelector('#site-search-suggestions')) {
        throw new Error('Escape did not close search suggestions')
      }
    } finally {
      window.fetch = originalFetch
    }
  },
}
