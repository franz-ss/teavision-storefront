import {
  FilterType,
  type CollectionFilterValue,
  type CollectionProductFilter,
  type CollectionProductSummary,
  type CollectionSummary,
  ProductCollectionSortKeys,
  type ProductFilter,
} from '@/lib/shopify/types'

export type HeroImage = {
  url: string
  altText: string | null
  width: number | null
  height: number | null
}

const LEGACY_COLLECTION_BANNER_BLOCK_PATTERN =
  /<div\b[^>]*\bid=["']kk-collection-banner["'][^>]*>[\s\S]*?<h1\b[\s\S]*?<\/h1>\s*<\/div>/gi

const LEGACY_READ_MORE_LINK_PATTERN =
  /<a\b(?=[^>]*(?:\bid=["']show-(?:more|less)["']|\bhref=["']#read-(?:more|less)["']))[^>]*>[\s\S]*?<\/a>/gi

const CATEGORY_TAG_PREFIX = 'categories_'

export const SORT_MAP: Record<
  string,
  { sortKey: ProductCollectionSortKeys; reverse: boolean }
> = {
  featured: {
    sortKey: ProductCollectionSortKeys.CollectionDefault,
    reverse: false,
  },
  'best-selling': {
    sortKey: ProductCollectionSortKeys.BestSelling,
    reverse: false,
  },
  'title-asc': { sortKey: ProductCollectionSortKeys.Title, reverse: false },
  'title-desc': { sortKey: ProductCollectionSortKeys.Title, reverse: true },
  'price-asc': { sortKey: ProductCollectionSortKeys.Price, reverse: false },
  'price-desc': { sortKey: ProductCollectionSortKeys.Price, reverse: true },
  newest: { sortKey: ProductCollectionSortKeys.Created, reverse: true },
  oldest: { sortKey: ProductCollectionSortKeys.Created, reverse: false },
}

const HERO_IMAGE_OVERRIDES: Record<string, HeroImage> = {
  'tea-masters-selection-worlds-best-teas': {
    url: 'https://cdn.shopify.com/s/files/1/0786/8339/files/tea_masters.png?v=1779245717',
    altText: 'Tea Masters Selection loose leaf tea being prepared by hand',
    width: 1894,
    height: 830,
  },
}

const HIDDEN_HERO_INTRO_HANDLES = new Set([
  'tea-masters-selection-worlds-best-teas',
])

const FORCED_RICH_DESCRIPTION_HANDLES = new Set([
  'tea-masters-selection-worlds-best-teas',
])

export function truncateMetaDescription(value: string): string {
  return value.length > 160 ? `${value.slice(0, 157).trimEnd()}…` : value
}

function plainTextFromHtml(html: string): string {
  return removeCitationMarkers(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function removeCitationMarkers(value: string): string {
  return value.replace(/:contentReference\[[^\]]+\]\{[^}]+\}/g, ' ')
}

function truncateHeroDescription(value: string): string {
  if (value.length <= 280) return value
  return `${value.slice(0, 277).trimEnd()}…`
}

export function cleanHeroDescription(value: string): string {
  const withoutMarkers = removeCitationMarkers(value)
    .replace(/\s+/g, ' ')
    .trim()
  const lowerValue = withoutMarkers.toLowerCase()
  const discoverIndex = lowerValue.indexOf('discover ')
  const cleaned =
    lowerValue.startsWith('read more about') && discoverIndex > -1
      ? withoutMarkers.slice(discoverIndex)
      : withoutMarkers

  return truncateHeroDescription(cleaned)
}

export function normalizeHtml(html: string): string {
  return removeCitationMarkers(html)
    .replace(LEGACY_COLLECTION_BANNER_BLOCK_PATTERN, '')
    .replace(LEGACY_READ_MORE_LINK_PATTERN, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<figure\b[\s\S]*?<\/figure>/gi, '')
    .replace(/<picture\b[\s\S]*?<\/picture>/gi, '')
    .replace(/<img\b[^>]*>/gi, '')
    .replace(/<summary\b[\s\S]*?<\/summary>/gi, '')
    .replace(/<\/?details\b[^>]*>/gi, '')
    .replace(/\s(?:style|class|id|data-[^=]+)="[^"]*"/gi, '')
    .replace(/\s(?:style|class|id|data-[^=]+)='[^']*'/gi, '')
    .replace(/<h[12](\s[^>]*)?>/gi, '<h3>')
    .replace(/<\/h[12]>/gi, '</h3>')
}

export function shouldRenderRichDescription(
  descriptionHtml: string,
  description: string,
): boolean {
  const text = plainTextFromHtml(descriptionHtml)

  return (
    text.length > description.length + 40 ||
    /<(h[1-6]|ul|ol|table|blockquote)\b/i.test(descriptionHtml)
  )
}

export function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export function paramValues(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value
  return value ? [value] : []
}

function isProductFilterInput(value: unknown): value is ProductFilter {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isVendorProductFilter(value: ProductFilter): boolean {
  return typeof value.productVendor === 'string' && value.productVendor !== ''
}

function isAvailabilityProductFilter(value: ProductFilter): boolean {
  return typeof value.available === 'boolean'
}

function isCategoryTag(value: string): boolean {
  return value.startsWith(CATEGORY_TAG_PREFIX)
}

function isCategoryProductFilter(value: ProductFilter): boolean {
  return typeof value.tag === 'string' && isCategoryTag(value.tag)
}

function isSerializedVendorFilter(value: string): boolean {
  try {
    const parsed: unknown = JSON.parse(value)
    return isProductFilterInput(parsed) && isVendorProductFilter(parsed)
  } catch {
    return false
  }
}

function isSerializedAvailabilityFilter(value: string): boolean {
  try {
    const parsed: unknown = JSON.parse(value)
    return isProductFilterInput(parsed) && isAvailabilityProductFilter(parsed)
  } catch {
    return false
  }
}

export function isVendorFilter(filter: CollectionProductFilter): boolean {
  return (
    filter.id.toLowerCase().includes('vendor') ||
    filter.label.trim().toLowerCase() === 'vendor' ||
    filter.values.some((value) => isSerializedVendorFilter(value.input))
  )
}

export function isAvailabilityFilter(filter: CollectionProductFilter): boolean {
  return (
    filter.id.toLowerCase().includes('availability') ||
    filter.label.trim().toLowerCase() === 'availability' ||
    filter.values.some((value) => isSerializedAvailabilityFilter(value.input))
  )
}

export function isCategoryFilter(filter: CollectionProductFilter): boolean {
  return filter.values.some((value) => {
    try {
      const parsed: unknown = JSON.parse(value.input)
      return isProductFilterInput(parsed) && isCategoryProductFilter(parsed)
    } catch {
      return false
    }
  })
}

export function getCategoryFilterInput(tag: string): string {
  return JSON.stringify({ tag })
}

function formatCategoryLabel(tag: string): string {
  return tag
    .slice(CATEGORY_TAG_PREFIX.length)
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function toFilterId(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function toCategoryPathSegment(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function getPath(handle: string): string {
  return `/collections/${handle}`
}

function withQuery(
  href: string,
  sort: string,
  selectedFilters: string[] = [],
  cursor?: string | null,
): string {
  const params = new URLSearchParams()
  if (sort !== 'featured') params.set('sort', sort)
  selectedFilters.forEach((filter) => params.append('filter', filter))
  if (cursor) params.set('cursor', cursor)
  const queryString = params.toString()

  return queryString ? `${href}?${queryString}` : href
}

export function getHref(
  handle: string,
  sort: string,
  selectedFilters: string[] = [],
): string {
  return withQuery(getPath(handle), sort, selectedFilters)
}

function getCategoryHref(
  handle: string,
  tag: string,
  sort: string,
  selectedFilters: string[],
): string {
  return withQuery(
    `${getPath(handle)}/${toCategoryPathSegment(tag)}`,
    sort,
    selectedFilters,
  )
}

export function getPaginationHref({
  category,
  cursor,
  handle,
  selectedFilters,
  sort,
}: {
  category: string | undefined
  cursor: string
  handle: string
  selectedFilters: string[]
  sort: string
}): string {
  const path = category ? `${getPath(handle)}/${category}` : getPath(handle)

  return withQuery(path, sort, selectedFilters, cursor)
}

function compareSidebarCollections(
  first: CollectionSummary,
  second: CollectionSummary,
): number {
  if (first.handle === 'all') return -1
  if (second.handle === 'all') return 1
  return first.title.localeCompare(second.title)
}

export function getSidebarCollections(
  collections: CollectionSummary[],
): CollectionSummary[] {
  return collections
    .filter((collection) => collection.handle !== 'frontpage')
    .sort(compareSidebarCollections)
}

function getCategoryTags(products: CollectionProductSummary[]): string[] {
  return Array.from(
    new Set(products.flatMap((product) => product.tags.filter(isCategoryTag))),
  )
}

function getCategoryTagFromFilterValue(
  value: CollectionFilterValue,
): string | null {
  try {
    const parsed: unknown = JSON.parse(value.input)
    if (!isProductFilterInput(parsed) || !isCategoryProductFilter(parsed)) {
      return null
    }

    return parsed.tag ?? null
  } catch {
    return null
  }
}

function getCategoryTagsFromFilters(
  filters: CollectionProductFilter[],
): string[] {
  return Array.from(
    new Set(
      filters.flatMap((filter) =>
        filter.values
          .map(getCategoryTagFromFilterValue)
          .filter((tag): tag is string => tag !== null),
      ),
    ),
  )
}

function normalizeCategoryPathSegment(value: string): string {
  try {
    return decodeURIComponent(value).toLowerCase()
  } catch {
    return value.toLowerCase()
  }
}

export function findCategoryTagForPath(
  category: string | undefined,
  filters: CollectionProductFilter[],
  products: CollectionProductSummary[] = [],
): string | null {
  if (!category) return null
  const normalizedCategory = normalizeCategoryPathSegment(category)
  const categoryTags = getCategoryTagsFromFilters(filters)
  const tags =
    categoryTags.length > 0 ? categoryTags : getCategoryTags(products)

  return (
    tags.find((tag) => toCategoryPathSegment(tag) === normalizedCategory) ??
    null
  )
}

export function buildCategoryFilter({
  products,
  sourceFilter,
  handle,
  selectedCategoryTag,
  sort,
  selectedFilters,
}: {
  products: CollectionProductSummary[]
  sourceFilter?: CollectionProductFilter | null
  handle: string
  selectedCategoryTag: string | null
  sort: string
  selectedFilters: string[]
}): CollectionProductFilter | null {
  const sourceValues =
    sourceFilter?.values
      .map((value) => {
        const tag = getCategoryTagFromFilterValue(value)
        if (!tag) return null

        return {
          count: value.count,
          id: value.id,
          label: value.label || formatCategoryLabel(tag),
          tag,
        }
      })
      .filter((value): value is NonNullable<typeof value> => value !== null) ??
    []

  const fallbackCounts = new Map<string, number>()

  if (sourceValues.length === 0) {
    products.forEach((product) => {
      product.tags.filter(isCategoryTag).forEach((tag) => {
        fallbackCounts.set(tag, (fallbackCounts.get(tag) ?? 0) + 1)
      })
    })
  }

  const categoryValues =
    sourceValues.length > 0
      ? sourceValues
      : Array.from(fallbackCounts.entries()).map(([tag, count]) => ({
          count,
          id: `filter.p.tag.${toFilterId(tag)}`,
          label: formatCategoryLabel(tag),
          tag,
        }))

  const values = categoryValues
    .map(({ count, id, label, tag }) => ({
      id,
      label,
      count,
      input: getCategoryFilterInput(tag),
      href:
        tag === selectedCategoryTag
          ? getHref(handle, sort, selectedFilters)
          : getCategoryHref(handle, tag, sort, selectedFilters),
    }))
    .sort((first, second) => first.label.localeCompare(second.label))

  if (values.length === 0) return null

  return {
    id: 'filter.p.tag.categories',
    label: 'Category',
    type: FilterType.List,
    values,
  }
}

export function filterProductsByCategoryTags(
  products: CollectionProductSummary[],
  selectedCategoryTag: string | null,
): CollectionProductSummary[] {
  if (!selectedCategoryTag) return products

  return products.filter((product) =>
    product.tags.some((tag) => tag === selectedCategoryTag),
  )
}

export function parseSelectedFilterParams(values: string[]): {
  selectedFilters: string[]
  productFilters: ProductFilter[]
} {
  const selectedFilters: string[] = []
  const productFilters: ProductFilter[] = []

  values.forEach((value) => {
    try {
      const parsed: unknown = JSON.parse(value)
      if (!isProductFilterInput(parsed)) return
      if (
        isVendorProductFilter(parsed) ||
        isAvailabilityProductFilter(parsed) ||
        isCategoryProductFilter(parsed)
      )
        return
      selectedFilters.push(value)
      productFilters.push(parsed)
    } catch {
      return
    }
  })

  return { selectedFilters, productFilters }
}

export function getHeroImage(
  handle: string,
  featuredImage: HeroImage | null,
): HeroImage | null {
  return HERO_IMAGE_OVERRIDES[handle] ?? featuredImage
}

export function shouldShowCollectionIntroContent(handle: string): boolean {
  return !HIDDEN_HERO_INTRO_HANDLES.has(handle)
}

export function shouldAlwaysShowRichDescription(handle: string): boolean {
  return FORCED_RICH_DESCRIPTION_HANDLES.has(handle)
}
