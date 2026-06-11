import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { CartLoadingSkeleton } from './cart-loading-skeleton'

describe('CartLoadingSkeleton', () => {
  it('matches the filled cart layout while cart content streams', () => {
    const html = renderToStaticMarkup(<CartLoadingSkeleton />)

    expect(html).toContain('role="status"')
    expect(html).toContain('Loading cart')
    expect(html).toContain('xl:grid-cols-[minmax(0,1fr)_22rem]')
    expect(html).toContain('aria-label="Loading cart items"')
    expect(html).toContain('aria-label="Loading checkout form"')
    expect(html).toContain('aria-label="Loading order summary"')
    expect(html).not.toContain('aria-label="Loading mobile checkout"')
    expect(html).toContain('xl:sticky xl:top-24')
    expect(html).not.toContain('fixed inset-x-0 bottom-0')
  })
})
