import { describe, expect, it } from 'vitest'

import { getShopifyImageUrl, getSizedShopifyImageUrl } from './image-url'

describe('getShopifyImageUrl', () => {
  it('adds transform params to Shopify-style absolute URLs', () => {
    expect(
      getShopifyImageUrl('https://cdn.shopify.com/test.jpg', { width: 640 }),
    ).toBe('https://cdn.shopify.com/test.jpg?width=640')
  })

  it('leaves local fake-provider images query-free for Next local image validation', () => {
    expect(
      getSizedShopifyImageUrl('/images/homepage/bulk-wholesale.jpg', 640),
    ).toBe('/images/homepage/bulk-wholesale.jpg')
  })
})
