import type { ProductSummary } from '@/lib/shopify/types'

export const SEARCH_RESULTS_PAGE_SIZE = 24

export const SEARCH_SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'title-asc', label: 'Name: A-Z' },
  { value: 'title-desc', label: 'Name: Z-A' },
  { value: 'price-asc', label: 'Price: Low-High' },
  { value: 'price-desc', label: 'Price: High-Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'best-selling', label: 'Best selling' },
] as const

export type SearchSortValue = (typeof SEARCH_SORT_OPTIONS)[number]['value']

export type SearchFilterSelection = {
  attribute: string
  value: string
}

export type SearchRouteState = {
  query: string
  page: number
  sort: SearchSortValue
  filters: SearchFilterSelection[]
}

export type SearchaniseFacetType = 'select' | 'range' | 'slider' | 'unknown'

export type SearchaniseFacetValue = {
  id: string
  label: string
  value: string
  count: number
  selected: boolean
}

export type SearchaniseFacet = {
  attribute: string
  label: string
  type: SearchaniseFacetType
  values: SearchaniseFacetValue[]
}

export type SearchaniseLinkedResult = {
  id: string
  title: string
  href: string
  description?: string
  imageUrl?: string
}

export type SearchanisePagination = {
  currentPage: number
  pageSize: number
  totalPages: number
  totalItems: number
  startIndex: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export type SearchaniseSearchStatus =
  | 'idle'
  | 'success'
  | 'unavailable'
  | 'error'

export type SearchaniseSearchResult = {
  status: SearchaniseSearchStatus
  query: string
  correctedQuery?: string
  message?: string
  errorCode?: string
  products: ProductSummary[]
  facets: SearchaniseFacet[]
  categories: SearchaniseLinkedResult[]
  pages: SearchaniseLinkedResult[]
  pagination: SearchanisePagination
}

export type SearchaniseSearchInput = SearchRouteState & {
  pageSize?: number
}
