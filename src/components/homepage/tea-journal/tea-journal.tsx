import Image from 'next/image'
import Link from 'next/link'

import { Button, Section } from '@/components/ui'
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
        <div className="flex items-end justify-between gap-8">
          <Section.Intro
            align="left"
            title="Tea Journal"
            copy="Stay updated with insights, guides, and stories from the world of tea and spices. From the health benefits of herbal teas to sourcing bulk herbs and spices, our Tea Journal is here to inspire and educate."
          />

          <div className="shrink-0">
            <Button size="lg" href={getBlogPath(DEFAULT_BLOG_HANDLE)}>
              View All
            </Button>
          </div>
        </div>

        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {articles.slice(0, 3).map((article, index) => (
            <li key={article.id}>
              <Link
                href={getArticlePath(DEFAULT_BLOG_HANDLE, article.handle)}
                className="border-default group focus-visible:ring-ring relative flex h-full flex-col overflow-hidden rounded-md border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <div className="bg-surface-sunken relative aspect-video">
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
                    <div className="h-full w-full" aria-hidden="true" />
                  )}
                </div>

                <div className="border-default flex h-full flex-col border-t p-5">
                  <p className="type-caption text-muted">
                    {formatArticleDate(article.publishedAt)}
                  </p>
                  <h3 className="type-heading-05 text-strong group-hover:text-brand mt-3 line-clamp-2 break-words transition-colors">
                    {article.title}
                  </h3>
                  <p className="type-body-sm text-muted mt-3 line-clamp-3 break-words">
                    {article.excerpt}
                  </p>
                  <span className="type-label text-brand mt-auto inline-flex pt-5">
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
