import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { RichText } from '@/components/ui/rich-text'
import { Card, Section } from '@/components/ui'
import {
  formatArticleDate,
  getArticle,
  getArticlePath,
  getBlog,
  getBlogPath,
  getTagPath,
  normalizeBlogHandle,
} from '@/lib/blog/operations'
import { sanitizeShopifyArticleHtml } from '@/lib/shopify/html-content'

type Props = {
  params: Promise<{ blog: string; article: string }>
}

function articleDescription(article: Awaited<ReturnType<typeof getArticle>>) {
  return article?.seo.description ?? article?.excerpt.slice(0, 160) ?? ''
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { blog, article: handle } = await params
  const normalizedBlog = normalizeBlogHandle(blog)
  const article = await getArticle(normalizedBlog, handle)
  if (!article) return { title: 'Article not found' }

  const description = articleDescription(article)
  const title = article.seo.title ?? article.title
  const canonical = getArticlePath(normalizedBlog, handle)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      publishedTime: article.publishedAt,
      images: article.featuredImage
        ? [
            {
              url: article.featuredImage.url,
              alt: article.featuredImage.altText ?? article.title,
            },
          ]
        : undefined,
    },
    alternates: { canonical },
  }
}

async function ArticleContent({ params }: Props) {
  const { blog, article: handle } = await params
  const normalizedBlog = normalizeBlogHandle(blog)
  const [article, blogData] = await Promise.all([
    getArticle(normalizedBlog, handle),
    getBlog(normalizedBlog),
  ])

  if (!article || !blogData) notFound()

  const articleIndex = blogData.articles.findIndex(
    (item) => item.handle === article.handle,
  )
  const newerArticle =
    articleIndex > 0 ? blogData.articles[articleIndex - 1] : null
  const olderArticle =
    articleIndex >= 0 && articleIndex < blogData.articles.length - 1
      ? blogData.articles[articleIndex + 1]
      : null
  const description = articleDescription(article)
  const contentHtml = sanitizeShopifyArticleHtml(article.contentHtml)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.authorName ?? 'Teavision Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Teavision',
    },
    image: article.featuredImage ? [article.featuredImage.url] : undefined,
    mainEntityOfPage: getArticlePath(normalizedBlog, article.handle),
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-prose px-4 py-12">
        <nav aria-label="Breadcrumb" className="type-body-sm text-muted mb-8">
          <ol className="flex items-center gap-2" role="list">
            <li>
              <Link
                href={getBlogPath(normalizedBlog)}
                className="text-link hover:text-link-hover focus-visible:ring-ring hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Tea Journal
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-default truncate" aria-current="page">
              {article.title}
            </li>
          </ol>
        </nav>

        {article.tags.length > 0 && (
          <div className="mx-auto mb-5 flex max-w-prose flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={getTagPath(normalizedBlog, tag)}
                className="type-eyebrow border-default bg-surface hover:border-brand focus-visible:ring-ring inline-flex min-h-11 items-center rounded-full border px-3 py-1 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        <h1 className="type-heading-01 text-strong mx-auto max-w-prose">
          {article.title}
        </h1>

        <div className="type-body-sm text-muted mx-auto mt-5 flex max-w-prose flex-wrap items-center gap-3">
          <time dateTime={article.publishedAt}>
            {formatArticleDate(article.publishedAt)}
          </time>
          <span aria-hidden="true">·</span>
          <span>{article.readingTimeMinutes} min read</span>
          {article.authorName && (
            <>
              <span aria-hidden="true">·</span>
              <span>{article.authorName}</span>
            </>
          )}
        </div>

        {article.featuredImage &&
          article.featuredImage.width &&
          article.featuredImage.height && (
            <div className="bg-surface-sunken mt-8 overflow-hidden rounded-lg">
              <Image
                src={article.featuredImage.url}
                alt={article.featuredImage.altText ?? article.title}
                width={article.featuredImage.width}
                height={article.featuredImage.height}
                priority
                sizes="(min-width: 1024px) 896px, 100vw"
                className="h-auto w-full object-cover"
              />
            </div>
          )}

        {article.excerpt && (
          <Card className="mx-auto mt-8 max-w-prose" padding="md">
            <p className="type-body-lg text-muted italic">{article.excerpt}</p>
          </Card>
        )}

        <RichText
          html={contentHtml}
          variant="article"
          className="mx-auto mt-10 max-w-prose"
        />

        {(newerArticle || olderArticle) && (
          <nav
            aria-label="Adjacent articles"
            className="border-default mx-auto mt-12 grid max-w-prose gap-4 border-t pt-8 sm:grid-cols-2"
          >
            {olderArticle ? (
              <Card interactive>
                <Link
                  href={getArticlePath(normalizedBlog, olderArticle.handle)}
                  className="focus-visible:ring-ring block h-full p-4 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <span className="type-eyebrow text-muted">Previous Post</span>
                  <span className="type-heading-03 text-strong mt-2 block">
                    {olderArticle.title}
                  </span>
                </Link>
              </Card>
            ) : (
              <span />
            )}

            {newerArticle && (
              <Card interactive className="sm:text-right">
                <Link
                  href={getArticlePath(normalizedBlog, newerArticle.handle)}
                  className="focus-visible:ring-ring block h-full p-4 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <span className="type-eyebrow text-muted">Next Post</span>
                  <span className="type-heading-03 text-strong mt-2 block">
                    {newerArticle.title}
                  </span>
                </Link>
              </Card>
            )}
          </nav>
        )}

        {article.comments.length > 0 && (
          <Section.Root
            tone="transparent"
            spacing="none"
            className="border-default mt-12 border-t pt-8"
          >
            <h2 className="type-heading-03 text-strong">
              Comments {article.comments.length}
            </h2>
            <ul className="mt-5 space-y-4" role="list">
              {article.comments.map((comment) => (
                <Card as="li" key={comment.id} padding="sm">
                  <p className="type-label text-strong">{comment.authorName}</p>
                  <RichText
                    html={sanitizeShopifyArticleHtml(comment.contentHtml)}
                    variant="compact"
                    className="mt-3"
                  />
                </Card>
              ))}
            </ul>
          </Section.Root>
        )}

        <div className="border-default mx-auto mt-12 max-w-prose border-t pt-8">
          <Link
            href={getBlogPath(normalizedBlog)}
            className="type-label text-link hover:text-link-hover focus-visible:ring-ring inline-flex min-h-11 items-center hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Back to Tea Journal
          </Link>
        </div>
      </article>
    </div>
  )
}

export default function ArticlePage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div
          className="type-body text-muted mx-auto max-w-4xl px-4 py-12"
          aria-live="polite"
        >
          Loading article...
        </div>
      }
    >
      <ArticleContent params={params} />
    </Suspense>
  )
}
