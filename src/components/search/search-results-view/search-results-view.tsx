import Form from 'next/form'
import Link from 'next/link'
import { Suspense } from 'react'
import { AlertCircle, Search, SlidersHorizontal, X } from 'lucide-react'

import { ProductQuickView } from '@/components/product'
import { Button, ProductCard, Section, TextInput } from '@/components/ui'
import {
  createClearFiltersHref,
  createFilterToggleHref,
} from '@/lib/searchanise/params'
import type {
  SearchFilterSelection,
  SearchRouteState,
  SearchaniseFacet,
  SearchaniseSearchResult,
} from '@/lib/searchanise/types'
import { cn } from '@/lib/utils'

import {
  SearchFilterPanel,
  type SearchFilterPanelFacet,
} from '../search-filter-panel'
import { SearchPagination } from '../search-pagination'
import { SearchSortSelect } from '../search-sort-select'

type SearchResultsViewProps = {
  result: SearchaniseSearchResult
  state: SearchRouteState
}

type ActiveFilter = SearchFilterSelection & {
  id: string
  label: string
  facetLabel: string
  href: string
}

function isSelectedFilter(
  filters: SearchFilterSelection[],
  filter: SearchFilterSelection,
): boolean {
  return filters.some(
    (selectedFilter) =>
      selectedFilter.attribute === filter.attribute &&
      selectedFilter.value === filter.value,
  )
}

function createPanelFacets(
  facets: SearchaniseFacet[],
  state: SearchRouteState,
): SearchFilterPanelFacet[] {
  return facets.map((facet) => ({
    attribute: facet.attribute,
    label: facet.label,
    values: facet.values.map((value) => {
      const filter = { attribute: facet.attribute, value: value.value }
      const selected = value.selected || isSelectedFilter(state.filters, filter)

      return {
        id: value.id,
        label: value.label,
        count: value.count,
        selected,
        href: createFilterToggleHref(state, filter),
      }
    }),
  }))
}

function createActiveFilters(
  facets: SearchaniseFacet[],
  state: SearchRouteState,
): ActiveFilter[] {
  const labels = new Map<string, { label: string; facetLabel: string }>()

  facets.forEach((facet) => {
    facet.values.forEach((value) => {
      labels.set(`${facet.attribute}:${value.value}`, {
        label: value.label,
        facetLabel: facet.label,
      })
    })
  })

  return state.filters.map((filter) => {
    const id = `${filter.attribute}:${filter.value}`
    const label = labels.get(id)

    return {
      ...filter,
      id,
      label: label?.label ?? filter.value,
      facetLabel: label?.facetLabel ?? filter.attribute,
      href: createFilterToggleHref(state, filter),
    }
  })
}

function formatResultCount(result: SearchaniseSearchResult): string {
  const count = result.pagination.totalItems

  return `${count} ${count === 1 ? 'result' : 'results'}`
}

function SearchPageSearchForm({ query = '' }: { query?: string }) {
  return (
    <Form action="/search" className="mt-7 grid max-w-2xl gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
      <label htmlFor="search-page-query" className="sr-only">
        Search query
      </label>
      <TextInput
        id="search-page-query"
        name="q"
        type="search"
        defaultValue={query}
        placeholder="Find products, collections, and articles"
        enterKeyHint="search"
      />
      <Button type="submit" size="lg">
        <Search className="size-4" aria-hidden="true" />
        Search
      </Button>
    </Form>
  )
}

function SearchHero({
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
          <h1 className="type-heading-01 text-strong mt-3 wrap-break-word">
            {title}
          </h1>
          <p className="type-body text-muted mt-4 max-w-2xl">
            {hasQuery
              ? countLabel
              : 'Search bulk teas, herbs, spices, collections, and journal articles.'}
          </p>
          {!hasQuery && <SearchPageSearchForm />}
        </div>
      </Section.Container>
    </Section.Root>
  )
}

