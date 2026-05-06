import { cacheLife, cacheTag } from 'next/cache'

import { shopifyFetch } from '@/lib/shopify/client'
import {
  GetArticleDocument,
  GetBlogDocument,
  type GetArticleQuery,
  type GetBlogQuery,
  type ShopifyImage,
} from '@/lib/shopify/types'

const SHOPIFY_ARTICLE_PAGE_SIZE = 250
const WORDS_PER_MINUTE = 220

export const DEFAULT_BLOG_HANDLE = 'teavision-blogs'
export const LEGACY_BLOG_HANDLE = 'journal'
export const ARTICLES_PER_PAGE = 6

const FEATURED_ARTICLE_HANDLES = [
  'the-complete-guide-to-tea-bags-types-quality-and-bulk-options',
  'where-to-find-the-best-herbal-tea-brands',
]

type BlogNode = NonNullable<GetBlogQuery['blog']>
type BlogArticleNode = BlogNode['articles']['edges'][number]['node']
type ArticleNode = NonNullable<
  NonNullable<GetArticleQuery['blog']>['articleByHandle']
>
type CommentNode = ArticleNode['comments']['nodes'][number]

export type BlogSeo = {
  title: string | null
  description: string | null
}

export type BlogComment = {
  id: string
  authorName: string
  contentHtml: string
}

export type BlogArticleSummary = {
  id: string
  handle: string
  title: string
  excerpt: string
  featuredImage: ShopifyImage | null
  publishedAt: string
  tags: string[]
  authorName: string | null
  seo: BlogSeo
  readingTimeMinutes: number
}

export type BlogArticle = BlogArticleSummary & {
  contentHtml: string
  comments: BlogComment[]
}

export type BlogIndex = {
  id: string
  handle: string
  title: string
  seo: BlogSeo
  articles: BlogArticleSummary[]
}

export type PaginatedArticles = {
  articles: BlogArticleSummary[]
  currentPage: number
  totalPages: number
  totalArticles: number
}

