import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { sampleArticles } from '../story-data'
import { ArticleResults } from './article-results'

const meta: Meta<typeof ArticleResults> = {
  title: 'Blog/ArticleResults',
  component: ArticleResults,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
}
export default meta

type Story = StoryObj<typeof ArticleResults>

export const LatestArticles: Story = {
  args: {
    activeTag: null,
    blogHandle: 'teavision-blogs',
    heading: 'Latest Articles',
    paginated: {
      articles: sampleArticles,
      currentPage: 1,
      totalPages: 2,
      totalArticles: sampleArticles.length,
    },
    tags: ['Herbal Tea', 'Japanese Tea', 'Tea Bag', 'Wholesale Tea'],
  },
}

export const SearchResults: Story = {
  args: {
    activeTag: 'Japanese Tea',
    blogHandle: 'teavision-blogs',
    heading: 'Japanese Tea Articles',
    paginated: {
      articles: sampleArticles.slice(1, 2),
      currentPage: 1,
      totalPages: 1,
      totalArticles: 1,
    },
    query: 'matcha',
    tags: ['Herbal Tea', 'Japanese Tea', 'Tea Bag', 'Wholesale Tea'],
  },
}

export const Empty: Story = {
  args: {
    activeTag: null,
    blogHandle: 'teavision-blogs',
    heading: 'Search Results',
    paginated: {
      articles: [],
      currentPage: 1,
      totalPages: 1,
      totalArticles: 0,
    },
    query: 'oolong matcha wholesale',
    tags: ['Herbal Tea', 'Japanese Tea', 'Tea Bag', 'Wholesale Tea'],
  },
}
