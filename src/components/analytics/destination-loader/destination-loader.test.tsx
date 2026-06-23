/**
 * @vitest-environment jsdom
 */
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { grantOptionalConsent, rejectOptionalConsent } from '@/lib/consent/adapter'
import { CONSENT_CHANGED_EVENT } from '@/lib/consent/storage'

import { AnalyticsDestinationLoader } from './destination-loader'

vi.mock('next/script', () => ({
  default: () => null,
}))

type ConsentGlobals = typeof globalThis & {
  fbq?: ReturnType<typeof vi.fn>
  gtag?: ReturnType<typeof vi.fn>
}

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

describe('AnalyticsDestinationLoader', () => {
  it('notifies loaded destinations when optional consent is revoked', async () => {
    const globals = globalThis as ConsentGlobals
    globals.gtag = vi.fn()
    globals.fbq = vi.fn()
    const host = document.createElement('div')
    document.body.append(host)
    document.cookie = '_ga_TEAVISION=1; path=/'
    const root = createRoot(host)

    await act(async () => {
      root.render(
        <AnalyticsDestinationLoader
          config={{
            analyticsMode: 'ga4',
            ga4MeasurementId: 'G-TEAVISION',
            metaPixelId: '123456',
          }}
          initialConsent={grantOptionalConsent()}
        />,
      )
    })

    await act(async () => {
      window.dispatchEvent(
        new CustomEvent(CONSENT_CHANGED_EVENT, {
          detail: rejectOptionalConsent(),
        }),
      )
    })

    expect(globals.gtag).toHaveBeenCalledWith('consent', 'update', {
      ad_personalization: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      analytics_storage: 'denied',
    })
    expect(globals.fbq).toHaveBeenCalledWith('consent', 'revoke')
    expect(document.cookie).not.toContain('_ga_TEAVISION')

    await act(async () => {
      root.unmount()
    })
  })
})
