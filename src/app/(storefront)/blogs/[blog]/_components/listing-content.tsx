import { notFound } from 'next/navigation'

import { ArticleResults, FeaturedArticles } from '@/components/blog'
import { NewsletterSignup, Section } from '@/components/ui'
import { parseListingPage } from '@/lib/blog/listing'
import {
  filterArticles,
  findTagBySlug,
  getBlog,
  getFeaturedArticles,
  getUniqueArticleTags,
  normalizeBlogHandle,
  paginateArticles,
} from '@/lib/blog/operations'
import { sendNewsletterSignupAction } from '@/lib/contact/actions'

import type { ListingProps } from '../_lib/types'

export async function ListingContent({ params, searchParams }: ListingProps) {
  const [{ blog, tag }, { page, q }] = await Promise.all([params, searchParams])
  const normalizedBlog = normalizeBlogHandle(blog)
  const blogData = await getBlog(normalizedBlog)
  if (!blogData) notFound()

  const tags = getUniqueArticleTags(blogData.articles)
  const activeTag = findTagBySlug(tags, tag)
  if (tag && !activeTag) notFound()

  const featuredArticles = getFeaturedArticles(
    blogData.articles,
    blogData.featuredArticles,
  )
  const featuredIds = new Set(featuredArticles.map((article) => article.id))
  const filteredArticles = filterArticles({
    articles: blogData.articles,
    activeTag,
    query: q,
  })
  const normalizedQuery = q?.trim() ?? ''
  const isFiltered = Boolean(activeTag || normalizedQuery)
  const mainArticles = isFiltered
    ? filteredArticles
    : filteredArticles.filter((article) => !featuredIds.has(article.id))
  const paginated = paginateArticles({
    articles: mainArticles,
    page: parseListingPage(page),
  })
  const articleGridHeading = activeTag
    ? `${activeTag} Articles`
    : normalizedQuery
      ? 'Search Results'
      : 'Latest Articles'

  return (
    <>
      {!isFiltered && featuredArticles.length > 0 && (
        <FeaturedArticles
          articles={featuredArticles}
          blogHandle={normalizedBlog}
        />
      )}

      <ArticleResults
        activeTag={activeTag}
        blogHandle={normalizedBlog}
        heading={articleGridHeading}
        paginated={paginated}
        query={q}
        tags={tags}
      />

      <Section.Root tone="sunken">
        <Section.Container variant="compact">
          <NewsletterSignup action={sendNewsletterSignupAction} />
        </Section.Container>
      </Section.Root>
    </>
  )
}
