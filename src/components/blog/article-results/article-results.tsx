import { Section } from '@/components/ui'
import type { PaginatedArticles } from '@/lib/blog/operations'

import { ArticleList } from '../article-list'
import { EmptyState } from '../empty-state'
import { Pagination } from '../pagination'
import { TagFilterNav } from '../tag-filter-nav'

type ArticleResultsProps = {
  activeTag: string | null
  blogHandle: string
  heading: string
  paginated: PaginatedArticles
  query?: string | null
  tags: string[]
}

export function ArticleResults({
  activeTag,
  blogHandle,
  heading,
  paginated,
  query,
  tags,
}: ArticleResultsProps) {
  const normalizedQuery = query?.trim() ?? ''

  return (
    <Section.Root tone="surface">
      <Section.Container>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="type-eyebrow text-muted">Tea Journal</p>
            <h2 className="type-heading-02 text-strong mt-2">{heading}</h2>
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

        <TagFilterNav
          activeTag={activeTag}
          blogHandle={blogHandle}
          tags={tags}
        />

        {paginated.totalArticles === 0 ? (
          <EmptyState />
        ) : (
          <ArticleList articles={paginated.articles} blogHandle={blogHandle} />
        )}

        <Pagination
          activeTag={activeTag}
          blogHandle={blogHandle}
          currentPage={paginated.currentPage}
          query={query}
          totalPages={paginated.totalPages}
        />
      </Section.Container>
    </Section.Root>
  )
}
