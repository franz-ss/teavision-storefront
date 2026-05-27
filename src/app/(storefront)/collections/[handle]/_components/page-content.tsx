import { notFound } from 'next/navigation'

import { StoryDisclosure, Toolbar } from '@/components/collection'
import { Section } from '@/components/ui'
import { sanitizeShopifyCompactHtml } from '@/lib/shopify/html-content'
import {
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
  getHeroImage,
  getHref,
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
  const clearFiltersHref = getHref(handle, sort)
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
        !isVendorFilter(filter) &&
        !isAvailabilityFilter(filter) &&
        !isCategoryFilter(filter),
    ),
  ].filter((filter): filter is CollectionProductFilter => Boolean(filter))
  const heroImage = getHeroImage(
    handle,
    collection.featuredImage,
    collection.descriptionHtml,
    collection.title,
  )

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://teavision.com.au'
  const collectionPath = category
    ? `${getPath(handle)}/${category}`
    : getPath(handle)
  const collectionUrl = `${baseUrl}${collectionPath}`
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
        baseUrl={baseUrl}
        collection={collection}
        collectionUrl={collectionUrl}
        products={products}
      />

      <Hero
        collectionTitle={collection.title}
        heroDescription={heroDescription}
        heroImage={heroImage}
      />

      <div className="bg-canvas w-full max-w-full overflow-x-hidden">
        {hasRichDescription && (
          <Section.Root
            tone="surface"
            spacing="compact"
            className="border-default border-b"
          >
            <Section.Container>
              <StoryDisclosure
                title={`Read more about ${collection.title}`}
                html={sanitizedRichDescriptionHtml}
                className="max-w-4xl"
              />
            </Section.Container>
          </Section.Root>
        )}

        <Section.Root tone="transparent" aria-labelledby="products-heading">
          <Section.Container>
            <Toolbar
              headingId="products-heading"
              currentSort={sort}
              productCount={products.length}
              filters={visibleFilters}
              selectedFilters={activeSelectedFilters}
              clearHref={clearFiltersHref}
              className="mb-8"
            />

            <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
              <Sidebar
                activeSelectedFilters={activeSelectedFilters}
                clearFiltersHref={clearFiltersHref}
                handle={handle}
                productsLength={products.length}
                sidebarCollections={sidebarCollections}
                visibleFilters={visibleFilters}
              />

              <ProductList products={products} />
            </div>
          </Section.Container>
        </Section.Root>
      </div>
    </>
  )
}
