import type { Metadata } from 'next'

import {
  DEFAULT_LISTING_DESCRIPTION,
  getListingHref,
  parseListingPage,
} from '@/lib/blog/listing'
import {
  findTagBySlug,
  getBlog,
  getUniqueArticleTags,
  normalizeBlogHandle,
} from '@/lib/blog/operations'

import type { ListingProps } from './types'

export async function generateListingMetadata({
  params,
  searchParams,
}: ListingProps): Promise<Metadata> {
  const [{ blog, tag }, { page, q }] = await Promise.all([params, searchParams])
  const normalizedBlog = normalizeBlogHandle(blog)
  const blogData = await getBlog(normalizedBlog)
  if (!blogData) return { title: 'Tea Journal' }

  const tags = getUniqueArticleTags(blogData.articles)
  const activeTag = findTagBySlug(tags, tag)
  const currentPage = parseListingPage(page)
  const titleParts = [
    activeTag ? `${blogData.title}: ${activeTag}` : blogData.seo.title,
    currentPage > 1 ? `Page ${currentPage}` : null,
  ].filter((part): part is string => Boolean(part))
  const title = titleParts.join(' | ') || blogData.title
  const description = blogData.seo.description ?? DEFAULT_LISTING_DESCRIPTION
  const canonical = getListingHref({
    blogHandle: normalizedBlog,
    activeTag,
    query: null,
    page: currentPage,
  })

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
    },
    alternates: { canonical },
    robots: q?.trim() ? { index: false, follow: true } : undefined,
  }
}
