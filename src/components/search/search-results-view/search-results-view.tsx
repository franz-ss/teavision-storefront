import { Suspense } from 'react'
import { SlidersHorizontal } from 'lucide-react'

import { Section } from '@/components/ui'
import { createClearFiltersHref } from '@/lib/searchanise/params'
import type {
  SearchRouteState,
  SearchaniseSearchResult,
} from '@/lib/searchanise/types'

import { ActiveFilterChips } from './active-filter-chips'
import { ProductResults } from './product-results'
import { SearchAlert } from './search-alert'
import { SearchHero } from './search-hero'
import {
  createActiveFilters,
  createPanelFacets,
  formatResultCount,
} from './search-results-helpers'
import { SearchFilterPanel } from '../search-filter-panel'
import { SearchPagination } from '../search-pagination'
import { SearchSortSelect } from '../search-sort-select'

type SearchResultsViewProps = {
  result: SearchaniseSearchResult
  state: SearchRouteState
}

export function SearchResultsView({ result, state }: SearchResultsViewProps) {
  const clearHref = createClearFiltersHref(state)
  const panelFacets = createPanelFacets(result.facets, state)
  const activeFilters = createActiveFilters(result.facets, state)
  const selectedFilterCount = state.filters.length

  return (
    <>
      <SearchHero result={result} state={state} />

      <Section.Root tone="surface" spacing="compact">
        <Section.Container>
          {result.status === 'idle' ? (
            <div className="max-w-2xl">
              <SearchAlert
                tone="empty"
                message="Enter a search term to find matching products."
              />
            </div>
          ) : result.status === 'unavailable' || result.status === 'error' ? (
            <div className="max-w-2xl">
              <SearchAlert
                tone="error"
                message={
                  result.message ?? 'Search results are unavailable right now.'
                }
              />
            </div>
          ) : (
            <div className="grid items-start gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-10">
              <aside className="hidden self-start lg:block">
                <SearchFilterPanel
                  clearHref={clearHref}
                  facets={panelFacets}
                  resultCount={result.pagination.totalItems}
                  selectedFilterCount={selectedFilterCount}
                />
              </aside>

              <div className="grid gap-6 self-start">
                <div className="border-default grid gap-5 border-b pb-6">
                  <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="type-eyebrow text-accent">Products</p>
                      <h2 className="type-heading-03 text-strong mt-2">
                        {formatResultCount(result)}
                      </h2>
                    </div>
                    <Suspense fallback={null}>
                      <SearchSortSelect currentSort={state.sort} />
                    </Suspense>
                  </div>

                  <ActiveFilterChips
                    activeFilters={activeFilters}
                    clearHref={clearHref}
                  />

                  <details className="border-default bg-surface rounded-md border lg:hidden">
                    <summary className="type-label text-strong focus-visible:ring-ring flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-md px-4 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none">
                      <span className="inline-flex items-center gap-2">
                        <SlidersHorizontal
                          className="size-4"
                          aria-hidden="true"
                        />
                        Filter results
                      </span>
                      {selectedFilterCount > 0 && (
                        <span className="type-caption text-muted">
                          {selectedFilterCount} active
                        </span>
                      )}
                    </summary>
                    <div className="border-default border-t p-4">
                      <SearchFilterPanel
                        clearHref={clearHref}
                        facets={panelFacets}
                        resultCount={result.pagination.totalItems}
                        selectedFilterCount={selectedFilterCount}
                      />
                    </div>
                  </details>
                </div>

                <ProductResults result={result} />

                <SearchPagination
                  pagination={result.pagination}
                  state={state}
                />
              </div>
            </div>
          )}
        </Section.Container>
      </Section.Root>
    </>
  )
}
