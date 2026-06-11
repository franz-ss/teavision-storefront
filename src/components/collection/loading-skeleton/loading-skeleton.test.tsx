import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { LoadingSkeleton } from './loading-skeleton'

describe('LoadingSkeleton', () => {
  it('announces loading state and renders configurable placeholders', () => {
    const html = renderToStaticMarkup(
      <LoadingSkeleton productCount={4} sidebarRowCount={3} />,
    )

    expect(html).toContain('role="status"')
    expect(html).toContain('aria-live="polite"')
    expect(html).toContain('Loading collection')
    expect(html).toContain('data-skeleton="hero"')
    expect(html).toContain('data-skeleton="story-disclosure"')
    expect(html.match(/data-skeleton="product"/g)).toHaveLength(4)
    expect(html.match(/data-skeleton="sidebar"/g)).toHaveLength(3)
  })
})
