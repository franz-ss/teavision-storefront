import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ArticleCard } from './article-card'

const stubArticle = {
  title: 'The Complete Guide to Tea Bags: Types, Quality, and Bulk Options',
  excerpt:
    'Discover everything you need to know about tea bags, from quality indicators to bulk purchasing strategies for your business.',
  featuredImage: null,
  publishedAt: '2025-11-05T00:00:00Z',
  tags: ['Tea Bag', 'Tea Business'],
  authorName: 'Teavision Team',
  seo: {
    title: 'The Complete Guide to Tea Bags',
    description:
      'Discover everything you need to know about tea bags, quality, and bulk purchasing.',
  },
  readingTimeMinutes: 5,
}

const meta: Meta<typeof ArticleCard> = {
  title: 'UI/ArticleCard',
  component: ArticleCard,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
}
export default meta

type Story = StoryObj<typeof ArticleCard>

export const Default: Story = {
  args: {
    article: stubArticle,
    href: '/blogs/teavision-blogs/the-complete-guide-to-tea-bags-types-quality-and-bulk-options',
    publishedLabel: '5 Nov 2025',
  },
}

export const Featured: Story = {
  args: {
    article: stubArticle,
    href: '/blogs/teavision-blogs/the-complete-guide-to-tea-bags-types-quality-and-bulk-options',
    publishedLabel: '5 Nov 2025',
    variant: 'featured',
  },
}
