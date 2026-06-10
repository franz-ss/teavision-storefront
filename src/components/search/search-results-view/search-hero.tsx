import { Eyebrow, Section } from '@/components/ui'
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
  const title = hasQuery ? `Results for "${state.query}"` : 'Search Teavision'
  const countLabel =
    result.status === 'success' ? formatResultCount(result) : undefined

  return (
    <Section.Root tone="surface" spacing="compact">
      <Section.Container>
        <div className="max-w-4xl py-8 md:py-12">
          <Eyebrow>Search</Eyebrow>
          <h1 className="font-display text-[clamp(2rem,4vw,3.4rem)] text-ink mt-3 wrap-break-word">
            {title}
          </h1>
          <p className="type-mono-meta text-ink-faint mt-4">
            {hasQuery ? countLabel : 'Search bulk teas, herbs, and spices.'}
          </p>
          {!hasQuery && <SearchPageSearchForm />}
        </div>
      </Section.Container>
    </Section.Root>
  )
}
