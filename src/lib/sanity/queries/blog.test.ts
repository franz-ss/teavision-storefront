import { describe, expect, it } from 'vitest'

import {
  blogListingQuery,
  defaultBlogListingQuery,
  sanityBlogPostSummaryLightFields,
} from './blog'

describe('defaultBlogListingQuery', () => {
  it('uses the light article projection without body text', () => {
    expect(sanityBlogPostSummaryLightFields).not.toContain('pt::text(body)')
    expect(sanityBlogPostSummaryLightFields).not.toContain('bodyText')
  })

  it('keeps featured-post exclusion null-safe for articles and total count', () => {
    const coalesceRefList =
      'coalesce(*[_type == "blog" && slug.current == $blogHandle][0].featuredPosts[]._ref, [])'

    expect(
      defaultBlogListingQuery.match(
        new RegExp(coalesceRefList.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      ),
    ).toHaveLength(2)
    expect(defaultBlogListingQuery).not.toContain(
      '!(_id in *[_type == "blog" && slug.current == $blogHandle][0].featuredPosts[]._ref)',
    )
  })

  it('filters light featured posts to published posts with slugs only', () => {
    expect(defaultBlogListingQuery).toContain(
      '}[defined(slug) && publishedAt <= now()]',
    )
    expect(blogListingQuery).not.toContain(
      '}[defined(slug) && publishedAt <= now()]',
    )
  })
})
