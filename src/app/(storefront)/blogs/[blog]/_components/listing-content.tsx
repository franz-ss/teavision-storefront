import { notFound } from 'next/navigation'

import { ArticleResults, FeaturedArticles } from '@/components/blog'
import { ContactSection } from '@/components/contact'
import { parseListingPage } from '@/lib/blog/listing'
import {
  filterArticles,
  findTagBySlug,
  getBlog,
  getDefaultBlogListing,
  getUniqueArticleTags,
  normalizeBlogHandle,
  paginateArticles,
} from '@/lib/blog/operations'
import { submitContactFormAction } from '@/lib/contact/actions'

import type { ListingProps } from '../_lib/types'
import { BlogNewsletterBand } from './blog-newsletter-band'

export async function ListingContent({ params, searchParams }: ListingProps) {
  const [{ blog, tag }, { page, q }] = await Promise.all([params, searchParams])
  const normalizedBlog = normalizeBlogHandle(blog)
  const normalizedQuery = q?.trim() ?? ''
  const isFiltered = Boolean(tag || normalizedQuery)

  // Use the light default-listing path for the unfiltered default listing.
  // Tag pages and search queries keep the full getBlog() path for in-memory filtering.
  if (!isFiltered) {
    const currentPage = parseListingPage(page)
    const listingData = await getDefaultBlogListing(normalizedBlog, currentPage)
    if (!listingData) notFound()

    const articleGridHeading = 'Latest Articles'

    return (
      <>
        {listingData.featuredArticles.length > 0 && (
          <FeaturedArticles
            articles={listingData.featuredArticles}
            blogHandle={normalizedBlog}
          />
        )}

        <ArticleResults
          activeTag={null}
          blogHandle={normalizedBlog}
          heading={articleGridHeading}
          paginated={listingData.paginated}
          query={null}
          tags={listingData.allTags}
          className={
            listingData.featuredArticles.length > 0 ? 'pt-0' : undefined
          }
        />

        <BlogNewsletterBand />
        <ContactSection action={submitContactFormAction} />
      </>
    )
  }

  // Filtered path: tag pages and ?q= search use the full getBlog() result
  // for in-memory filtering, counting, and pagination.
  const blogData = await getBlog(normalizedBlog)
  if (!blogData) notFound()

  const tags = getUniqueArticleTags(blogData.articles)
  const activeTag = findTagBySlug(tags, tag)
  if (tag && !activeTag) notFound()

  const filteredArticles = filterArticles({
    articles: blogData.articles,
    activeTag,
    query: q,
  })
  const paginated = paginateArticles({
    articles: filteredArticles,
    page: parseListingPage(page),
  })
  const articleGridHeading = activeTag
    ? `${activeTag} Articles`
    : 'Search Results'

  return (
    <>
      <ArticleResults
        activeTag={activeTag}
        blogHandle={normalizedBlog}
        heading={articleGridHeading}
        paginated={paginated}
        query={q}
        tags={tags}
      />

      <BlogNewsletterBand />
      <ContactSection action={submitContactFormAction} />
    </>
  )
}
