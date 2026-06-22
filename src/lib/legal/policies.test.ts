import { describe, expect, test } from 'vitest'

import {
  LEGAL_POLICIES,
  getFooterLegalLinks,
  getPolicyRedirects,
  isLegalPolicyHandle,
} from './policies'

const CANONICAL_HREFS = [
  '/pages/privacy-policy',
  '/pages/shipping-policy',
  '/pages/refund-policy',
  '/pages/terms-of-service',
  '/pages/cookie-preferences',
]

const FOOTER_LABELS = [
  'Privacy Policy',
  'Shipping Policy',
  'Refund Policy',
  'Terms of Service',
  'Cookie Preferences',
]

describe('legal policy registry', () => {
  test('contains the launch canonical policy hrefs', () => {
    expect(LEGAL_POLICIES.map((policy) => policy.href)).toEqual(
      CANONICAL_HREFS,
    )
  })

  test('returns all footer legal labels from the registry', () => {
    expect(getFooterLegalLinks()).toEqual(
      FOOTER_LABELS.map((label, index) => ({
        href: CANONICAL_HREFS[index],
        label,
      })),
    )
  })

  test('keeps redirect sources unique', () => {
    const sources = getPolicyRedirects().map((redirect) => redirect.source)

    expect(new Set(sources).size).toBe(sources.length)
  })

  test('narrows legal policy handles', () => {
    expect(isLegalPolicyHandle('privacy-policy')).toBe(true)
    expect(isLegalPolicyHandle('wholesale')).toBe(false)
  })
})
