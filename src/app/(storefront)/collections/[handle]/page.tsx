import type { Metadata } from 'next'
import { Suspense } from 'react'

import { withNoindexRobots } from '@/lib/seo/noindex'
import {
  getCollection,
  getCollections,
} from '@/lib/shopify/operations/collection'

import { PageContent } from './_components/page-content'
import {
  getHeroImage,
  getPath,
  truncateMetaDescription,
} from './_lib/page-helpers'
import type { PageProps, SearchParams } from './_lib/page-types'

function hasSearchParamValue(value?: string | string[]) {
  return Array.isArray(value)
    ? value.some((item) => item.trim().length > 0)
    : Boolean(value?.trim())
}

function hasCollectionSearchParams(searchParams: SearchParams) {
  return (
    hasSearchParamValue(searchParams.filter) ||
    hasSearchParamValue(searchParams.page) ||
    hasSearchParamValue(searchParams.sort)
  )
}

export async function generateStaticParams(): Promise<
  Array<{ handle: string }>
> {
  const handles = await getCollections()

  return handles.map((handle) => ({ handle }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { handle } = await params
  const collection = await getCollection(handle)
  if (!collection) return withNoindexRobots({ title: 'Collection not found' })
  const description = truncateMetaDescription(
    collection.seo.description ??
      collection.description ??
      `Browse ${collection.title} from Teavision, Australia's bulk tea and herb supplier.`,
  )
  const title = collection.seo.title ?? collection.title
  // Canonical always points at the base collection (not paginated URL, not category URL — D-03, D-27)
  const canonicalPath = getPath(handle)
  const heroImage = getHeroImage(
    collection.featuredImage,
    collection.descriptionHtml,
  )

  return withNoindexRobots({
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      url: canonicalPath,
      images: heroImage
        ? [
            {
              url: heroImage.url,
              alt: heroImage.altText ?? collection.title,
            },
          ]
        : undefined,
    },
    alternates: { canonical: canonicalPath },
  })
}

export default function Page({ params, searchParams }: PageProps) {
  return (
    <Suspense
      fallback={
        <PageContent params={params} searchParams={Promise.resolve({})} />
      }
    >
      {searchParams.then((resolvedSearchParams) =>
        hasCollectionSearchParams(resolvedSearchParams) ? (
          <PageContent
            params={params}
            searchParams={Promise.resolve(resolvedSearchParams)}
          />
        ) : null,
      )}
    </Suspense>
  )
}
