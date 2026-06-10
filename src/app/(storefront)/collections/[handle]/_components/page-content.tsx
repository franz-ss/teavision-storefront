import { notFound } from 'next/navigation'

import { StoryDisclosure, Toolbar } from '@/components/collection'
import { Section } from '@/components/ui'
import { SITE_URL } from '@/lib/seo/site-url'
import { sanitizeShopifyCompactHtml } from '@/lib/shopify/html-content'
import {
  COLLECTION_PRODUCT_PAGE_SIZE,
  getCollection,
  getCollectionProductsWithFilters,
  getCollectionSummaries,
} from '@/lib/shopify/operations/collection'
import type { CollectionProductFilter } from '@/lib/shopify/types'

import {
  buildCategoryFilter,
  cleanHeroDescription,
  filterProductsByCategoryTags,
  findCategoryTagForPath,
  firstParam,
  getCategoryFilterInput,
  getDescriptionHeroImage,
  getHeroImage,
  getHref,
  getPaginationHref,
  getPath,
  getSidebarCollections,
  isAvailabilityFilter,
  isCategoryFilter,
  isVendorFilter,
  normalizeHtml,
  paramValues,
  parseSelectedFilterParams,
  shouldRenderRichDescription,
  SORT_MAP,
} from '../_lib/page-helpers'
import type { PageProps } from '../_lib/page-types'
import { Hero } from './hero'
import { JsonLd } from './json-ld'
import { ProductList } from './product-list'
import { Sidebar } from './sidebar'

export async function PageContent({ params, searchParams }: PageProps) {
  const [{ handle, category }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ])

  const sortParam = firstParam(resolvedSearchParams.sort)
  const sort = sortParam && sortParam in SORT_MAP ? sortParam : 'featured'
  const cursor = firstParam(resolvedSearchParams.cursor)
  const { sortKey, reverse } = SORT_MAP[sort]
  const { selectedFilters, productFilters } = parseSelectedFilterParams(
    paramValues(resolvedSearchParams.filter),
  )

  const [collection, initialProductsResult, collectionSummaries] =
    await Promise.all([
      getCollection(handle),
      getCollectionProductsWithFilters(
        handle,
        COLLECTION_PRODUCT_PAGE_SIZE,
        sortKey,
        reverse,
        productFilters,
        category ? null : cursor,
      ),
      getCollectionSummaries(),
    ])

  if (!collection) notFound()

  const sidebarCollections = getSidebarCollections(collectionSummaries)
  const selectedCategoryTag = findCategoryTagForPath(
    category,
    initialProductsResult.filters,
    initialProductsResult.products,
  )
  if (category && !selectedCategoryTag) notFound()

  const activeProductFilters = selectedCategoryTag
    ? [{ tag: selectedCategoryTag }, ...productFilters]
    : productFilters
  const collectionProductsResult = selectedCategoryTag
    ? await getCollectionProductsWithFilters(
        handle,
        COLLECTION_PRODUCT_PAGE_SIZE,
        sortKey,
        reverse,
        activeProductFilters,
        cursor,
      )
    : initialProductsResult
  const activeSelectedFilters = selectedCategoryTag
    ? [getCategoryFilterInput(selectedCategoryTag), ...selectedFilters]
    : selectedFilters
  const clearFiltersHref = getHref(handle, sort)
  const categoryFilter = buildCategoryFilter({
    products: initialProductsResult.products,
    sourceFilter: initialProductsResult.filters.find(isCategoryFilter),
    handle,
    selectedCategoryTag,
    sort,
    selectedFilters,
  })
  const products = filterProductsByCategoryTags(
    collectionProductsResult.products,
    selectedCategoryTag,
  )
  const nextPageHref =
    collectionProductsResult.pageInfo.hasNextPage &&
    collectionProductsResult.pageInfo.endCursor
      ? getPaginationHref({
          category,
          cursor: collectionProductsResult.pageInfo.endCursor,
          handle,
          selectedFilters,
          sort,
        })
      : null
  const visibleFilters = [
    categoryFilter,
    ...collectionProductsResult.filters.filter(
      (filter) =>
        !isVendorFilter(filter) &&
        !isAvailabilityFilter(filter) &&
        !isCategoryFilter(filter),
    ),
  ].filter((filter): filter is CollectionProductFilter => Boolean(filter))
  // bannerImage: art embedded in descriptionHtml → banner hero mode
  const bannerImage = getDescriptionHeroImage(collection.descriptionHtml)
  // heroImage: fallback for the green-band mode (collection featuredImage)
  const heroImage = getHeroImage(
    collection.featuredImage,
    collection.descriptionHtml,
  )

  const collectionPath = category
    ? `${getPath(handle)}/${category}`
    : getPath(handle)
  const collectionUrl = `${SITE_URL}${collectionPath}`
  const heroDescription = cleanHeroDescription(collection.description)
  const richDescriptionHtml = normalizeHtml(collection.descriptionHtml)
  const sanitizedRichDescriptionHtml =
    sanitizeShopifyCompactHtml(richDescriptionHtml)
  const hasRichDescription = shouldRenderRichDescription(
    collection.descriptionHtml,
    collection.description,
  )

  return (
    <>
      <JsonLd
        baseUrl={SITE_URL}
        collection={collection}
        collectionUrl={collectionUrl}
        products={products}
      />

      <Hero
        collectionTitle={collection.title}
        heroDescription={heroDescription}
        heroImage={heroImage}
        bannerImage={bannerImage}
        storyDisclosure={
          hasRichDescription ? (
            <StoryDisclosure
              title={`Read more about ${collection.title}`}
              html={sanitizedRichDescriptionHtml}
            />
          ) : null
        }
      />

      <Section.Root tone="transparent" className="pt-0 md:pt-0">
        <Section.Container>
          <Toolbar
            currentSort={sort}
            productCount={products.length}
            filters={visibleFilters}
            selectedFilters={activeSelectedFilters}
            clearHref={clearFiltersHref}
            className="mb-6"
          />

          <div className="grid gap-10 lg:grid-cols-[252px_1fr] lg:items-start">
            <Sidebar
              activeSelectedFilters={activeSelectedFilters}
              clearFiltersHref={clearFiltersHref}
              handle={handle}
              productsLength={products.length}
              sidebarCollections={sidebarCollections}
              visibleFilters={visibleFilters}
            />

            <ProductList products={products} nextPageHref={nextPageHref} />
          </div>
        </Section.Container>
      </Section.Root>
    </>
  )
}
