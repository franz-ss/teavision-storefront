import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Hero } from './hero'

const meta: Meta<typeof Hero> = {
  title: 'Blog/Hero',
  component: Hero,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
}
export default meta

type Story = StoryObj<typeof Hero>

export const Default: Story = {
  args: {
    rssHref: '/blogs/teavision-blogs/atom',
    searchAction: '/blogs/teavision-blogs',
  },
}

export const WithSearchQuery: Story = {
  args: {
    defaultQuery: 'matcha',
    rssHref: '/blogs/teavision-blogs/atom',
    searchAction: '/blogs/teavision-blogs/tagged/japanese-tea',
  },
}

export const WithoutRss: Story = {
  args: {
    searchAction: '/blogs/teavision-blogs',
  },
}
