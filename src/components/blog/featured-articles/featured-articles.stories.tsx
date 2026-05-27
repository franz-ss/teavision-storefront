import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { sampleArticles } from '../story-data'
import { FeaturedArticles } from './featured-articles'

const meta: Meta<typeof FeaturedArticles> = {
  title: 'Blog/FeaturedArticles',
  component: FeaturedArticles,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
}
export default meta

type Story = StoryObj<typeof FeaturedArticles>

export const Default: Story = {
  args: {
    articles: sampleArticles.slice(0, 2),
    blogHandle: 'teavision-blogs',
  },
}
