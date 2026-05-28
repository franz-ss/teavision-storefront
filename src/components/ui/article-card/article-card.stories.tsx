import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ArticleCard } from './article-card'

const stubArticle = {
  title: 'The Complete Guide to Tea Bags: Types, Quality, and Bulk Options',
  excerpt:
    'Discover everything you need to know about tea bags, from quality indicators to bulk purchasing strategies for your business.',
  featuredImage: {
    url: 'https://cdn.shopify.com/s/files/1/0786/8339/files/blog-hero.webp?v=1764582604&width=1200',
    altText: 'Loose leaf tea',
    width: 1200,
    height: 800,
  },
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
    preload: true,
  },
}

export const WithoutImage: Story = {
  args: {
    article: {
      ...stubArticle,
      featuredImage: null,
    },
    href: '/blogs/teavision-blogs/the-complete-guide-to-tea-bags-types-quality-and-bulk-options',
    publishedLabel: '5 Nov 2025',
  },
}

export const LongContent: Story = {
  args: {
    article: {
      ...stubArticle,
      title:
        'A Very Long Article Title About Tea Bags, Herbal Blends, Ingredient Sourcing, Packaging Requirements, and Wholesale Buyer Decisions',
      excerpt:
        'This long excerpt checks that the article card keeps content readable and stable when CMS authors write more than the ideal summary length for a compact grid card.',
      tags: ['Tea Bag', 'Tea Business', 'Private Label', 'Compliance'],
    },
    href: '/blogs/teavision-blogs/long-content',
    publishedLabel: '5 Nov 2025',
  },
}