function reshapeImage(image: BlogArticleNode['image']): ShopifyImage | null {
  if (!image) return null

  return {
    url: String(image.url),
    altText: image.altText ?? null,
    width: image.width ?? null,
    height: image.height ?? null,
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

function reshapeSeo(seo: BlogNode['seo'] | ArticleNode['seo']): BlogSeo {
  return {
    title: seo?.title ?? null,
    description: seo?.description ?? null,
  }
}

function reshapeArticleSummary(article: BlogArticleNode): BlogArticleSummary {
  const excerpt = article.excerpt?.trim() || article.content.trim()

  return {
    id: article.id,
    handle: article.handle,
    title: article.title,
    excerpt,
    featuredImage: reshapeImage(article.image),
    publishedAt: String(article.publishedAt),
    tags: [...article.tags],
    authorName: article.authorV2?.name ?? null,
    seo: reshapeSeo(article.seo),
    readingTimeMinutes: estimateReadingTime(article.content || excerpt),
  }
}

function reshapeComment(comment: CommentNode): BlogComment {
  return {
    id: comment.id,
    authorName: comment.author.name,
    contentHtml: String(comment.contentHtml),
  }
}

function reshapeArticle(article: ArticleNode): BlogArticle {
  const summaryText = article.excerpt?.trim() || article.content.trim()

  return {
    id: article.id,
    handle: article.handle,
    title: article.title,
    excerpt: summaryText,
    featuredImage: reshapeImage(article.image),
    publishedAt: String(article.publishedAt),
    tags: [...article.tags],
    authorName: article.authorV2?.name ?? null,
    seo: reshapeSeo(article.seo),
    readingTimeMinutes: estimateReadingTime(
      stripHtml(String(article.contentHtml)),
    ),
    contentHtml: String(article.contentHtml),
    comments: article.comments.nodes.map(reshapeComment),
  }
}

export function normalizeBlogHandle(handle: string): string {
  return handle === LEGACY_BLOG_HANDLE ? DEFAULT_BLOG_HANDLE : handle
}

export function getBlogPath(blogHandle: string): string {
  return `/blogs/${normalizeBlogHandle(blogHandle)}`
}

export function getArticlePath(
  blogHandle: string,
  articleHandle: string,
): string {
  return `${getBlogPath(blogHandle)}/${articleHandle}`
}

export function slugifyTag(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getTagPath(blogHandle: string, tag: string): string {
  return `${getBlogPath(blogHandle)}/tagged/${slugifyTag(tag)}`
}

export function findTagBySlug(tags: string[], slug?: string): string | null {
  if (!slug) return null
  return tags.find((tag) => slugifyTag(tag) === slug) ?? null
}

export function formatArticleDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function getUniqueArticleTags(articles: BlogArticleSummary[]): string[] {
  return Array.from(new Set(articles.flatMap((article) => article.tags))).sort(
    (a, b) => a.localeCompare(b, 'en-AU', { sensitivity: 'base' }),
  )
}

export function filterArticles({
  articles,
  activeTag,
  query,
}: {
  articles: BlogArticleSummary[]
  activeTag?: string | null
  query?: string | null
}): BlogArticleSummary[] {
  const term = query?.trim().toLowerCase()

  return articles.filter((article) => {
    if (activeTag && !article.tags.includes(activeTag)) return false
    if (!term) return true

    const searchable = [
      article.title,
      article.excerpt,
      article.authorName ?? '',
      article.tags.join(' '),
    ]
      .join(' ')
      .toLowerCase()

    return searchable.includes(term)
  })
}

export function paginateArticles({
  articles,
  page,
  perPage = ARTICLES_PER_PAGE,
}: {
  articles: BlogArticleSummary[]
  page: number
  perPage?: number
}): PaginatedArticles {
  const totalPages = Math.max(1, Math.ceil(articles.length / perPage))
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const start = (currentPage - 1) * perPage

  return {
    articles: articles.slice(start, start + perPage),
    currentPage,
    totalPages,
    totalArticles: articles.length,
  }
}

export function getFeaturedArticles(
  articles: BlogArticleSummary[],
): BlogArticleSummary[] {
  const featured = FEATURED_ARTICLE_HANDLES.map((handle) =>
    articles.find((article) => article.handle === handle),
  ).filter((article): article is BlogArticleSummary => Boolean(article))

  if (featured.length >= 2) return featured.slice(0, 2)

  const seen = new Set(featured.map((article) => article.id))
  return [
    ...featured,
    ...articles.filter((article) => !seen.has(article.id)),
  ].slice(0, 2)
}

export async function getBlog(handle: string): Promise<BlogIndex | null> {
  'use cache'
  const normalizedHandle = normalizeBlogHandle(handle)
  cacheTag('blog', `blog-${normalizedHandle}`)
  cacheLife('hours')

  const articles: BlogArticleSummary[] = []
  let blogDetails: Omit<BlogIndex, 'articles'> | null = null
  let after: string | null | undefined
  let hasNextPage = true

  while (hasNextPage) {
    const data = await shopifyFetch({
      query: GetBlogDocument,
      variables: {
        handle: normalizedHandle,
        first: SHOPIFY_ARTICLE_PAGE_SIZE,
        after,
      },
    })

    if (!data.blog) return null

    blogDetails ??= {
      id: data.blog.id,
      handle: data.blog.handle,
      title: data.blog.title,
      seo: reshapeSeo(data.blog.seo),
    }

    articles.push(
      ...data.blog.articles.edges.map((edge) =>
        reshapeArticleSummary(edge.node),
      ),
    )
    hasNextPage = data.blog.articles.pageInfo.hasNextPage
    after = data.blog.articles.pageInfo.endCursor
  }

  if (!blogDetails) return null

  return {
    ...blogDetails,
    articles,
  }
}

export async function getArticle(
  blogHandle: string,
  articleHandle: string,
): Promise<BlogArticle | null> {
  'use cache'
  const normalizedHandle = normalizeBlogHandle(blogHandle)
  cacheTag(
    'blog',
    `blog-${normalizedHandle}`,
    `article-${normalizedHandle}-${articleHandle}`,
  )
  cacheLife('hours')

  const data = await shopifyFetch({
    query: GetArticleDocument,
    variables: {
      blogHandle: normalizedHandle,
      articleHandle,
    },
  })

  return data.blog?.articleByHandle
    ? reshapeArticle(data.blog.articleByHandle)
    : null
}
