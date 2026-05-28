import {
  getBlog,
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
  const blogData = await getBlog(normalizedBlog)

  return (
    <Hero
      defaultQuery={q ?? ''}
      description={blogData?.description || undefined}
      image={blogData?.heroImage}
      rssHref={`${blogPath}/atom`}
      searchAction={tag ? getTagPath(normalizedBlog, tag) : blogPath}
      title={blogData?.title}
    />
  )
}
