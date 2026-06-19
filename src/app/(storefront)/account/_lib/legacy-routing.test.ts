import { describe, expect, it } from 'vitest'

import {
  getLegacyAccountBridgeCopy,
  getLegacyAccountLoginStartHref,
  normalizeLegacyAccountReturn,
} from './legacy-routing'

describe('normalizeLegacyAccountReturn', () => {
  it('falls back to account for unsafe or unsupported return values', () => {
    expect(normalizeLegacyAccountReturn(null)).toBe('/account')
    expect(normalizeLegacyAccountReturn('https://evil.example')).toBe(
      '/account',
    )
    expect(normalizeLegacyAccountReturn('//evil.example/account')).toBe(
      '/account',
    )
    expect(normalizeLegacyAccountReturn('{{ customer.reset_password_url }}')).toBe(
      '/account',
    )
    expect(normalizeLegacyAccountReturn('/collections/all')).toBe('/account')
  })

  it('preserves supported same-origin account, cart, and checkout paths', () => {
    expect(normalizeLegacyAccountReturn('/cart')).toBe('/cart')
    expect(normalizeLegacyAccountReturn('%2Fcheckout')).toBe('/checkout')
    expect(normalizeLegacyAccountReturn('/account/orders')).toBe(
      '/account/orders',
    )
  })
})

describe('getLegacyAccountLoginStartHref', () => {
  it('uses only allowed legacy parameter names for return context', () => {
    expect(getLegacyAccountLoginStartHref({ redirect: '/cart' })).toBe(
      '/account/login/start?returnTo=%2Fcart',
    )
    expect(
      getLegacyAccountLoginStartHref({
        next: '/cart',
        returnTo: 'https://evil.example',
      }),
    ).toBe('/account/login/start?returnTo=%2Faccount')
  })
})

describe('getLegacyAccountBridgeCopy', () => {
  it('maps classic account routes to explanatory modern-account copy', () => {
    expect(getLegacyAccountBridgeCopy(['register'])).toMatchObject({
      heading: 'Create your account with Shopify',
      primaryHref: '/account/login/start?returnTo=%2Faccount',
    })
    expect(getLegacyAccountBridgeCopy(['recover']).body).toContain(
      'password recovery',
    )
    expect(getLegacyAccountBridgeCopy(['unknown', 'route']).body).toContain(
      'classic account link',
    )
  })
})
