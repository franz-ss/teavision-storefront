import type { Metadata } from 'next'

import { BlogListingPage, generateBlogListingMetadata } from './blog-listing'

type Props = {
  params: Promise<{ blog: string }>
  searchParams: Promise<{ page?: string; q?: string }>
}

export function generateMetadata(props: Props): Promise<Metadata> {
  return generateBlogListingMetadata(props)
}

export default function BlogPage(props: Props) {
  return <BlogListingPage {...props} />
}
