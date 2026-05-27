import { createFilterToggleHref } from '@/lib/searchanise/params'
import type {
  SearchFilterSelection,
  SearchRouteState,
  SearchaniseFacet,
  SearchaniseSearchResult,
} from '@/lib/searchanise/types'

import type { SearchFilterPanelFacet } from '../search-filter-panel'

export type ActiveFilter = SearchFilterSelection & {
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

export function createPanelFacets(
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

export function createActiveFilters(
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

export function formatResultCount(result: SearchaniseSearchResult): string {
  const count = result.pagination.totalItems

  return `${count} ${count === 1 ? 'result' : 'results'}`
}
