import type { Metadata } from 'next'

import { withNoindexRobots } from '@/lib/seo/noindex'
import { getCollection } from '@/lib/shopify/operations/collection'

import { PageContent } from './_components/page-content'
import {
  getHeroImage,
  getPath,
  truncateMetaDescription,
} from './_lib/page-helpers'
import type { PageProps } from './_lib/page-types'

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { handle, category } = await params
  const collection = await getCollection(handle)
  if (!collection) return withNoindexRobots({ title: 'Collection not found' })
  const description = truncateMetaDescription(
    collection.seo.description ??
      collection.description ??
      `Browse ${collection.title} from Teavision, Australia's bulk tea and herb supplier.`,
  )
  const title = collection.seo.title ?? collection.title
  const collectionPath = category
    ? `${getPath(handle)}/${category}`
    : getPath(handle)
  const heroImage = getHeroImage(
    collection.featuredImage,
    collection.descriptionHtml,
  )

  return withNoindexRobots({
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
  })
}

export default function Page({ params, searchParams }: PageProps) {
  return <PageContent params={params} searchParams={searchParams} />
}
