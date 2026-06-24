import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { CartLoadingSkeleton } from './loading-skeleton'

describe('CartLoadingSkeleton', () => {
  it('matches the compact empty-cart shell while cart content streams', () => {
    const html = renderToStaticMarkup(<CartLoadingSkeleton />)

    expect(html).toContain('role="status"')
    expect(html).toContain('min-h-72')
    expect(html).toContain('Checking your cart')
    expect(html).toContain('Preparing your cart details.')
    expect(html).not.toContain('Loading cart')
    expect(html).not.toContain('xl:grid-cols-[minmax(0,1fr)_22rem]')
    expect(html).not.toContain('aria-label="Loading cart items"')
    expect(html).not.toContain('fixed inset-x-0 bottom-0')
  })
})
