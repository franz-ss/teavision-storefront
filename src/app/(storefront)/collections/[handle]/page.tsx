import { Suspense } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  getCollection,
  getCollectionProductsWithFilters,
  getCollectionSummaries,
} from '@/lib/shopify/operations/collection'
import {
  FilterType,
  type CollectionProductFilter,
  type CollectionProductSummary,
  type CollectionSummary,
  ProductCollectionSortKeys,
  type ProductFilter,
} from '@/lib/shopify/types'
import {
  CollectionFilterPanel,
  CollectionProductCard,
  CollectionStoryDisclosure,
  CollectionToolbar,
} from '@/components/collection'
import { Button, Card, Section } from '@/components/ui'
import { cn } from '@/lib/utils'

type CollectionSearchParams = {
  sort?: string | string[]
  filter?: string | string[]
}

type Props = {
  params: Promise<{ handle: string; category?: string }>
  searchParams: Promise<CollectionSearchParams>
}

type CollectionHeroImage = {
  url: string
  altText: string | null
  width: number | null
  height: number | null
  layout?: 'standard' | 'legacy-banner'
}

const LEGACY_COLLECTION_BANNER_BLOCK_PATTERN =
  /<div\b[^>]*\bid=["']kk-collection-banner["'][^>]*>[\s\S]*?<h1\b[\s\S]*?<\/h1>\s*<\/div>/gi

const LEGACY_READ_MORE_LINK_PATTERN =
  /<a\b(?=[^>]*(?:\bid=["']show-(?:more|less)["']|\bhref=["']#read-(?:more|less)["']))[^>]*>[\s\S]*?<\/a>/gi

const CATEGORY_TAG_PREFIX = 'categories_'

const SORT_MAP: Record<
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

const COLLECTION_HERO_IMAGE_OVERRIDES: Record<string, CollectionHeroImage> = {
  'tea-masters-selection-worlds-best-teas': {
    url: 'https://cdn.shopify.com/s/files/1/0786/8339/files/tea_masters.png?v=1779245717',
    altText: 'Tea Masters Selection loose leaf tea being prepared by hand',
    width: 1894,
    height: 830,
    layout: 'standard',
  },
}

const PRIMARY_LINK_CLASS_NAME =
  'type-label bg-action-primary text-action-primary-text hover:bg-action-primary-hover focus-visible:ring-ring inline-flex min-h-11 items-center justify-center rounded-md px-5 text-center transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

const SECONDARY_LINK_CLASS_NAME =
  'type-label border-action-secondary-border text-action-secondary-text hover:bg-action-secondary-hover focus-visible:ring-ring inline-flex min-h-11 items-center justify-center rounded-md border px-5 text-center transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

function truncateMetaDescription(value: string): string {
  return value.length > 160 ? `${value.slice(0, 157).trimEnd()}...` : value
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

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

function normalizeShopifyImageUrl(url: string): string {
  const decodedUrl = decodeHtmlEntities(url).trim()
  return decodedUrl.startsWith('//') ? `https:${decodedUrl}` : decodedUrl
}

function truncateHeroDescription(value: string): string {
  if (value.length <= 280) return value
  return `${value.slice(0, 277).trimEnd()}...`
}

function cleanHeroDescription(value: string): string {
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

function getLegacyCollectionBannerImage(
  html: string,
  collectionTitle: string,
): CollectionHeroImage | null {
  const blockMatch = html.match(LEGACY_COLLECTION_BANNER_BLOCK_PATTERN)
  const block = blockMatch?.[0]
  if (!block) return null

  const backgroundImageMatch = block.match(
    /background-image\s*:\s*url\(\s*["']?([^"')]+)["']?\s*\)/i,
  )
  const imgMatch = block.match(/\bsrc=["']([^"']+)["']/i)
  const rawUrl = backgroundImageMatch?.[1] ?? imgMatch?.[1] ?? null
  if (!rawUrl) return null

  const headingMatch = block.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)
  const legacyTitle = headingMatch?.[1]
    ? plainTextFromHtml(headingMatch[1])
    : collectionTitle

  return {
    url: normalizeShopifyImageUrl(rawUrl),
    altText: `${legacyTitle} collection banner`,
    width: null,
    height: null,
    layout: 'legacy-banner',
  }
}

function normalizeCollectionHtml(html: string): string {
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

function shouldRenderRichDescription(
  descriptionHtml: string,
  description: string,
): boolean {
  const text = plainTextFromHtml(descriptionHtml)

  return (
    text.length > description.length + 40 ||
    /<(h[1-6]|ul|ol|table|blockquote)\b/i.test(descriptionHtml)
  )
}

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function paramValues(value: string | string[] | undefined): string[] {
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

function isVendorCollectionFilter(filter: CollectionProductFilter): boolean {
  return (
    filter.id.toLowerCase().includes('vendor') ||
    filter.label.trim().toLowerCase() === 'vendor' ||
    filter.values.some((value) => isSerializedVendorFilter(value.input))
  )
}

function isAvailabilityCollectionFilter(
  filter: CollectionProductFilter,
): boolean {
  return (
    filter.id.toLowerCase().includes('availability') ||
    filter.label.trim().toLowerCase() === 'availability' ||
    filter.values.some((value) => isSerializedAvailabilityFilter(value.input))
  )
}

function isCategoryCollectionFilter(filter: CollectionProductFilter): boolean {
  return filter.values.some((value) => {
    try {
      const parsed: unknown = JSON.parse(value.input)
      return isProductFilterInput(parsed) && isCategoryProductFilter(parsed)
    } catch {
      return false
    }
  })
}

function getCategoryFilterInput(tag: string): string {
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

function getCollectionPath(handle: string): string {
  return `/collections/${handle}`
}

function withCollectionQuery(
  href: string,
  sort: string,
  selectedFilters: string[] = [],
): string {
  const params = new URLSearchParams()
  if (sort !== 'featured') params.set('sort', sort)
  selectedFilters.forEach((filter) => params.append('filter', filter))
  const queryString = params.toString()

  return queryString ? `${href}?${queryString}` : href
}

function getCollectionHref(
  handle: string,
  sort: string,
  selectedFilters: string[] = [],
): string {
  return withCollectionQuery(getCollectionPath(handle), sort, selectedFilters)
}

function getCategoryHref(
  handle: string,
  tag: string,
  sort: string,
  selectedFilters: string[],
): string {
  return withCollectionQuery(
    `${getCollectionPath(handle)}/${toCategoryPathSegment(tag)}`,
    sort,
    selectedFilters,
  )
}

function compareSidebarCollections(
  first: CollectionSummary,
  second: CollectionSummary,
): number {
  if (first.handle === 'all') return -1
  if (second.handle === 'all') return 1
  return first.title.localeCompare(second.title)
}

function getSidebarCollections(
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

function normalizeCategoryPathSegment(value: string): string {
  try {
    return decodeURIComponent(value).toLowerCase()
  } catch {
    return value.toLowerCase()
  }
}

function findCategoryTagForPath(
  category: string | undefined,
  products: CollectionProductSummary[],
): string | null {
  if (!category) return null
  const normalizedCategory = normalizeCategoryPathSegment(category)

  return (
    getCategoryTags(products).find(
      (tag) => toCategoryPathSegment(tag) === normalizedCategory,
    ) ?? null
  )
}

function buildCategoryFilter({
  products,
  handle,
  selectedCategoryTag,
  sort,
  selectedFilters,
}: {
  products: CollectionProductSummary[]
  handle: string
  selectedCategoryTag: string | null
  sort: string
  selectedFilters: string[]
}): CollectionProductFilter | null {
  const counts = new Map<string, number>()

  products.forEach((product) => {
    product.tags.filter(isCategoryTag).forEach((tag) => {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    })
  })

  const values = Array.from(counts.entries())
    .map(([tag, count]) => ({
      id: `filter.p.tag.${toFilterId(tag)}`,
      label: formatCategoryLabel(tag),
      count,
      input: getCategoryFilterInput(tag),
      href:
        tag === selectedCategoryTag
          ? getCollectionHref(handle, sort, selectedFilters)
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

function filterProductsByCategoryTags(
  products: CollectionProductSummary[],
  selectedCategoryTag: string | null,
): CollectionProductSummary[] {
  if (!selectedCategoryTag) return products

  return products.filter((product) =>
    product.tags.some((tag) => tag === selectedCategoryTag),
  )
}

function parseSelectedFilterParams(values: string[]): {
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

function getCollectionHeroImage(
  handle: string,
  featuredImage: CollectionHeroImage | null,
  descriptionHtml: string,
  collectionTitle: string,
): CollectionHeroImage | null {
  return (
    COLLECTION_HERO_IMAGE_OVERRIDES[handle] ??
    getLegacyCollectionBannerImage(descriptionHtml, collectionTitle) ??
    featuredImage
  )
}

function getResizedShopifyImageUrl(url: string, width: number): string {
  return `${url}${url.includes('?') ? '&' : '?'}width=${width}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle, category } = await params
  const collection = await getCollection(handle)
  if (!collection) return { title: 'Collection not found' }
  const description = truncateMetaDescription(
    collection.seo.description ??
      collection.description ??
      `Browse ${collection.title} from Teavision, Australia's bulk tea and herb supplier.`,
  )
  const title = collection.seo.title ?? collection.title
  const collectionPath = category
    ? `${getCollectionPath(handle)}/${category}`
    : getCollectionPath(handle)
  const heroImage = getCollectionHeroImage(
    handle,
    collection.featuredImage,
    collection.descriptionHtml,
    collection.title,
  )

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: collectionPath,
      images: heroImage
        ? [
            {
              url: heroImage.url,
              alt: heroImage.altText ?? collection.title,
            },
          ]
        : undefined,
    },
    alternates: { canonical: collectionPath },
  }
}

async function CollectionContent({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string; category?: string }>
  searchParams: Promise<CollectionSearchParams>
}) {
  const [{ handle, category }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ])

  const sortParam = firstParam(resolvedSearchParams.sort)
  const sort = sortParam && sortParam in SORT_MAP ? sortParam : 'featured'
  const { sortKey, reverse } = SORT_MAP[sort]
  const { selectedFilters, productFilters } = parseSelectedFilterParams(
    paramValues(resolvedSearchParams.filter),
  )

  const [collection, collectionProductsResult, collectionSummaries] =
    await Promise.all([
      getCollection(handle),
      getCollectionProductsWithFilters(
        handle,
        250,
        sortKey,
        reverse,
        productFilters,
      ),
      getCollectionSummaries(),
    ])

  if (!collection) notFound()

  const sidebarCollections = getSidebarCollections(collectionSummaries)
  const selectedCategoryTag = findCategoryTagForPath(
    category,
    collectionProductsResult.products,
  )
  if (category && !selectedCategoryTag) notFound()

  const activeSelectedFilters = selectedCategoryTag
    ? [getCategoryFilterInput(selectedCategoryTag), ...selectedFilters]
    : selectedFilters
  const clearFiltersHref = getCollectionHref(handle, sort)
  const categoryFilter = buildCategoryFilter({
    products: collectionProductsResult.products,
    handle,
    selectedCategoryTag,
    sort,
    selectedFilters,
  })
  const products = filterProductsByCategoryTags(
    collectionProductsResult.products,
    selectedCategoryTag,
  )
  const visibleFilters = [
    categoryFilter,
    ...collectionProductsResult.filters.filter(
      (filter) =>
        !isVendorCollectionFilter(filter) &&
        !isAvailabilityCollectionFilter(filter) &&
        !isCategoryCollectionFilter(filter),
    ),
  ].filter((filter): filter is CollectionProductFilter => Boolean(filter))
  const heroImage = getCollectionHeroImage(
    handle,
    collection.featuredImage,
    collection.descriptionHtml,
    collection.title,
  )

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://teavision.com.au'
  const collectionPath = category
    ? `${getCollectionPath(handle)}/${category}`
    : getCollectionPath(handle)
  const collectionUrl = `${baseUrl}${collectionPath}`
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${baseUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Collections',
            item: `${baseUrl}/collections/all`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: collection.title,
            item: collectionUrl,
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: collection.title,
        description: collection.description,
        url: collectionUrl,
        dateModified: collection.updatedAt,
      },
      {
        '@type': 'ItemList',
        name: `${collection.title} products`,
        itemListElement: products.slice(0, 24).map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${baseUrl}/products/${product.handle}`,
          item: {
            '@type': 'Product',
            name: product.title,
            image: product.featuredImage?.url,
            offers: {
              '@type': 'Offer',
              price: product.priceRange.minVariantPrice.amount,
              priceCurrency: product.priceRange.minVariantPrice.currencyCode,
            },
          },
        })),
      },
    ],
  }
  const heroDescription = cleanHeroDescription(collection.description)
  const richDescriptionHtml = normalizeCollectionHtml(
    collection.descriptionHtml,
  )
  const hasRichDescription = shouldRenderRichDescription(
    collection.descriptionHtml,
    collection.description,
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Section.Root
        tone="sunken"
        className="border-default w-full max-w-full overflow-x-hidden border-b"
      >
        <Section.Container>
          <nav
            aria-label="Breadcrumb"
            className="type-body-sm text-muted mb-8 flex flex-wrap items-center gap-2"
          >
            <Link
              href="/"
              className="focus-visible:ring-ring inline-flex min-h-10 items-center rounded hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href="/collections/all"
              className="focus-visible:ring-ring inline-flex min-h-10 items-center rounded hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Collections
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-default">
              {collection.title}
            </span>
          </nav>

          {heroImage && (
            <figure className="border-default bg-surface mb-8 overflow-hidden rounded-md border">
              <div
                className={cn(
                  'relative w-full overflow-hidden',
                  heroImage.layout === 'legacy-banner'
                    ? 'h-52'
                    : 'aspect-[16/7]',
                )}
              >
                <Image
                  src={getResizedShopifyImageUrl(heroImage.url, 1440)}
                  alt={heroImage.altText ?? collection.title}
                  fill
                  priority
                  sizes="(min-width: 1280px) 1200px, 100vw"
                  className="object-cover"
                />
              </div>
            </figure>
          )}

          <div className="max-w-4xl">
            <p className="type-eyebrow text-accent">Wholesale collection</p>
            <h1 className="type-heading-02 md:type-display-01 text-strong mt-5 text-balance break-words">
              {collection.title}
            </h1>
            {heroDescription && (
              <p className="type-body-lg text-muted mt-6 max-w-prose break-words">
                {heroDescription}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/pages/wholesale-account-request"
                className={cn(PRIMARY_LINK_CLASS_NAME, 'w-full sm:w-auto')}
              >
                Request wholesale pricing
              </Link>
              <Link
                href="/pages/contact"
                className={cn(SECONDARY_LINK_CLASS_NAME, 'w-full sm:w-auto')}
              >
                Ask about this range
              </Link>
            </div>
          </div>
        </Section.Container>
      </Section.Root>

      <main className="bg-canvas w-full max-w-full overflow-x-hidden">
        {hasRichDescription && (
          <Section.Root
            tone="surface"
            spacing="compact"
            className="border-default border-b"
          >
            <Section.Container>
              <CollectionStoryDisclosure
                title={`Read more about ${collection.title}`}
                html={richDescriptionHtml}
                className="max-w-4xl"
              />
            </Section.Container>
          </Section.Root>
        )}

        <Section.Root
          tone="transparent"
          aria-labelledby="collection-products-heading"
        >
          <Section.Container>
            <CollectionToolbar
              headingId="collection-products-heading"
              currentSort={sort}
              productCount={products.length}
              filters={visibleFilters}
              selectedFilters={activeSelectedFilters}
              clearHref={clearFiltersHref}
              className="mb-8"
            />

            <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
              <aside className="hidden lg:grid lg:gap-5">
                <Card as="aside" padding="md" radius="md">
                  <h2 className="type-heading-04 text-strong">
                    Need help choosing?
                  </h2>
                  <p className="type-body-sm text-muted mt-3">
                    Share your format, volume, and flavour brief with the
                    Teavision team before you sample or scale.
                  </p>
                  <div className="mt-5 grid gap-2">
                    <Button href="/pages/contact" variant="primary" size="sm">
                      Contact the team
                    </Button>
                    <Button
                      href="/pages/wholesale-account-request"
                      variant="secondary"
                      size="sm"
                    >
                      Wholesale access
                    </Button>
                  </div>
                </Card>

                <Card as="aside" padding="md" radius="md">
                  <CollectionFilterPanel
                    filters={visibleFilters}
                    selectedFilters={activeSelectedFilters}
                    resultCount={products.length}
                    clearHref={clearFiltersHref}
                  />
                </Card>

                {sidebarCollections.length > 0 && (
                  <Card as="aside" padding="md" radius="md">
                    <details open>
                      <summary className="type-label text-strong focus-visible:ring-ring flex min-h-11 cursor-pointer list-none items-center rounded focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none">
                        You Might Like
                      </summary>
                      <nav
                        aria-label="You might like collections"
                        className="mt-3 max-h-96 overflow-y-auto pr-1"
                      >
                        <ul className="grid gap-1" role="list">
                          {sidebarCollections.map((sidebarCollection) => {
                            const isActive = sidebarCollection.handle === handle

                            return (
                              <li key={sidebarCollection.id}>
                                <Link
                                  href={getCollectionPath(
                                    sidebarCollection.handle,
                                  )}
                                  aria-current={isActive ? 'page' : undefined}
                                  className={cn(
                                    'type-body-sm focus-visible:ring-ring flex min-h-9 items-center rounded px-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                                    isActive
                                      ? 'bg-surface-sunken text-strong'
                                      : 'text-link hover:bg-surface-sunken',
                                  )}
                                >
                                  {sidebarCollection.title}
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      </nav>
                    </details>
                  </Card>
                )}
              </aside>

              <ul className="grid gap-4" role="list">
                {products.length === 0 ? (
                  <Card
                    as="li"
                    padding="lg"
                    radius="md"
                    className="text-center"
                  >
                    <h3 className="type-heading-03 text-strong">
                      No products match these filters
                    </h3>
                    <p className="type-body-sm text-muted mx-auto mt-3 max-w-lg">
                      Clear the selected filters or ask the Teavision team to
                      confirm suitable options for this range.
                    </p>
                    <Button href="/pages/contact" className="mt-6">
                      Contact Teavision
                    </Button>
                  </Card>
                ) : (
                  products.map((product, index) => (
                    <li key={product.id}>
                      <CollectionProductCard
                        product={product}
                        priority={index === 0}
                      />
                    </li>
                  ))
                )}
              </ul>
            </div>
          </Section.Container>
        </Section.Root>
      </main>
    </>
  )
}

export default function CollectionPage({ params, searchParams }: Props) {
  return (
    <Suspense
      fallback={
        <div className="type-body text-muted mx-auto max-w-7xl px-4 py-12 md:px-6">
          Loading collection...
        </div>
      }
    >
      <CollectionContent params={params} searchParams={searchParams} />
    </Suspense>
  )
}
