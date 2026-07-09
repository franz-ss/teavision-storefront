import { notFound } from 'next/navigation'

import { getBlogSearchListing } from '@/lib/blog/operations'

import { ListingResults } from '../../_components/listing-results'

type SearchResultsProps = {
  blog: string
  searchParams: Promise<{ q?: string }>
}

export async function SearchResults({ blog, searchParams }: SearchResultsProps) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  const listing = await getBlogSearchListing(blog, query)
  if (!listing) notFound()

  return (
    <ListingResults
      activeTag={null}
      heading="Search Results"
      paginated={listing.paginated}
      query={query || null}
      tags={listing.tags}
    />
  )
}
