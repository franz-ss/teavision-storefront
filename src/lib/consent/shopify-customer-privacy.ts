import type { ConsentState } from './adapter'

type ShopifyConsentFeature = {
  name: 'consent-tracking-api'
  version: '0.1'
}

type ShopifyVisitorConsent = {
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

type ShopifyCustomerPrivacyApi = {
  setTrackingConsent?: (
    consent: ShopifyVisitorConsent,
    callback: () => void,
  ) => void
}

type ShopifyBrowserApi = {
  loadFeatures?: (
    features: ShopifyConsentFeature[],
    callback: (error?: unknown) => void,
  ) => void
  customerPrivacy?: ShopifyCustomerPrivacyApi
}

declare global {
  interface Window {
    Shopify?: ShopifyBrowserApi
  }
}

export type ShopifyCustomerPrivacyConsentResult =
  | {
      status: 'applied'
    }
  | {
      status: 'unavailable'
      reason:
        | 'server'
        | 'shopify-missing'
        | 'load-features-missing'
        | 'customer-privacy-missing'
        | 'set-tracking-consent-missing'
    }
  | {
      status: 'failed'
      error: string
    }

function describeUnknownError(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error

  return 'Shopify Customer Privacy API failed to apply consent.'
}

function toShopifyVisitorConsent(
  consent: ConsentState,
): ShopifyVisitorConsent {
  return {
    analytics: consent.analytics,
    marketing: consent.marketing,
    preferences: consent.marketing,
  }
}

export async function applyShopifyCustomerPrivacyConsent(
  consent: ConsentState,
): Promise<ShopifyCustomerPrivacyConsentResult> {
  if (typeof window === 'undefined') {
    return { status: 'unavailable', reason: 'server' }
  }

  const shopify = window.Shopify

  if (!shopify) {
    return { status: 'unavailable', reason: 'shopify-missing' }
  }

  if (!shopify.loadFeatures) {
    return { status: 'unavailable', reason: 'load-features-missing' }
  }

  const loadResult = await new Promise<
    { loaded: true } | { loaded: false; error: unknown }
  >((resolve) => {
    shopify.loadFeatures?.(
      [{ name: 'consent-tracking-api', version: '0.1' }],
      (error) => {
        if (error) {
          resolve({ loaded: false, error })
          return
        }

        resolve({ loaded: true })
      },
    )
  })

  if (!loadResult.loaded) {
    return {
      status: 'failed',
      error: describeUnknownError(loadResult.error),
    }
  }

  const customerPrivacy = window.Shopify?.customerPrivacy

  if (!customerPrivacy) {
    return { status: 'unavailable', reason: 'customer-privacy-missing' }
  }

  if (!customerPrivacy.setTrackingConsent) {
    return { status: 'unavailable', reason: 'set-tracking-consent-missing' }
  }

  return new Promise((resolve) => {
    try {
      customerPrivacy.setTrackingConsent(
        toShopifyVisitorConsent(consent),
        () => {
          resolve({ status: 'applied' })
        },
      )
    } catch (error) {
      resolve({
        status: 'failed',
        error: describeUnknownError(error),
      })
    }
  })
}
