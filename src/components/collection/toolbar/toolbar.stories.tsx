import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { FilterType, type CollectionProductFilter } from '@/lib/shopify/types'

import { Toolbar } from './toolbar'

const filters: CollectionProductFilter[] = [
  {
    id: 'filter.p.product_type',
    label: 'Product type',
    type: FilterType.List,
    values: [
      {
        id: 'filter.p.product_type.green-tea',
        label: 'Green tea',
        count: 12,
        input: JSON.stringify({ productType: 'Green tea' }),
      },
      {
        id: 'filter.p.product_type.black-tea',
        label: 'Black tea',
        count: 8,
        input: JSON.stringify({ productType: 'Black tea' }),
      },
    ],
  },
]

const meta: Meta<typeof Toolbar> = {
  title: 'Collection/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
}
export default meta

type Story = StoryObj<typeof Toolbar>

export const Default: Story = {
  args: {
    headingId: 'storybook-collection-products',
    currentSort: 'featured',
    productCount: 20,
    filters,
    selectedFilters: [],
  },
}

export const WithActiveFilter: Story = {
  args: {
    headingId: 'storybook-collection-products-filtered',
    currentSort: 'best-selling',
    productCount: 8,
    filters,
    selectedFilters: [filters[0].values[1].input],
  },
}
