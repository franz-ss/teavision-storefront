import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'

import { StoryDisclosure, Toolbar } from '@/components/collection'
import { Section } from '@/components/ui'
import { SITE_URL } from '@/lib/seo/site-url'
import { sanitizeShopifyCompactHtml } from '@/lib/shopify/html-content'
import {
  COLLECTION_PRODUCT_PAGE_SIZE,
  getCollection,
  getCollectionPageIndex,
  getCollectionProductsPage,
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
  parseCollectionRichHero,
  parsePageParam,
  parseSelectedFilterParams,
  shouldRenderRichDescription,
  SORT_MAP,
} from '../_lib/page-helpers'
import type { PageProps } from '../_lib/page-types'
import { CollectionRichHero } from './collection-rich-hero'
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
  const page = parsePageParam(resolvedSearchParams.page)
  const { sortKey, reverse } = SORT_MAP[sort]
  const { selectedFilters, productFilters } = parseSelectedFilterParams(
    paramValues(resolvedSearchParams.filter),
  )

  // Resolve category tag and validate from initial (no-cursor) products fetch
  // We need filters for category tag lookup — fetch page 1 without cursor for filter metadata
  const [collection, initialProductsResult, collectionSummaries] =
    await Promise.all([
      getCollection(handle),
      getCollectionProductsPage(
        handle,
        1,
        COLLECTION_PRODUCT_PAGE_SIZE,
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
    initialProductsResult.filters,
    initialProductsResult.products,
  )
  if (category && !selectedCategoryTag) notFound()

  const activeProductFilters = selectedCategoryTag
    ? [{ tag: selectedCategoryTag }, ...productFilters]
    : productFilters
  const activeSelectedFilters = selectedCategoryTag
    ? [getCategoryFilterInput(selectedCategoryTag), ...selectedFilters]
    : selectedFilters

  // Get cursor index for true total pages and resolve the requested page
  const pageIndex = await getCollectionPageIndex(
    handle,
    COLLECTION_PRODUCT_PAGE_SIZE,
    sortKey,
    reverse,
    activeProductFilters,
  )

  // Redirect out-of-range pages to last valid page (D-24)
  if (page > pageIndex.totalPages && pageIndex.totalPages > 0) {
    const lastPageHref = getPaginationHref({
      category,
      handle,
      page: pageIndex.totalPages,
      selectedFilters: activeSelectedFilters,
      sort,
    })
    redirect(lastPageHref)
  }

  // Fetch the actual products for this page
  const collectionProductsResult =
    page === 1 && !selectedCategoryTag
      ? initialProductsResult
      : await getCollectionProductsPage(
          handle,
          page,
          COLLECTION_PRODUCT_PAGE_SIZE,
          sortKey,
          reverse,
          activeProductFilters,
        )

  // Stale-cursor fallback: if page is within range but returns empty/short, redirect to last valid page (D-22)
  if (
    collectionProductsResult.products.length === 0 &&
    page > 1 &&
    pageIndex.totalPages > 0
  ) {
    const lastPageHref = getPaginationHref({
      category,
      handle,
      page: pageIndex.totalPages,
      selectedFilters: activeSelectedFilters,
      sort,
    })
    redirect(lastPageHref)
  }

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

  const totalPages = pageIndex.totalPages
  const currentPage = page
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
  const richHero = parseCollectionRichHero(collection.descriptionHtml)

  // Prev/next link tags for adjacent pages — hoisted to <head> by React 19 (D-05)
  // The Next 16 Metadata API has no prev/next field, so we render them as JSX links.
  const prevPageHref =
    currentPage > 1
      ? `${SITE_URL}${getPaginationHref({ category, handle, page: currentPage - 1, selectedFilters: activeSelectedFilters, sort })}`
      : null
  const nextPageHref =
    currentPage < totalPages
      ? `${SITE_URL}${getPaginationHref({ category, handle, page: currentPage + 1, selectedFilters: activeSelectedFilters, sort })}`
      : null

  return (
    <>
      {prevPageHref && <link rel="prev" href={prevPageHref} />}
      {nextPageHref && <link rel="next" href={nextPageHref} />}

      <JsonLd
        baseUrl={SITE_URL}
        collection={collection}
        collectionUrl={collectionUrl}
        products={products}
      />

      {richHero ? (
        <CollectionRichHero richHero={richHero} />
      ) : (
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
      )}

      <Section.Root tone="transparent" className="pt-8 md:pt-10">
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

            <ProductList
              clearFiltersHref={clearFiltersHref}
              currentPage={currentPage}
              totalPages={totalPages}
              buildPageHref={(p) =>
                getPaginationHref({
                  category,
                  handle,
                  page: p,
                  selectedFilters: activeSelectedFilters,
                  sort,
                })
              }
              products={products}
            />
          </div>
        </Section.Container>
      </Section.Root>
    </>
  )
}
