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
import { withNoindexRobots } from '@/lib/seo/noindex'

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
  const canonical =
    !activeTag && currentPage === 1 && blogData.seo.canonicalPath
      ? blogData.seo.canonicalPath
      : getListingHref({
          blogHandle: normalizedBlog,
          activeTag,
          query: null,
          page: currentPage,
        })
  const noIndex =
    blogData.seo.noIndex || Boolean(activeTag) || Boolean(q?.trim())

  return withNoindexRobots({
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: blogData.seo.ogImage
        ? [
            {
              url: blogData.seo.ogImage.url,
              alt: blogData.seo.ogImage.altText ?? title,
            },
          ]
        : undefined,
    },
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: !blogData.seo.noIndex }
      : undefined,
  })
}
