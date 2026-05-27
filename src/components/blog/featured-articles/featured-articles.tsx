import { ArticleCard, Section } from '@/components/ui'
import type { BlogArticleSummary } from '@/lib/blog/operations'
import { formatArticleDate, getArticlePath } from '@/lib/blog/operations'

type FeaturedArticlesProps = {
  articles: BlogArticleSummary[]
  blogHandle: string
}

export function FeaturedArticles({
  articles,
  blogHandle,
}: FeaturedArticlesProps) {
  return (
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
          {articles.map((article, index) => (
            <li key={article.id}>
              <ArticleCard
                article={article}
                href={getArticlePath(blogHandle, article.handle)}
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
  )
}
