import type { Metadata } from 'next'

import { ListingPage } from '../../_components/listing-page'
import { generateListingMetadata } from '../../_lib/metadata'

type Props = {
  params: Promise<{ blog: string; tag: string }>
  searchParams: Promise<{ page?: string; q?: string }>
}

export function generateMetadata(props: Props): Promise<Metadata> {
  return generateListingMetadata(props)
}

export default function TaggedBlogPage(props: Props) {
  return <ListingPage {...props} />
}
