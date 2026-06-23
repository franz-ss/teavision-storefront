import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  canUseAnalytics,
  canUseMarketing,
  DEFAULT_CONSENT,
  grantOptionalConsent,
  rejectOptionalConsent,
  updateConsentCategories,
} from './adapter'
import {
  CONSENT_STORAGE_KEY,
  parseStoredConsent,
  readStoredConsent,
  writeStoredConsent,
} from './storage'
import { applyShopifyCustomerPrivacyConsent } from './shopify-customer-privacy'

function stubWindowWithStorage(initialValue: string | null = null) {
  const storage = {
    getItem: vi.fn((key: string) =>
      key === CONSENT_STORAGE_KEY ? initialValue : null,
    ),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  } satisfies Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

  vi.stubGlobal('window', {
    localStorage: storage,
  } as unknown as Window & typeof globalThis)

  return storage
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('consent adapter', () => {
  it('denies analytics and marketing by default', () => {
    expect(DEFAULT_CONSENT).toMatchObject({
      essential: true,
      analytics: false,
      marketing: false,
      updatedAt: null,
      version: 1,
    })
    expect(canUseAnalytics(DEFAULT_CONSENT)).toBe(false)
    expect(canUseMarketing(DEFAULT_CONSENT)).toBe(false)
  })

  it('grants both optional categories when accepting optional consent', () => {
    const consent = grantOptionalConsent()

    expect(consent.essential).toBe(true)
    expect(consent.analytics).toBe(true)
    expect(consent.marketing).toBe(true)
    expect(consent.updatedAt).toEqual(expect.any(String))
  })

  it('denies both optional categories when rejecting optional consent', () => {
    const consent = rejectOptionalConsent(grantOptionalConsent())

    expect(consent.essential).toBe(true)
    expect(consent.analytics).toBe(false)
    expect(consent.marketing).toBe(false)
    expect(consent.updatedAt).toEqual(expect.any(String))
  })

  it('keeps essential consent locked on during partial updates', () => {
    const consent = updateConsentCategories({
      essential: false,
      analytics: true,
    })

    expect(consent.essential).toBe(true)
    expect(consent.analytics).toBe(true)
    expect(consent.marketing).toBe(false)
  })
})

describe('consent storage', () => {
  it('rejects malformed stored JSON', () => {
    expect(parseStoredConsent('{bad-json')).toBeNull()
    expect(
      parseStoredConsent(
        JSON.stringify({
          essential: false,
          analytics: true,
          marketing: true,
          updatedAt: null,
          version: 1,
        }),
      ),
    ).toBeNull()
  })

  it('guards browser storage reads when window is unavailable', () => {
    expect(readStoredConsent()).toBeNull()
  })

  it('reads and writes the minimal consent storage shape in the browser', () => {
    const storedConsent = grantOptionalConsent()
    const storage = stubWindowWithStorage(JSON.stringify(storedConsent))

    expect(readStoredConsent()).toEqual(storedConsent)

    const normalized = writeStoredConsent({
      ...storedConsent,
      essential: true,
      analytics: false,
    })

    expect(normalized.essential).toBe(true)
    expect(storage.setItem).toHaveBeenCalledWith(
      CONSENT_STORAGE_KEY,
      JSON.stringify(normalized),
    )
  })
})

describe('Shopify Customer Privacy consent bridge', () => {
  it('returns unavailable when no Shopify browser API exists', async () => {
    stubWindowWithStorage()

    await expect(
      applyShopifyCustomerPrivacyConsent(DEFAULT_CONSENT),
    ).resolves.toEqual({
      status: 'unavailable',
      reason: 'shopify-missing',
    })
  })
})
