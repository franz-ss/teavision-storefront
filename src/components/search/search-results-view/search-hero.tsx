import { Section } from '@/components/ui'
import type {
  SearchRouteState,
  SearchaniseSearchResult,
} from '@/lib/searchanise/types'

import { formatResultCount } from './search-results-helpers'
import { SearchPageSearchForm } from './search-page-search-form'

export function SearchHero({
  result,
  state,
}: {
  result: SearchaniseSearchResult
  state: SearchRouteState
}) {
  const hasQuery = state.query.length > 0
  const eyebrow = hasQuery ? 'Search results' : 'Site search'
  const title = hasQuery ? `Results for "${state.query}"` : 'Search Teavision'
  const countLabel =
    result.status === 'success' ? formatResultCount(result) : undefined

  return (
    <Section.Root tone="sunken" spacing="compact">
      <Section.Container>
        <div className="max-w-4xl py-8 md:py-12">
          <p className="type-eyebrow text-accent">{eyebrow}</p>
          <h1 className="type-heading-01 text-strong mt-3 break-words">
            {title}
          </h1>
          <p className="type-body text-muted mt-4 max-w-2xl">
            {hasQuery ? countLabel : 'Search bulk teas, herbs, and spices.'}
          </p>
          {!hasQuery && <SearchPageSearchForm />}
        </div>
      </Section.Container>
    </Section.Root>
  )
}
