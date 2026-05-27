import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { SearchSortSelect } from './search-sort-select'

const meta: Meta<typeof SearchSortSelect> = {
  title: 'Search/SearchSortSelect',
  component: SearchSortSelect,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
}
export default meta

type Story = StoryObj<typeof SearchSortSelect>

export const Default: Story = {
  args: {
    currentSort: 'relevance',
  },
}

export const PriceDescending: Story = {
  args: {
    currentSort: 'price-desc',
  },
}
