import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { BlogLoadingSkeleton } from './loading-skeleton'

describe('BlogLoadingSkeleton', () => {
  it('announces the article loading state and renders configurable placeholders', () => {
    const html = renderToStaticMarkup(
      <BlogLoadingSkeleton articleCount={4} includeHero />,
    )

    expect(html).toContain('role="status"')
    expect(html).toContain('aria-live="polite"')
    expect(html).toContain('Loading articles')
    expect(html).toContain('data-skeleton="blog-hero"')
    expect(html.match(/data-skeleton="featured-article"/g)).toHaveLength(2)
    expect(html.match(/data-skeleton="article"/g)).toHaveLength(4)
    expect(html.match(/data-skeleton="tag"/g)).toHaveLength(5)
  })

  it('can omit the featured section for filtered article views', () => {
    const html = renderToStaticMarkup(
      <BlogLoadingSkeleton articleCount={3} includeFeatured={false} />,
    )

    expect(html).not.toContain('data-skeleton="featured-article"')
    expect(html.match(/data-skeleton="article"/g)).toHaveLength(3)
  })
})