function SearchAlert({
  message,
  tone,
}: {
  message: string
  tone: 'error' | 'empty'
}) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'border-default bg-surface grid gap-3 rounded-md border p-5',
        tone === 'error' && 'border-danger-border bg-danger-bg',
      )}
    >
      <div className="flex items-start gap-3">
        <AlertCircle
          className={cn(
            'mt-0.5 size-5 shrink-0',
            tone === 'error' ? 'text-danger-text' : 'text-accent',
          )}
          aria-hidden="true"
        />
        <p className="type-body-sm text-default">{message}</p>
      </div>
    </div>
  )
}

function ActiveFilterChips({
  activeFilters,
  clearHref,
}: {
  activeFilters: ActiveFilter[]
  clearHref: string
}) {
  if (activeFilters.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {activeFilters.map((filter) => (
        <Link
          key={filter.id}
          href={filter.href}
          className="type-caption border-default bg-surface text-default inline-flex min-h-9 items-center gap-2 rounded-full border px-3 transition-colors hover:bg-surface-sunken focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <span className="text-muted">{filter.facetLabel}</span>
          <span>{filter.label}</span>
          <X className="size-3.5" aria-hidden="true" />
        </Link>
      ))}
      <Button href={clearHref} variant="ghost" size="sm">
        Clear all
      </Button>
    </div>
  )
}

function SecondaryResults({
  result,
}: {
  result: SearchaniseSearchResult
}) {
  const groups = [
    { label: 'Collections', values: result.categories },
    { label: 'Articles and pages', values: result.pages },
  ].filter((group) => group.values.length > 0)

  if (groups.length === 0) return null

  return (
    <div className="border-default grid gap-5 border-t pt-8">
      {groups.map((group) => (
        <div key={group.label}>
          <h2 className="type-heading-04 text-strong">{group.label}</h2>
          <ul className="mt-3 grid gap-2 md:grid-cols-2" role="list">
            {group.values.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="border-default bg-surface hover:bg-surface-sunken focus-visible:ring-ring block rounded-md border p-4 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <span className="type-label text-strong">{item.title}</span>
                  {item.description && (
                    <span className="type-body-sm text-muted mt-2 line-clamp-2">
                      {item.description}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function ProductResults({
  result,
}: {
  result: SearchaniseSearchResult
}) {
  if (result.products.length === 0) {
    return (
      <SearchAlert
        tone="empty"
        message="No products matched this search. Try removing a filter or searching a broader term."
      />
    )
  }

  return (
    <ul
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      role="list"
    >
      {result.products.map((product, index) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            priority={index < 4}
            quickViewAction={<ProductQuickView product={product} />}
          />
        </li>
      ))}
    </ul>
  )
}

export function SearchResultsView({
  result,
  state,
}: SearchResultsViewProps) {
  const clearHref = createClearFiltersHref(state)
  const panelFacets = createPanelFacets(result.facets, state)
  const activeFilters = createActiveFilters(result.facets, state)
  const selectedFilterCount = state.filters.length

  return (
    <>
      <SearchHero result={result} state={state} />

      <Section.Root tone="surface">
        <Section.Container>
          {result.status === 'idle' ? (
            <div className="max-w-2xl">
              <SearchAlert
                tone="empty"
                message="Enter a search term to find matching products, collections, and articles."
              />
            </div>
          ) : result.status === 'unavailable' || result.status === 'error' ? (
            <div className="max-w-2xl">
              <SearchAlert
                tone="error"
                message={
                  result.message ??
                  'Search results are unavailable right now.'
                }
              />
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-10">
              <aside className="hidden lg:block">
                <SearchFilterPanel
                  clearHref={clearHref}
                  facets={panelFacets}
                  resultCount={result.pagination.totalItems}
                  selectedFilterCount={selectedFilterCount}
                />
              </aside>

              <div className="grid gap-8">
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

                <SecondaryResults result={result} />
              </div>
            </div>
          )}
        </Section.Container>
      </Section.Root>
    </>
  )
}
