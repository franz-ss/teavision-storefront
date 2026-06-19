import { describe, expect, test } from 'vitest'

import {
  generateCodeChallenge,
  generateCodeVerifier,
  normalizeReturnTo,
} from './oauth'

describe('Customer Account OAuth helpers', () => {
  test('generates PKCE verifier and S256 challenge values', () => {
    const verifier = generateCodeVerifier()
    const challenge = generateCodeChallenge(verifier)

    expect(verifier.length).toBeGreaterThan(40)
    expect(challenge).toMatch(/^[A-Za-z0-9_-]+$/)
    expect(challenge).not.toBe(verifier)
  })

  test('normalizes unsafe returnTo values to the account route', () => {
    expect(normalizeReturnTo(null)).toBe('/account')
    expect(normalizeReturnTo('')).toBe('/account')
    expect(normalizeReturnTo('https://example.com')).toBe('/account')
    expect(normalizeReturnTo('returnTo=https://example.com')).toBe('/account')
    expect(normalizeReturnTo('//example.com/account')).toBe('/account')
    expect(normalizeReturnTo('/collections/all')).toBe('/account')
    expect(normalizeReturnTo('/account/orders')).toBe('/account/orders')
    expect(normalizeReturnTo('/cart')).toBe('/cart')
    expect(normalizeReturnTo('/checkout')).toBe('/checkout')
  })
})
