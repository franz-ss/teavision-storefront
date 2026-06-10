import Image from 'next/image'
import Link from 'next/link'

import { Eyebrow, Section } from '@/components/ui'
import {
  DEFAULT_BLOG_HANDLE,
  formatArticleDate,
  getArticlePath,
  getBlogPath,
  getHomepageArticles,
  type BlogArticleSummary,
} from '@/lib/blog/operations'

type TeaJournalSectionProps = {
  articles: BlogArticleSummary[]
}

export async function TeaJournal() {
  const articles = await getHomepageArticles(DEFAULT_BLOG_HANDLE)

  if (articles.length === 0) return null

  return <TeaJournalSection articles={articles} />
}

export function TeaJournalSection({ articles }: TeaJournalSectionProps) {
  return (
    <Section.Root tone="surface">
      <Section.Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-prose">
            <Eyebrow>Tea Journal</Eyebrow>
            <h2 className="type-heading-01 mt-4 text-ink">
              Insights from the world of tea
            </h2>
            <p className="type-lede mt-4 text-ink-soft">
              Stay updated with sourcing guides, blending notes, and stories
              from the world of tea and spices.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href={getBlogPath(DEFAULT_BLOG_HANDLE)}
              className="type-label inline-flex border-b border-hairline text-ink transition-colors hover:text-brand focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              View journal
            </Link>
          </div>
        </div>

        <ul className="mt-8 grid gap-5.5 md:grid-cols-3">
          {articles.slice(0, 3).map((article, index) => (
            <li key={article.id}>
              <Link
                href={getArticlePath(DEFAULT_BLOG_HANDLE, article.handle)}
                className="group focus-visible:ring-ring flex h-full flex-col rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <div className="relative mb-4.5 h-55 overflow-hidden rounded-lg bg-paper-2">
                  {article.featuredImage ? (
                    <Image
                      src={article.featuredImage.url}
                      alt={article.featuredImage.altText ?? article.title}
                      fill
                      preload={index === 0}
                      sizes="(min-width: 1024px) 31vw, (min-width: 768px) 48vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  ) : (
                    <div className="h-full w-full bg-brand-tint" aria-hidden="true" />
                  )}
                </div>

                <div className="flex h-full flex-col">
                  <p className="type-mono-meta flex gap-3 text-ink-faint">
                    <span className="text-brand">
                      {article.tags[0] ?? 'Tea Journal'}
                    </span>
                    <span aria-hidden="true">·</span>
                    {formatArticleDate(article.publishedAt)}
                  </p>
                  <h3 className="mt-2.5 line-clamp-2 font-display text-[1.25rem] leading-[1.18] text-ink wrap-break-word transition-colors group-hover:text-brand">
                    {article.title}
                  </h3>
                  <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-ink-soft wrap-break-word">
                    {article.excerpt}
                  </p>
                  <span className="type-label mt-auto inline-flex pt-5 text-brand">
                    Read More
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section.Container>
    </Section.Root>
  )
}
