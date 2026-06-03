import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { SortSelect } from './sort-select'

const meta: Meta<typeof SortSelect> = {
  title: 'Collection/SortSelect',
  component: SortSelect,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
}
export default meta

type Story = StoryObj<typeof SortSelect>

export const Featured: Story = {
  args: {
    currentSort: 'featured',
  },
}

export const PriceAscending: Story = {
  args: {
    currentSort: 'price-asc',
  },
}
