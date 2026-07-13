import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import {
  DEFAULT_BLOG_HANDLE,
  getDefaultBlogListing,
} from '@/lib/blog/operations'

import { DefaultListing } from '../blogs/[blog]/_components/default-listing'
import { HeroSlot } from '../blogs/[blog]/_components/hero-slot'
import { generateListingMetadata } from '../blogs/[blog]/_lib/metadata'

export function generateMetadata(): Promise<Metadata> {
  return generateListingMetadata({ page: 1 })
}

export default async function Page() {
  const listingData = await getDefaultBlogListing(DEFAULT_BLOG_HANDLE, 1)
  if (!listingData) notFound()

  return (
    <>
      <HeroSlot />
      <DefaultListing listingData={listingData} />
    </>
  )
}
