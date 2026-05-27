import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import {
  ArticleCard,
  Button,
  Card,
  NewsletterSignup,
  Section,
} from '@/components/ui'
import {
  filterArticles,
  findTagBySlug,
  formatArticleDate,
  getArticlePath,
  getBlog,
  getBlogPath,
  getFeaturedArticles,
  getTagPath,
  getUniqueArticleTags,
  normalizeBlogHandle,
  paginateArticles,
} from '@/lib/blog/operations'
import { sendNewsletterSignupAction } from '@/lib/contact/actions'
import { cn } from '@/lib/utils'

type SearchParams = {
  page?: string
  q?: string
}

type BlogListingProps = {
  params: Promise<{ blog: string; tag?: string }>
  searchParams: Promise<SearchParams>
}

type PaginationItem = number | 'ellipsis-left' | 'ellipsis-right'

const HERO_TITLE = 'Discover the Finest Teas for Your Business'
const HERO_DESCRIPTION =
  'Expert insights on bulk tea purchasing, supplier guides, and cost-effective solutions for Australian businesses.'

function parsePage(page?: string): number {
  return Math.max(1, parseInt(page ?? '1', 10) || 1)
}

function getPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages = new Set([1, totalPages, currentPage])
  if (currentPage > 2) pages.add(currentPage - 1)
  if (currentPage < totalPages - 1) pages.add(currentPage + 1)

  const sorted = Array.from(pages).sort((a, b) => a - b)
  const items: PaginationItem[] = []

  for (const page of sorted) {
    const previous = items[items.length - 1]
    if (typeof previous === 'number' && page - previous > 1) {
      items.push(previous === 1 ? 'ellipsis-left' : 'ellipsis-right')
    }
    items.push(page)
  }

  return items
}

function listingHref({
  blogHandle,
  activeTag,
  query,
  page,
}: {
  blogHandle: string
  activeTag: string | null
  query?: string | null
  page?: number
}) {
  const params = new URLSearchParams()
  const normalizedQuery = query?.trim()

  if (normalizedQuery) params.set('q', normalizedQuery)
  if (page && page > 1) params.set('page', String(page))

  const path = activeTag
    ? getTagPath(blogHandle, activeTag)
    : getBlogPath(blogHandle)
  const qs = params.toString()
  return `${path}${qs ? `?${qs}` : ''}`
}

export async function generateBlogListingMetadata({
  params,
  searchParams,
}: BlogListingProps): Promise<Metadata> {
  const [{ blog, tag }, { page, q }] = await Promise.all([params, searchParams])
  const normalizedBlog = normalizeBlogHandle(blog)
  const blogData = await getBlog(normalizedBlog)
  if (!blogData) return { title: 'Tea Journal' }

  const tags = getUniqueArticleTags(blogData.articles)
  const activeTag = findTagBySlug(tags, tag)
  const currentPage = parsePage(page)
  const titleParts = [
    activeTag ? `${blogData.title}: ${activeTag}` : blogData.seo.title,
    currentPage > 1 ? `Page ${currentPage}` : null,
  ].filter((part): part is string => Boolean(part))
  const title = titleParts.join(' | ') || blogData.title
  const description = blogData.seo.description ?? HERO_DESCRIPTION
  const canonical = listingHref({
    blogHandle: normalizedBlog,
    activeTag,
    query: null,
    page: currentPage,
  })

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
    },
    alternates: { canonical },
    robots: q?.trim() ? { index: false, follow: true } : undefined,
  }
}

