'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

import {
  canUseAnalytics,
  canUseMarketing,
  DEFAULT_CONSENT,
  isConsentState,
  type ConsentState,
} from '@/lib/consent/adapter'
import {
  CONSENT_CHANGED_EVENT,
  CONSENT_STORAGE_KEY,
  readStoredConsent,
} from '@/lib/consent/storage'

export type AnalyticsDestinationLoaderConfig = {
  analyticsMode?: string
  ga4MeasurementId?: string
  gtmContainerId?: string
  metaPixelId?: string
  klaviyoPublicKey?: string
  shopifyPixelEnabled?: boolean
}

export type AnalyticsDestinationLoaderProps = {
  config?: AnalyticsDestinationLoaderConfig
  initialConsent?: ConsentState
}

const publicAnalyticsConfig = {
  analyticsMode: process.env.NEXT_PUBLIC_ANALYTICS_MODE,
  ga4MeasurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
  gtmContainerId: process.env.NEXT_PUBLIC_GTM_CONTAINER_ID,
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
  klaviyoPublicKey: process.env.NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY,
  shopifyPixelEnabled:
    process.env.NEXT_PUBLIC_SHOPIFY_PIXEL_ENABLED === 'true',
} satisfies AnalyticsDestinationLoaderConfig

function destinationId(value: string | undefined): string | undefined {
  const trimmed = value?.trim()

  return trimmed ? trimmed : undefined
}

function canLoadRealDestinations(
  config: AnalyticsDestinationLoaderConfig,
): boolean {
  return (
    config.analyticsMode !== 'disabled' && config.analyticsMode !== 'fake'
  )
}

function scriptLiteral(value: string): string {
  return JSON.stringify(value)
}

export function AnalyticsDestinationLoader({
  config = publicAnalyticsConfig,
  initialConsent = DEFAULT_CONSENT,
}: AnalyticsDestinationLoaderProps) {
  const [consent, setConsent] = useState<ConsentState>(initialConsent)

  useEffect(() => {
    function syncConsent() {
      setConsent(readStoredConsent() ?? initialConsent)
    }

    function handleStoredConsentChange(event: StorageEvent) {
      if (event.key === CONSENT_STORAGE_KEY) syncConsent()
    }

    function handleLocalConsentChange(event: Event) {
      if (
        event instanceof CustomEvent &&
        isConsentState(event.detail)
      ) {
        setConsent(event.detail)
        return
      }

      syncConsent()
    }

    const timer = window.setTimeout(syncConsent, 0)

    window.addEventListener('storage', handleStoredConsentChange)
    window.addEventListener(CONSENT_CHANGED_EVENT, handleLocalConsentChange)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('storage', handleStoredConsentChange)
      window.removeEventListener(
        CONSENT_CHANGED_EVENT,
        handleLocalConsentChange,
      )
    }
  }, [initialConsent])

  if (!canLoadRealDestinations(config)) return null

  const ga4MeasurementId = destinationId(config.ga4MeasurementId)
  const gtmContainerId = destinationId(config.gtmContainerId)
  const metaPixelId = destinationId(config.metaPixelId)
  const klaviyoPublicKey = destinationId(config.klaviyoPublicKey)
  const analyticsAllowed = canUseAnalytics(consent)
  const marketingAllowed = canUseMarketing(consent)

  return (
    <>
      {analyticsAllowed && ga4MeasurementId && (
        <>
          <Script
            id="teavision-ga4-loader"
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4MeasurementId)}`}
            strategy="afterInteractive"
          />
          <Script id="teavision-ga4-init" strategy="afterInteractive">
            {`
window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${scriptLiteral(ga4MeasurementId)}, { send_page_view: false });
`}
          </Script>
        </>
      )}

      {analyticsAllowed && gtmContainerId && (
        <Script id="teavision-gtm-loader" strategy="afterInteractive">
          {`
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer',${scriptLiteral(gtmContainerId)});
`}
        </Script>
      )}

      {marketingAllowed && metaPixelId && (
        <Script id="teavision-meta-pixel-loader" strategy="afterInteractive">
          {`
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', ${scriptLiteral(metaPixelId)});
fbq('track', 'PageView');
`}
        </Script>
      )}

      {marketingAllowed && klaviyoPublicKey && (
        <Script
          id="teavision-klaviyo-loader"
          src={`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${encodeURIComponent(klaviyoPublicKey)}`}
          strategy="afterInteractive"
        />
      )}
    </>
  )
}
