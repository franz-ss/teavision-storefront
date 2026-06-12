import type { Metadata } from 'next'

import { withNoindexRobots } from '@/lib/seo/noindex'
import { getCollection } from '@/lib/shopify/operations/collection'

import { PageContent } from './_components/page-content'
import {
  getHeroImage,
  getPath,
  parsePageParam,
  truncateMetaDescription,
} from './_lib/page-helpers'
import type { PageProps } from './_lib/page-types'

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const [{ handle }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ])
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
  // ?page=1 normalises to the clean URL (omit from metadata)
  const currentPage = parsePageParam(resolvedSearchParams.page)

  return withNoindexRobots({
    title,
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
    // Suppress page=1 from the URL: the clean collection URL IS page 1
    ...(currentPage === 1 && {}),
  })
}

export default function Page({ params, searchParams }: PageProps) {
  return <PageContent params={params} searchParams={searchParams} />
}
