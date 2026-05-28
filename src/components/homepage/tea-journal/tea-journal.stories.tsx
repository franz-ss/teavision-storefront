import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { TeaJournalSection } from './tea-journal'

const meta: Meta<typeof TeaJournalSection> = {
  title: 'Homepage/TeaJournal',
  component: TeaJournalSection,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof TeaJournalSection>

const articles = [
  {
    id: 'story-green-tea',
    handle: 'green-tea-sourcing-guide',
    title: 'Green Tea Sourcing Guide',
    excerpt:
      'A practical look at origin, grade, and freshness when buying green tea at wholesale scale.',
    featuredImage: {
      url: 'https://cdn.shopify.com/s/files/1/0786/8339/files/blog-hero.webp?v=1764582604&width=1200',
      altText: 'Loose leaf green tea',
      width: 1200,
      height: 800,
    },
    publishedAt: '2026-05-01T00:00:00.000Z',
    tags: ['Green Tea'],
    authorName: 'Teavision Team',
    seo: {
      title: null,
      description: null,
      canonicalPath: null,
      noIndex: false,
      ogImage: null,
    },
    readingTimeMinutes: 4,
  },
  {
    id: 'story-herbal',
    handle: 'herbal-tea-blending',
    title: 'Herbal Tea Blending Notes',
    excerpt:
      'How to balance botanical flavour, colour, and compliance in a commercial infusion.',
    featuredImage: null,
    publishedAt: '2026-04-18T00:00:00.000Z',
    tags: ['Herbal Tea'],
    authorName: 'Teavision Team',
    seo: {
      title: null,
      description: null,
      canonicalPath: null,
      noIndex: false,
      ogImage: null,
    },
    readingTimeMinutes: 5,
  },
  {
    id: 'story-packaging',
    handle: 'private-label-tea-packaging',
    title: 'Private Label Tea Packaging',
    excerpt:
      'Key packaging decisions for wholesale tea brands moving from concept to shelf-ready stock.',
    featuredImage: null,
    publishedAt: '2026-03-22T00:00:00.000Z',
    tags: ['Private Label'],
    authorName: 'Teavision Team',
    seo: {
      title: null,
      description: null,
      canonicalPath: null,
      noIndex: false,
      ogImage: null,
    },
    readingTimeMinutes: 3,
  },
]

export const Default: Story = {
  args: {
    articles,
  },
}

export const SingleArticle: Story = {
  args: {
    articles: articles.slice(0, 1),
  },
}

export const MoreThanThreeArticles: Story = {
  args: {
    articles: [
      ...articles,
      {
        ...articles[0],
        id: 'story-extra',
        handle: 'extra-article-hidden-by-homepage-slice',
        title: 'Extra Article Hidden by Homepage Slice',
      },
    ],
  },
}

export const LongContent: Story = {
  args: {
    articles: [
      {
        ...articles[0],
        title:
          'A Very Long Sanity Authored Tea Journal Headline About Sourcing, Compliance, Packing Formats, and Wholesale Buying Signals',
        excerpt:
          'This intentionally long excerpt checks that dynamic CMS copy keeps the card height controlled, wraps safely, and remains scannable across the homepage grid without pushing surrounding content around.',
      },
      ...articles.slice(1),
    ],
  },
}

export const AllImagesMissing: Story = {
  args: {
    articles: articles.map((article) => ({
      ...article,
      featuredImage: null,
    })),
  },
}
