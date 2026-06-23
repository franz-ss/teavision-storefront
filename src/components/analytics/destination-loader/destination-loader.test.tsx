/**
 * @vitest-environment jsdom
 */
import type { ReactNode } from 'react'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  grantOptionalConsent,
  rejectOptionalConsent,
  updateConsentCategories,
} from '@/lib/consent/adapter'
import { CONSENT_CHANGED_EVENT } from '@/lib/consent/storage'

import { AnalyticsDestinationLoader } from './destination-loader'

vi.mock('next/script', () => ({
  default: ({
    children,
    id,
    src,
  }: {
    children?: ReactNode
    id?: string
    src?: string
  }) => (
    <div data-script-id={id} data-script-src={src}>
      {children}
    </div>
  ),
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
  it('applies analytics-only Google consent before loading Google destinations', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)

    await act(async () => {
      root.render(
        <AnalyticsDestinationLoader
          config={{
            analyticsMode: 'ga4',
            ga4MeasurementId: 'G-TEAVISION',
            gtmContainerId: 'GTM-TEAVISION',
          }}
          initialConsent={updateConsentCategories({
            analytics: true,
            marketing: false,
          })}
        />,
      )
    })

    const scriptIds = [...host.querySelectorAll('[data-script-id]')].map(
      (element) => (element as HTMLElement).dataset.scriptId,
    )
    const consentScript = host.querySelector(
      '[data-script-id="teavision-google-consent-init"]',
    )
    const renderedScripts = host.textContent ?? ''

    expect(scriptIds).toEqual([
      'teavision-google-consent-init',
      'teavision-ga4-loader',
      'teavision-ga4-init',
      'teavision-gtm-loader',
    ])
    expect(consentScript?.textContent).toContain(
      "gtag('consent', 'default'",
    )
    expect(consentScript?.textContent).toContain(
      'analytics_storage: "granted"',
    )
    expect(consentScript?.textContent).toContain('ad_storage: "denied"')
    expect(consentScript?.textContent).toContain('ad_user_data: "denied"')
    expect(consentScript?.textContent).toContain(
      'ad_personalization: "denied"',
    )
    expect(renderedScripts.indexOf("gtag('consent', 'default'")).toBeLessThan(
      renderedScripts.indexOf("gtag('config'"),
    )
    expect(renderedScripts.indexOf("gtag('consent', 'default'")).toBeLessThan(
      renderedScripts.indexOf('gtm.js'),
    )

    await act(async () => {
      root.unmount()
    })
  })

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

  it('keeps analytics destinations active when only marketing consent is revoked', async () => {
    const globals = globalThis as ConsentGlobals
    globals.gtag = vi.fn()
    globals.fbq = vi.fn()
    const host = document.createElement('div')
    document.body.append(host)
    document.cookie = '_ga_TEAVISION=1; path=/'
    document.cookie = '_fbp=1; path=/'
    const root = createRoot(host)
    const grantedConsent = grantOptionalConsent()

    await act(async () => {
      root.render(
        <AnalyticsDestinationLoader
          config={{
            analyticsMode: 'ga4',
            ga4MeasurementId: 'G-TEAVISION',
            metaPixelId: '123456',
          }}
          initialConsent={grantedConsent}
        />,
      )
    })

    await act(async () => {
      window.dispatchEvent(
        new CustomEvent(CONSENT_CHANGED_EVENT, {
          detail: updateConsentCategories(
            { marketing: false },
            grantedConsent,
          ),
        }),
      )
    })

    expect(globals.gtag).toHaveBeenCalledWith('consent', 'update', {
      ad_personalization: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      analytics_storage: 'granted',
    })
    expect(globals.fbq).toHaveBeenCalledWith('consent', 'revoke')
    expect(document.cookie).toContain('_ga_TEAVISION')
    expect(document.cookie).not.toContain('_fbp')

    await act(async () => {
      root.unmount()
    })
  })

  it('keeps marketing destinations active when only analytics consent is revoked', async () => {
    const globals = globalThis as ConsentGlobals
    globals.gtag = vi.fn()
    globals.fbq = vi.fn()
    const host = document.createElement('div')
    document.body.append(host)
    document.cookie = '_ga_TEAVISION=1; path=/'
    document.cookie = '_fbp=1; path=/'
    const root = createRoot(host)
    const grantedConsent = grantOptionalConsent()

    await act(async () => {
      root.render(
        <AnalyticsDestinationLoader
          config={{
            analyticsMode: 'ga4',
            ga4MeasurementId: 'G-TEAVISION',
            metaPixelId: '123456',
          }}
          initialConsent={grantedConsent}
        />,
      )
    })

    await act(async () => {
      window.dispatchEvent(
        new CustomEvent(CONSENT_CHANGED_EVENT, {
          detail: updateConsentCategories(
            { analytics: false },
            grantedConsent,
          ),
        }),
      )
    })

    expect(globals.gtag).toHaveBeenCalledWith('consent', 'update', {
      ad_personalization: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      analytics_storage: 'denied',
    })
    expect(globals.fbq).not.toHaveBeenCalled()
    expect(document.cookie).not.toContain('_ga_TEAVISION')
    expect(document.cookie).toContain('_fbp')

    await act(async () => {
      root.unmount()
    })
  })
})
