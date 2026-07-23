import { beforeEach, describe, expect, test, vi } from 'vitest'

import robots from './robots'

const { isNoindexModeEnabledMock } = vi.hoisted(() => ({
  isNoindexModeEnabledMock: vi.fn(),
}))

vi.mock('@/lib/seo/noindex', () => ({
  isNoindexModeEnabled: isNoindexModeEnabledMock,
}))

describe('robots sitemap advertisement', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('does not advertise a sitemap while staging remains noindex', () => {
    isNoindexModeEnabledMock.mockReturnValue(true)

    expect(robots()).not.toHaveProperty('sitemap')
  })

  test('advertises the canonical sitemap when indexing is enabled', () => {
    isNoindexModeEnabledMock.mockReturnValue(false)

    expect(robots()).toHaveProperty(
      'sitemap',
      'https://www.teavision.com.au/sitemap.xml',
    )
  })
})
