import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import type { ProductSummary } from '@/lib/shopify/types'

import { SearchForm } from './search-form'

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
  {
    id: 'gid://shopify/Product/2',
    handle: 'organic-relax-tea',
    title: 'Organic Relax & Rejuvenate',
    description:
      'A soothing blend of lemon balm, peppermint, liquorice root, and chamomile.',
    availableForSale: true,
    featuredImage: {
      url: 'https://cdn.shopify.com/s/files/1/0786/8339/files/OrganicRelaxandRejuvenate_1.jpg?v=1752208016',
      altText: 'Organic Relax and Rejuvenate tea',
      width: 1922,
      height: 2000,
    },
    priceRange: {
      minVariantPrice: { amount: '87.47', currencyCode: 'AUD' },
    },
  },
]

const meta: Meta<typeof SearchForm> = {
  title: 'Layout/Header/Search Form',
  component: SearchForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
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

type Story = StoryObj<typeof SearchForm>

/** Default serif large-display input for the search overlay. */
export const Empty: Story = {}

export const WithQuery: Story = {
  args: {
    defaultQuery: 'matcha',
  },
}

export const WithSuggestions: Story = {
  args: {
    activeSuggestionIndex: 0,
    defaultQuery: 'a',
    isSuggestionsOpen: true,
    suggestions,
    suggestionsStatus: 'results',
  },
}

export const UnavailableSuggestion: Story = {
  args: {
    activeSuggestionIndex: 0,
    defaultQuery: 'rose',
    isSuggestionsOpen: true,
    suggestions: [
      {
        id: 'gid://shopify/Product/3',
        handle: 'premium-rose-petals',
        title: 'Premium Rose Petals With A Very Long Product Name',
        availableForSale: false,
        featuredImage: null,
        priceRange: {
          minVariantPrice: { amount: '16.17', currencyCode: 'AUD' },
        },
      },
    ],
    suggestionsStatus: 'results',
  },
}

export const LoadingSuggestions: Story = {
  args: {
    defaultQuery: 'apple',
    isSuggestionsOpen: true,
    suggestionsStatus: 'loading',
  },
}

export const EmptySuggestions: Story = {
  args: {
    defaultQuery: 'zzzz',
    isSuggestionsOpen: true,
    suggestionsStatus: 'empty',
  },
}

export const ErrorSuggestions: Story = {
  args: {
    defaultQuery: 'matcha',
    isSuggestionsOpen: true,
    suggestionsStatus: 'error',
  },
}
