import {
  getBlogPath,
  getTagPath,
  normalizeBlogHandle,
} from '@/lib/blog/operations'
import { Hero } from '@/components/blog/hero'

import type { ListingProps } from '../_lib/types'

export async function HeroSlot({ params, searchParams }: ListingProps) {
  const [{ blog, tag }, { q }] = await Promise.all([params, searchParams])
  const normalizedBlog = normalizeBlogHandle(blog)
  const blogPath = getBlogPath(normalizedBlog)

  return (
    <Hero
      defaultQuery={q ?? ''}
      rssHref={`${blogPath}/atom`}
      searchAction={tag ? getTagPath(normalizedBlog, tag) : blogPath}
    />
  )
}
