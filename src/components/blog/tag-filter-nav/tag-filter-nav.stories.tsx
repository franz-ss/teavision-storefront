import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { TagFilterNav } from './tag-filter-nav'

const meta: Meta<typeof TagFilterNav> = {
  title: 'Blog/TagFilterNav',
  component: TagFilterNav,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
}
export default meta

type Story = StoryObj<typeof TagFilterNav>

export const AllArticles: Story = {
  args: {
    activeTag: null,
    blogHandle: 'teavision-blogs',
    tags: ['Herbal Tea', 'Japanese Tea', 'Tea Bag', 'Wholesale Tea'],
  },
}

export const ActiveTag: Story = {
  args: {
    activeTag: 'Japanese Tea',
    blogHandle: 'teavision-blogs',
    tags: ['Herbal Tea', 'Japanese Tea', 'Tea Bag', 'Wholesale Tea'],
  },
}
