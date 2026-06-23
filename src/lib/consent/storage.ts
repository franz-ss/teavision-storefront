import {
  type ConsentState,
  DEFAULT_CONSENT,
  isConsentState,
} from './adapter'

export const CONSENT_STORAGE_KEY = 'teavision_consent'
export const CONSENT_CHANGED_EVENT = 'teavision:consent-changed'

export function parseStoredConsent(value: string | null): ConsentState | null {
  if (!value) return null

  try {
    const parsed: unknown = JSON.parse(value)

    return isConsentState(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function readStoredConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null

  try {
    return parseStoredConsent(window.localStorage.getItem(CONSENT_STORAGE_KEY))
  } catch {
    return null
  }
}

export function writeStoredConsent(consent: ConsentState): ConsentState {
  const normalized: ConsentState = {
    ...DEFAULT_CONSENT,
    ...consent,
    essential: true,
    version: 1,
  }

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify(normalized),
      )
    } catch {}

    if (typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(
        new CustomEvent<ConsentState>(CONSENT_CHANGED_EVENT, {
          detail: normalized,
        }),
      )
    }
  }

  return normalized
}

export function clearStoredConsent(): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY)
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT))
  } catch {}
}
