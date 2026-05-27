import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { SearchPagination } from './search-pagination'

const state = {
  query: 'chai',
  page: 3,
  sort: 'relevance',
  filters: [{ attribute: 'collections', value: 'Chai Tea' }],
} as const

const meta: Meta<typeof SearchPagination> = {
  title: 'Search/SearchPagination',
  component: SearchPagination,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
}
export default meta

type Story = StoryObj<typeof SearchPagination>

export const Default: Story = {
  args: {
    state,
    pagination: {
      currentPage: 3,
      pageSize: 24,
      totalPages: 8,
      totalItems: 181,
      startIndex: 48,
      hasNextPage: true,
      hasPreviousPage: true,
    },
  },
}

export const FirstPage: Story = {
  args: {
    state: { ...state, page: 1 },
    pagination: {
      currentPage: 1,
      pageSize: 24,
      totalPages: 4,
      totalItems: 83,
      startIndex: 0,
      hasNextPage: true,
      hasPreviousPage: false,
    },
  },
}
