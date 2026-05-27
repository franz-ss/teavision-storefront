import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { sampleArticles } from '../story-data'
import { ArticleList } from './article-list'

const meta: Meta<typeof ArticleList> = {
  title: 'Blog/ArticleList',
  component: ArticleList,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
}
export default meta

type Story = StoryObj<typeof ArticleList>

export const Default: Story = {
  args: {
    articles: sampleArticles,
    blogHandle: 'teavision-blogs',
  },
}

export const SingleArticle: Story = {
  args: {
    articles: sampleArticles.slice(0, 1),
    blogHandle: 'teavision-blogs',
  },
}
