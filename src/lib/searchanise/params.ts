import {
  SEARCH_RESULTS_PAGE_SIZE,
  SEARCH_SORT_OPTIONS,
  type SearchFilterSelection,
  type SearchRouteState,
  type SearchSortValue,
} from './types'

export type SearchParamsInput = Record<string, string | string[] | undefined>

type SearchHrefOptions = Partial<SearchRouteState> & {
  pathname?: string
}

const DEFAULT_SORT: SearchSortValue = 'relevance'
const SEARCH_SORT_VALUES = new Set<SearchSortValue>(
  SEARCH_SORT_OPTIONS.map((option) => option.value),
)

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}

function allValues(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value
  return value ? [value] : []
}

function parsePositiveInteger(
  value: string | string[] | undefined,
  fallback: number,
  max: number,
): number {
  const parsed = parseInt(firstValue(value), 10)

  if (Number.isNaN(parsed) || parsed < 1) return fallback

  return Math.min(parsed, max)
}

function normalizeSort(value: string | string[] | undefined): SearchSortValue {
  const sort = firstValue(value)

  return SEARCH_SORT_VALUES.has(sort as SearchSortValue)
    ? (sort as SearchSortValue)
    : DEFAULT_SORT
}

function normalizeQuery(value: string): string {
  return value.trim().slice(0, 512)
}

export function encodeSearchFilter({
  attribute,
  value,
}: SearchFilterSelection): string {
  return `${attribute}:${value}`
}

export function decodeSearchFilter(
  input: string,
): SearchFilterSelection | null {
  const separatorIndex = input.indexOf(':')

  if (separatorIndex <= 0) return null

  const attribute = input.slice(0, separatorIndex).trim()
  const value = input.slice(separatorIndex + 1).trim()

  if (!attribute || !value) return null

  return { attribute, value }
}

function uniqueFilters(
  filters: SearchFilterSelection[],
): SearchFilterSelection[] {
  const seen = new Set<string>()
  const nextFilters: SearchFilterSelection[] = []

  filters.forEach((filter) => {
    const token = encodeSearchFilter(filter)

    if (seen.has(token)) return

    seen.add(token)
    nextFilters.push(filter)
  })

  return nextFilters
}

export function parseSearchParams(
  searchParams: SearchParamsInput,
): SearchRouteState {
  const query =
    normalizeQuery(firstValue(searchParams.q)) ||
    normalizeQuery(firstValue(searchParams.query)) ||
    normalizeQuery(firstValue(searchParams.search))
  const filters = uniqueFilters(
    allValues(searchParams.filter)
      .map(decodeSearchFilter)
      .filter((filter): filter is SearchFilterSelection => filter !== null),
  )

  return {
    query,
    page: parsePositiveInteger(searchParams.page, 1, 1000),
    sort: normalizeSort(searchParams.sort),
    filters,
  }
}

export function createSearchHref(
  state: SearchRouteState,
  options: SearchHrefOptions = {},
): string {
  const pathname = options.pathname ?? '/search'
  const query = options.query ?? state.query
  const page = options.page ?? state.page
  const sort = options.sort ?? state.sort
  const filters = options.filters ?? state.filters
  const params = new URLSearchParams()

  if (query) params.set('q', query)
  if (sort !== DEFAULT_SORT) params.set('sort', sort)
  if (page > 1) params.set('page', String(page))

  uniqueFilters(filters)
    .sort((a, b) => encodeSearchFilter(a).localeCompare(encodeSearchFilter(b)))
    .forEach((filter) => params.append('filter', encodeSearchFilter(filter)))

  const queryString = params.toString()

  return queryString ? `${pathname}?${queryString}` : pathname
}

export function createPageHref(
  state: SearchRouteState,
  page: number,
  pathname = '/search',
): string {
  return createSearchHref(state, {
    page: Math.max(1, page),
    pathname,
  })
}

export function createSortHref(
  state: SearchRouteState,
  sort: SearchSortValue,
  pathname = '/search',
): string {
  return createSearchHref(state, {
    page: 1,
    pathname,
    sort,
  })
}

export function createClearFiltersHref(
  state: SearchRouteState,
  pathname = '/search',
): string {
  return createSearchHref(state, {
    filters: [],
    page: 1,
    pathname,
  })
}

export function createFilterToggleHref(
  state: SearchRouteState,
  filter: SearchFilterSelection,
  pathname = '/search',
): string {
  const token = encodeSearchFilter(filter)
  const hasFilter = state.filters.some(
    (selectedFilter) => encodeSearchFilter(selectedFilter) === token,
  )
  const filters = hasFilter
    ? state.filters.filter(
        (selectedFilter) => encodeSearchFilter(selectedFilter) !== token,
      )
    : [...state.filters, filter]

  return createSearchHref(state, {
    filters,
    page: 1,
    pathname,
  })
}

export function createLegacySearchRedirectHref(
  searchParams: SearchParamsInput,
): string {
  const state = parseSearchParams(searchParams)

  return createSearchHref(
    {
      ...state,
      page: parsePositiveInteger(
        searchParams.page,
        1,
        Math.floor(100000 / SEARCH_RESULTS_PAGE_SIZE),
      ),
    },
    { pathname: '/search' },
  )
}
