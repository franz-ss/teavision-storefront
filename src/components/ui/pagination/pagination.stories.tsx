import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Pagination } from './pagination'

const meta: Meta<typeof Pagination> = {
  title: 'UI/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  args: {
    buildPageHref: (page: number) => `/collections/all?page=${page}`,
    'aria-label': 'Collection pagination',
  },
}

export default meta

type Story = StoryObj<typeof Pagination>

export const FewPages: Story = {
  args: {
    currentPage: 1,
    totalPages: 3,
  },
}

export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
  },
}

export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
  },
}

export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
  },
}

export const WithEllipsis: Story = {
  args: {
    currentPage: 4,
    totalPages: 10,
  },
}

export const TwoPages: Story = {
  args: {
    currentPage: 1,
    totalPages: 2,
  },
}

export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
  },
  name: 'Single Page (hidden)',
}
