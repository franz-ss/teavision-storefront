import type { Metadata } from 'next'

import {
  BlogListingPage,
  generateBlogListingMetadata,
} from '../../blog-listing'

type Props = {
  params: Promise<{ blog: string; tag: string }>
  searchParams: Promise<{ page?: string; q?: string }>
}

export function generateMetadata(props: Props): Promise<Metadata> {
  return generateBlogListingMetadata(props)
}

export default function TaggedBlogPage(props: Props) {
  return <BlogListingPage {...props} />
}
