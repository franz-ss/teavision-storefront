import { describe, expect, it } from 'vitest'

import { getCollectionSortHref } from './sort-select'

describe('getCollectionSortHref', () => {
  it('drops stale page params when changing sort', () => {
    const href = getCollectionSortHref({
      pathname: '/collections/all',
      searchParams: new URLSearchParams('page=3&filter=%7B%22tag%22%3A%22organic%22%7D'),
      sort: 'price-asc',
    })

    expect(href).toBe(
      '/collections/all?filter=%7B%22tag%22%3A%22organic%22%7D&sort=price-asc',
    )
  })

  it('returns the clean path when featured clears the only remaining param', () => {
    const href = getCollectionSortHref({
      pathname: '/collections/all',
      searchParams: new URLSearchParams('page=2&sort=price-desc'),
      sort: 'featured',
    })

    expect(href).toBe('/collections/all')
  })
})
