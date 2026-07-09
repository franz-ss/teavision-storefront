import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import {
  DEFAULT_BLOG_HANDLE,
  getDefaultBlogListing,
} from '@/lib/blog/operations'

import { DefaultListing } from './_components/default-listing'
import { HeroSlot } from './_components/hero-slot'
import { generateListingMetadata } from './_lib/metadata'

type Props = {
  params: Promise<{ blog: string }>
}

export function generateStaticParams() {
  return [{ blog: DEFAULT_BLOG_HANDLE }]
}

export function generateMetadata(): Promise<Metadata> {
  return generateListingMetadata({ page: 1 })
}

export default async function BlogPage({ params }: Props) {
  // Fetch with the requested handle so unknown blogs 404 instead of rendering
  // the canonical listing at a duplicate URL. Legacy 'journal' is redirected
  // upstream; every other handle returns null here.
  const { blog } = await params
  const listingData = await getDefaultBlogListing(blog, 1)
  if (!listingData) notFound()

  return (
    <>
      <HeroSlot />
      <DefaultListing listingData={listingData} />
    </>
  )
}
