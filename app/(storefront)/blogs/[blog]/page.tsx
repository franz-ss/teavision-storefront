import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { STUB_ARTICLES, BLOG_TAGS, formatArticleDate } from '@/lib/blog/stubs'

const ARTICLES_PER_PAGE = 6

type Props = {
  params: Promise<{ blog: string }>
  searchParams: Promise<{ tag?: string; page?: string }>
}

export const metadata: Metadata = {
  title: 'Tea Journal',
  description:
    'Industry insights, tea sourcing guides, and wholesale tips for cafes, restaurants, and retailers from the Teavision team.',
  openGraph: {
    title: 'Tea Journal | Teavision',
    description:
      'Industry insights, tea sourcing guides, and wholesale tips for cafes, restaurants, and retailers.',
    url: '/blogs/journal',
  },
  alternates: { canonical: '/blogs/journal' },
}

async function BlogContent({
  params,
  searchParams,
}: {
  params: Promise<{ blog: string }>
  searchParams: Promise<{ tag?: string; page?: string }>
}) {
  const [{ blog }, { tag, page: pageParam }] = await Promise.all([
    params,
    searchParams,
  ])

  const activeTag = tag && BLOG_TAGS.includes(tag) ? tag : null
  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const filtered = activeTag
    ? STUB_ARTICLES.filter((a) => a.tags.includes(activeTag))
    : STUB_ARTICLES

  const totalPages = Math.max(1, Math.ceil(filtered.length / ARTICLES_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const articles = filtered.slice(
    (safePage - 1) * ARTICLES_PER_PAGE,
    safePage * ARTICLES_PER_PAGE,
  )

  function tagHref(t: string | null) {
    const params = new URLSearchParams()
    if (t) params.set('tag', t)
    const qs = params.toString()
    return `/blogs/${blog}${qs ? `?${qs}` : ''}`
  }

  function pageHref(p: number) {
    const params = new URLSearchParams()
    if (activeTag) params.set('tag', activeTag)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return `/blogs/${blog}${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Tag filters */}
      <nav aria-label="Filter by tag" className="mb-10 flex flex-wrap gap-2">
        <Link
          href={tagHref(null)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            !activeTag
              ? 'bg-primary text-background'
              : 'border-border bg-surface hover:border-primary border'
          }`}
        >
          All
        </Link>
        {BLOG_TAGS.map((t) => (
          <Link
            key={t}
            href={tagHref(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeTag === t
                ? 'bg-primary text-background'
                : 'border-border bg-surface hover:border-primary border'
            }`}
          >
            {t}
          </Link>
        ))}
      </nav>

      {articles.length === 0 ? (
        <p className="text-text-muted py-16 text-center">
          No articles found for this tag.
        </p>
      ) : (
        <ul
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
        >
          {articles.map((article) => (
            <li key={article.id}>
              <Link
                href={`/blogs/${blog}/${article.handle}`}
                className="group block focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <div
                  className="bg-border mb-4 aspect-video rounded"
                  aria-hidden="true"
                />

                <div className="text-text-muted mb-2 flex items-center gap-3 text-xs">
                  <span>{formatArticleDate(article.publishedAt)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{article.readingTimeMinutes} min read</span>
                </div>

                {article.tags.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-primary-hover text-xs font-semibold tracking-wide uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <h2 className="text-base leading-snug font-semibold group-hover:underline">
                  {article.title}
                </h2>

                <p className="text-text-muted mt-2 line-clamp-2 text-sm leading-relaxed">
                  {article.excerpt}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <nav
          aria-label="Blog pagination"
          className="border-border mt-16 flex justify-center gap-1 border-t pt-8"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={pageHref(p)}
              aria-current={p === safePage ? 'page' : undefined}
              className={`flex h-9 w-9 items-center justify-center rounded text-sm ${
                p === safePage
                  ? 'bg-primary text-background font-medium'
                  : 'border-border text-text-muted border hover:border-primary'
              }`}
            >
              {p}
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}

export default function BlogPage({ params, searchParams }: Props) {
  return (
    <div>
      <section className="bg-surface px-4 py-16 text-center">
        <h1 className="text-4xl font-bold">Tea Journal</h1>
        <p className="text-text-muted mx-auto mt-3 max-w-xl text-lg">
          Discover the Finest Teas for Your Business
        </p>
      </section>

      <Suspense
        fallback={
          <div className="px-4 py-12" aria-live="polite">
            Loading articles…
          </div>
        }
      >
        <BlogContent params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
