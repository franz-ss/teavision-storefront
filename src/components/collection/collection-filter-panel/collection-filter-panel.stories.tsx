import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { FilterType, type CollectionProductFilter } from '@/lib/shopify/types'

import { CollectionFilterPanel } from './collection-filter-panel'

const organicInput = JSON.stringify({ tag: 'organic' })

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
  {
    id: 'filter.p.tag',
    label: 'Attributes',
    type: FilterType.List,
    values: [
      {
        id: 'filter.p.tag.organic',
        label: 'Organic',
        count: 6,
        input: organicInput,
      },
      {
        id: 'filter.p.tag.caffeine-free',
        label: 'Caffeine free',
        count: 3,
        input: JSON.stringify({ tag: 'caffeine-free' }),
      },
    ],
  },
]

const meta: Meta<typeof CollectionFilterPanel> = {
  title: 'Collection/CollectionFilterPanel',
  component: CollectionFilterPanel,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
}
export default meta

type Story = StoryObj<typeof CollectionFilterPanel>

export const Default: Story = {
  args: {
    filters,
    selectedFilters: [],
    resultCount: 20,
  },
}

export const WithActiveFilter: Story = {
  args: {
    filters,
    selectedFilters: [organicInput],
    resultCount: 6,
  },
}
