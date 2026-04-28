import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { STUB_ARTICLES, BLOG_TAGS, formatArticleDate } from '@/lib/blog/stubs'

type Props = {
  params: Promise<{ blog: string }>
}

export const metadata: Metadata = {
  title: 'Tea Journal',
}

async function BlogContent({ params }: { params: Promise<{ blog: string }> }) {
  const { blog } = await params

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Tag filters */}
      <div className="mb-10 flex flex-wrap gap-2">
        <span className="bg-primary text-background rounded-full px-4 py-1.5 text-sm font-medium">
          All
        </span>
        {BLOG_TAGS.map((tag) => (
          <span
            key={tag}
            className="border-border hover:border-primary bg-surface cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Articles grid */}
      <ul
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        role="list"
      >
        {STUB_ARTICLES.map((article) => (
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

      {/* Pagination stub */}
      <nav
        aria-label="Blog pagination"
        className="border-border mt-16 flex justify-center gap-1 border-t pt-8"
      >
        {([1, 2, 3, '…', 14] as const).map((page, i) => (
          <span
            key={i}
            className={`flex h-9 w-9 items-center justify-center rounded text-sm ${
              page === 1
                ? 'bg-primary text-background font-medium'
                : 'border-border text-text-muted border'
            }`}
          >
            {page}
          </span>
        ))}
      </nav>
    </div>
  )
}

export default function BlogPage({ params }: Props) {
  return (
    <div>
      {/* Header */}
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
        <BlogContent params={params} />
      </Suspense>
    </div>
  )
}
