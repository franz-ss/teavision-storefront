import { Suspense } from 'react'
import type { Metadata } from 'next'

import { SearchResultsView } from '@/components/search'
import { Eyebrow, Section } from '@/components/ui'
import {
  parseSearchParams,
  type SearchParamsInput,
} from '@/lib/searchanise/params'
import { getSearchaniseSearchResults } from '@/lib/searchanise/search'
import { withNoindexRobots } from '@/lib/seo/noindex'

type Props = {
  searchParams: Promise<SearchParamsInput>
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const state = parseSearchParams(await searchParams)
  const title = state.query ? `Search: "${state.query}"` : 'Search'

  return withNoindexRobots({
    title,
    description: state.query
      ? `Search results for "${state.query}" on Teavision, Australia's bulk tea and herb supplier.`
      : 'Search Teavision for bulk tea, herbs, and spices.',
    robots: { index: false },
  })
}

async function SearchContent({
  searchParams,
}: {
  searchParams: Props['searchParams']
}) {
  const state = parseSearchParams(await searchParams)
  const result = await getSearchaniseSearchResults(state)

  return <SearchResultsView result={result} state={state} />
}

function SearchFallback() {
  return (
    <Section.Root tone="sunken" spacing="compact">
      <Section.Container>
        <div className="py-10" role="status" aria-live="polite">
          <Eyebrow>Search</Eyebrow>
          <p className="font-display text-ink mt-3 text-[clamp(2rem,4vw,3.4rem)]">
            Loading search results…
          </p>
        </div>
      </Section.Container>
    </Section.Root>
  )
}

export default function SearchPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchContent searchParams={searchParams} />
    </Suspense>
  )
}
