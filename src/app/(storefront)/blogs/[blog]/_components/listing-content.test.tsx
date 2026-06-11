import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { ListingContent } from './listing-content'

type Article = {
  id: string
  tags: string[]
  title: string
  excerpt: string
  authorName: string | null
}

type Paginated = {
  articles: Article[]
  currentPage: number
  totalArticles: number
  totalPages: number
}

type ArticleResultsProps = {
  activeTag: string | null
  heading: string
  paginated: Paginated
  query?: string | null
  tags: string[]
}

const articleResultsProps = vi.hoisted(() => [] as ArticleResultsProps[])
const getBlogMock = vi.hoisted(() => vi.fn())
const getDefaultBlogListingMock = vi.hoisted(() => vi.fn())

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('notFound')
  },
}))

vi.mock('@/components/blog', () => ({
  ArticleResults: (props: ArticleResultsProps) => {
    articleResultsProps.push(props)
    return <div data-component="article-results" />
  },
  FeaturedArticles: () => <div data-component="featured-articles" />,
}))

vi.mock('@/components/contact', () => ({
  ContactSection: () => <div data-component="contact-section" />,
}))

vi.mock('@/lib/contact/actions', () => ({
  submitContactFormAction: vi.fn(),
}))

vi.mock('./blog-newsletter-band', () => ({
  BlogNewsletterBand: () => <div data-component="newsletter-band" />,
}))

vi.mock('@/lib/blog/operations', () => ({
  filterArticles: ({
    activeTag,
    articles,
    query,
  }: {
    activeTag?: string | null
    articles: Article[]
    query?: string | null
  }) =>
    articles.filter((article) => {
      if (activeTag && !article.tags.includes(activeTag)) return false
      if (!query) return true

      return article.title.toLowerCase().includes(query.toLowerCase())
    }),
  findTagBySlug: (tags: string[], slug?: string) =>
    tags.find((tag) => tag.toLowerCase() === slug?.toLowerCase()) ?? null,
  getBlog: getBlogMock,
  getDefaultBlogListing: getDefaultBlogListingMock,
  getUniqueArticleTags: (articles: Article[]) =>
    Array.from(new Set(articles.flatMap((article) => article.tags))).sort(),
  normalizeBlogHandle: (handle: string) => handle,
  paginateArticles: ({
    articles,
    page,
  }: {
    articles: Article[]
    page: number
  }): Paginated => ({
    articles,
    currentPage: page,
    totalArticles: articles.length,
    totalPages: 1,
  }),
}))

const featuredArticle: Article = {
  authorName: 'Tea Editor',
  excerpt: 'Featured article excerpt',
  id: 'featured',
  tags: ['Featured'],
  title: 'Featured tea guide',
}

const standardArticle: Article = {
  authorName: 'Tea Editor',
  excerpt: 'Standard article excerpt',
  id: 'standard',
  tags: ['Featured'],
  title: 'Standard tea guide',
}

describe('ListingContent', () => {
  it('keeps featured articles in filtered tag results', async () => {
    articleResultsProps.length = 0
    getDefaultBlogListingMock.mockReset()
    getBlogMock.mockResolvedValue({
      articles: [featuredArticle, standardArticle],
      featuredArticles: [featuredArticle],
    })

    const element = await ListingContent({
      params: Promise.resolve({
        blog: 'teavision-blogs',
        tag: 'Featured',
      }),
      searchParams: Promise.resolve({}),
    })
    renderToStaticMarkup(element)

    expect(getDefaultBlogListingMock).not.toHaveBeenCalled()
    expect(
      articleResultsProps[0]?.paginated.articles.map((article) => article.id),
    ).toEqual(['featured', 'standard'])
    expect(articleResultsProps[0]).toMatchObject({
      activeTag: 'Featured',
      heading: 'Featured Articles',
    })
  })
})
