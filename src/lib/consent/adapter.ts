export type ConsentCategory = 'essential' | 'analytics' | 'marketing'

export type ConsentState = {
  essential: true
  analytics: boolean
  marketing: boolean
  updatedAt: string | null
  version: 1
}

export type ConsentCategoryUpdates = Partial<
  Record<ConsentCategory, boolean>
>

export const DEFAULT_CONSENT: ConsentState = {
  essential: true,
  analytics: false,
  marketing: false,
  updatedAt: null,
  version: 1,
}

function consentTimestamp(): string {
  return new Date().toISOString()
}

export function isConsentState(value: unknown): value is ConsentState {
  if (!value || typeof value !== 'object') return false

  const candidate = value as Record<string, unknown>

  return (
    candidate.version === 1 &&
    candidate.essential === true &&
    typeof candidate.analytics === 'boolean' &&
    typeof candidate.marketing === 'boolean' &&
    (typeof candidate.updatedAt === 'string' || candidate.updatedAt === null)
  )
}

export function updateConsentCategories(
  updates: ConsentCategoryUpdates,
  current: ConsentState = DEFAULT_CONSENT,
): ConsentState {
  return {
    essential: true,
    analytics: updates.analytics ?? current.analytics,
    marketing: updates.marketing ?? current.marketing,
    updatedAt: consentTimestamp(),
    version: 1,
  }
}

export function grantOptionalConsent(
  current: ConsentState = DEFAULT_CONSENT,
): ConsentState {
  return updateConsentCategories(
    {
      analytics: true,
      marketing: true,
    },
    current,
  )
}

export function rejectOptionalConsent(
  current: ConsentState = DEFAULT_CONSENT,
): ConsentState {
  return updateConsentCategories(
    {
      analytics: false,
      marketing: false,
    },
    current,
  )
}

export function canUseAnalytics(consent: ConsentState): boolean {
  return consent.analytics
}

export function canUseMarketing(consent: ConsentState): boolean {
  return consent.marketing
}
