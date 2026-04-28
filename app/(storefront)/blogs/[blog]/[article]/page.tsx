import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getArticleByHandle, formatArticleDate } from '@/lib/blog/stubs'

type Props = {
  params: Promise<{ blog: string; article: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { article: handle } = await params
  const article = getArticleByHandle(handle)
  if (!article) return { title: 'Article not found' }
  return { title: article.title }
}

async function ArticleContent({
  params,
}: {
  params: Promise<{ blog: string; article: string }>
}) {
  const { blog, article: handle } = await params
  const article = getArticleByHandle(handle)
  if (!article) notFound()

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-text-muted mb-8 text-sm">
        <ol className="flex items-center gap-2" role="list">
          <li>
            <Link
              href={`/blogs/${blog}`}
              className="hover:underline focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Tea Journal
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="truncate" aria-current="page">
            {article.title}
          </li>
        </ol>
      </nav>

      {/* Featured image placeholder */}
      <div
        className="bg-border mb-8 aspect-video rounded"
        role="img"
        aria-label={`Featured image for ${article.title}`}
      />

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="bg-surface border-border rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl leading-tight font-bold md:text-4xl">
        {article.title}
      </h1>

      {/* Meta */}
      <div className="text-text-muted mt-4 flex items-center gap-3 text-sm">
        <time dateTime={article.publishedAt}>
          {formatArticleDate(article.publishedAt)}
        </time>
        <span aria-hidden="true">·</span>
        <span>{article.readingTimeMinutes} min read</span>
      </div>

      {/* Excerpt lead */}
      <p className="text-text-muted border-primary mt-6 border-l-2 pl-4 text-lg leading-relaxed">
        {article.excerpt}
      </p>

      {/* Article body */}
      <article className="mt-8 space-y-8">
        {article.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="mb-3 text-xl font-semibold">{section.heading}</h2>
            <p className="text-text-muted leading-relaxed">{section.body}</p>
          </section>
        ))}
      </article>

      {/* Back link */}
      <div className="border-border mt-12 border-t pt-8">
        <Link
          href={`/blogs/${blog}`}
          className="text-primary hover:underline focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          ← Back to Tea Journal
        </Link>
      </div>
    </div>
  )
}

export default function ArticlePage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-12" aria-live="polite">
          Loading article…
        </div>
      }
    >
      <ArticleContent params={params} />
    </Suspense>
  )
}
