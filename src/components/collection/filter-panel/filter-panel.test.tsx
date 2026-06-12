import { describe, expect, it } from 'vitest'

import { getCollectionFilterHref } from './filter-panel'

describe('getCollectionFilterHref', () => {
  it('drops stale page params when replacing filters', () => {
    const organicInput = JSON.stringify({ tag: 'organic' })
    const href = getCollectionFilterHref({
      pathname: '/collections/all',
      searchParams: new URLSearchParams('page=4&sort=price-asc'),
      filters: [organicInput],
    })

    expect(href).toBe(
      `/collections/all?sort=price-asc&filter=${encodeURIComponent(organicInput)}`,
    )
  })

  it('returns the clean path when clearing the only selected filters', () => {
    const href = getCollectionFilterHref({
      pathname: '/collections/all',
      searchParams: new URLSearchParams('page=2&filter=%7B%22tag%22%3A%22organic%22%7D'),
      filters: [],
    })

    expect(href).toBe('/collections/all')
  })
})