async function BlogListingContent({ params, searchParams }: BlogListingProps) {
  const [{ blog, tag }, { page, q }] = await Promise.all([params, searchParams])
  const normalizedBlog = normalizeBlogHandle(blog)
  const blogData = await getBlog(normalizedBlog)
  if (!blogData) notFound()

  const tags = getUniqueArticleTags(blogData.articles)
  const activeTag = findTagBySlug(tags, tag)
  if (tag && !activeTag) notFound()

  const featuredArticles = getFeaturedArticles(blogData.articles)
  const featuredIds = new Set(featuredArticles.map((article) => article.id))
  const filteredArticles = filterArticles({
    articles: blogData.articles,
    activeTag,
    query: q,
  })
  const normalizedQuery = q?.trim() ?? ''
  const isFiltered = Boolean(activeTag || normalizedQuery)
  const shouldShowFeatured = !isFiltered && featuredArticles.length > 0
  const mainArticles = isFiltered
    ? filteredArticles
    : filteredArticles.filter((article) => !featuredIds.has(article.id))
  const paginated = paginateArticles({
    articles: mainArticles,
    page: parsePage(page),
  })
  const articleGridHeading = activeTag
    ? `${activeTag} Articles`
    : normalizedQuery
      ? 'Search Results'
      : 'Latest Articles'

  return (
    <>
      <Section.Root tone="surface">
        <Section.Container variant="compact">
          <form
            action={
              activeTag
                ? getTagPath(normalizedBlog, activeTag)
                : getBlogPath(normalizedBlog)
            }
            className="flex flex-col gap-3 sm:flex-row"
            role="search"
          >
            <label className="sr-only" htmlFor="blog-search">
              Search tea topics
            </label>
            <input
              id="blog-search"
              name="q"
              type="search"
              defaultValue={q ?? ''}
              placeholder="Search tea topics..."
              className="type-body border-default bg-surface text-default placeholder:text-muted focus:border-brand focus:ring-ring min-h-11 flex-1 rounded-md border px-4 transition-colors focus:ring-2 focus:outline-none"
            />
            <Button type="submit">Search</Button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href={`${getBlogPath(normalizedBlog)}/atom`}
              className="type-label text-link hover:text-link-hover focus-visible:ring-ring inline-flex min-h-11 items-center hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              RSS
            </a>
          </div>
        </Section.Container>
      </Section.Root>

      {shouldShowFeatured && (
        <Section.Root tone="surface">
          <Section.Container>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="type-eyebrow text-muted">Tea Journal</p>
                <h2 className="type-heading-02 text-strong mt-2">
                  Featured Articles
                </h2>
              </div>
            </div>
            <ul className="grid gap-6 md:grid-cols-2" role="list">
              {featuredArticles.map((article, index) => (
                <li key={article.id}>
                  <ArticleCard
                    article={article}
                    href={getArticlePath(normalizedBlog, article.handle)}
                    publishedLabel={formatArticleDate(article.publishedAt)}
                    variant="featured"
                    headingLevel="h3"
                    priority={index === 0}
                  />
                </li>
              ))}
            </ul>
          </Section.Container>
        </Section.Root>
      )}

      <Section.Root tone="surface">
        <Section.Container>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="type-eyebrow text-muted">Tea Journal</p>
              <h2 className="type-heading-02 text-strong mt-2">
                {articleGridHeading}
              </h2>
              {normalizedQuery && (
                <p className="type-body-sm text-muted mt-3">
                  Showing matches for{' '}
                  <span className="type-label text-default">
                    {normalizedQuery}
                  </span>
                </p>
              )}
            </div>
            <p className="type-body-sm text-muted">
              {paginated.totalArticles}{' '}
              {paginated.totalArticles === 1 ? 'article' : 'articles'}
            </p>
          </div>

          <nav aria-label="Filter by tag" className="mb-8 flex flex-wrap gap-2">
            <Link
              href={getBlogPath(normalizedBlog)}
              aria-current={!activeTag ? 'page' : undefined}
              className={cn(
                'type-label focus-visible:ring-ring inline-flex min-h-11 items-center rounded-full px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                !activeTag
                  ? 'bg-action-primary text-action-primary-text'
                  : 'border-default bg-surface text-default hover:border-brand border',
              )}
            >
              All
            </Link>
            {tags.map((tag) => (
              <Link
                key={tag}
                href={getTagPath(normalizedBlog, tag)}
                aria-current={activeTag === tag ? 'page' : undefined}
                className={cn(
                  'type-label focus-visible:ring-ring inline-flex min-h-11 items-center rounded-full px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                  activeTag === tag
                    ? 'bg-action-primary text-action-primary-text'
                    : 'border-default bg-surface text-default hover:border-brand border',
                )}
              >
                {tag}
              </Link>
            ))}
          </nav>

          {paginated.totalArticles === 0 ? (
            <Card className="px-6 py-12 text-center">
              <h2 className="type-heading-03 text-strong">No articles found</h2>
              <p className="type-body-sm text-muted mx-auto mt-3 max-w-lg">
                Try a different search term or browse all Tea Journal articles.
              </p>
            </Card>
          ) : (
            <ul
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              role="list"
            >
              {paginated.articles.map((article) => (
                <li key={article.id}>
                  <ArticleCard
                    article={article}
                    href={getArticlePath(normalizedBlog, article.handle)}
                    publishedLabel={formatArticleDate(article.publishedAt)}
                    headingLevel="h3"
                  />
                </li>
              ))}
            </ul>
          )}

          {paginated.totalPages > 1 && (
            <nav
              aria-label="Blog pagination"
              className="border-default mt-12 flex items-center justify-center gap-1 border-t pt-8"
            >
              {getPaginationItems(
                paginated.currentPage,
                paginated.totalPages,
              ).map((item) =>
                typeof item === 'number' ? (
                  <Link
                    key={item}
                    href={listingHref({
                      blogHandle: normalizedBlog,
                      activeTag,
                      query: q,
                      page: item,
                    })}
                    aria-current={
                      item === paginated.currentPage ? 'page' : undefined
                    }
                    className={cn(
                      'type-label focus-visible:ring-ring flex h-11 w-11 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                      item === paginated.currentPage
                        ? 'bg-action-primary text-action-primary-text'
                        : 'border-default bg-surface text-default hover:border-brand border',
                    )}
                  >
                    {item}
                  </Link>
                ) : (
                  <span
                    key={item}
                    className="type-label text-muted flex h-11 w-11 items-center justify-center"
                    aria-hidden="true"
                  >
                    ...
                  </span>
                ),
              )}
            </nav>
          )}
        </Section.Container>
      </Section.Root>

      <Section.Root tone="sunken">
        <Section.Container variant="compact">
          <NewsletterSignup action={sendNewsletterSignupAction} />
        </Section.Container>
      </Section.Root>
    </>
  )
}

export function BlogListingPage({ params, searchParams }: BlogListingProps) {
  return (
    <>
      <Section.Root tone="surface">
        <Section.Container variant="compact" className="text-center">
          <p className="type-eyebrow text-muted">Tea Journal</p>
          <h1 className="type-heading-01 text-strong mt-3">{HERO_TITLE}</h1>
          <p className="type-body-lg text-muted mt-4">{HERO_DESCRIPTION}</p>
        </Section.Container>
      </Section.Root>

      <Suspense
        fallback={
          <Section.Root tone="surface">
            <Section.Container
              variant="compact"
              className="type-body text-muted"
              aria-live="polite"
            >
              Loading articles...
            </Section.Container>
          </Section.Root>
        }
      >
        <BlogListingContent params={params} searchParams={searchParams} />
      </Suspense>
    </>
  )
}
