import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'

import { parseListingPage } from '@/lib/blog/listing'
import {
  DEFAULT_BLOG_HANDLE,
  getCanonicalBlogListingPath,
  getDefaultBlogListing,
} from '@/lib/blog/operations'

import { DefaultListing } from '../../_components/default-listing'
import { HeroSlot } from '../../_components/hero-slot'
import { generateListingMetadata } from '../../_lib/metadata'

type Props = {
  params: Promise<{ blog: string; page: string }>
}

// Statically generate every real page (2..N). Page 1 lives at the bare listing
// path, so it is intentionally excluded here.
export async function generateStaticParams() {
  const listing = await getDefaultBlogListing(DEFAULT_BLOG_HANDLE, 1)
  const totalPages = listing?.paginated.totalPages ?? 1

  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
    blog: DEFAULT_BLOG_HANDLE,
    page: String(index + 2),
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params
  return generateListingMetadata({ page: parseListingPage(page) })
}

export default async function BlogPaginationPage({ params }: Props) {
  const { blog, page } = await params
  const pageNumber = parseListingPage(page)
  if (pageNumber <= 1) redirect(getCanonicalBlogListingPath(blog))

  const listingData = await getDefaultBlogListing(blog, pageNumber)
  if (!listingData || pageNumber > listingData.paginated.totalPages) notFound()

  return (
    <>
      <HeroSlot />
      <DefaultListing listingData={listingData} />
    </>
  )
}
