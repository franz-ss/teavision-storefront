import 'server-only'

import { optionalEnv, truthyEnv } from './read'
import { isProductionRuntime } from './runtime'

const RATE_LIMIT_TRUSTED_IP_HEADERS = [
  'x-forwarded-for',
  'x-real-ip',
  'cf-connecting-ip',
] as const

export type RateLimitTrustedIpHeader =
  (typeof RATE_LIMIT_TRUSTED_IP_HEADERS)[number]

function isTrustedIpHeader(value: string): value is RateLimitTrustedIpHeader {
  return RATE_LIMIT_TRUSTED_IP_HEADERS.some((header) => header === value)
}

export function getResendApiKey(): string | undefined {
  return optionalEnv('RESEND_API_KEY')
}

export function getShopifyWebhookSecret(): string | undefined {
  return optionalEnv('SHOPIFY_WEBHOOK_SECRET')
}

export function isNoindexModeEnabledFromEnv(): boolean {
  return truthyEnv('DISABLE_INDEXING')
}

export function getAnalyticsModeFromEnv(): string | undefined {
  return optionalEnv('NEXT_PUBLIC_ANALYTICS_MODE')
}

export function getGa4MeasurementIdFromEnv(): string | undefined {
  return optionalEnv('NEXT_PUBLIC_GA4_MEASUREMENT_ID')
}

export function getGtmContainerIdFromEnv(): string | undefined {
  return optionalEnv('NEXT_PUBLIC_GTM_CONTAINER_ID')
}

export function getMetaPixelIdFromEnv(): string | undefined {
  return optionalEnv('NEXT_PUBLIC_META_PIXEL_ID')
}

export function getKlaviyoPublicKeyFromEnv(): string | undefined {
  return optionalEnv('NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY')
}

export function isShopifyPixelEnabledFromEnv(): boolean {
  return truthyEnv('NEXT_PUBLIC_SHOPIFY_PIXEL_ENABLED')
}

export function getRateLimitTrustedIpHeader():
  | RateLimitTrustedIpHeader
  | undefined {
  const header = optionalEnv('RATE_LIMIT_TRUSTED_IP_HEADER')?.toLowerCase()

  return header && isTrustedIpHeader(header) ? header : undefined
}

export function isRateLimitProductionExplicit(): boolean {
  if (!isProductionRuntime()) return true
  if (truthyEnv('RATE_LIMIT_EXTERNAL_PROTECTION')) return true

  return (
    truthyEnv('RATE_LIMIT_ALLOW_MEMORY_FALLBACK') &&
    getRateLimitTrustedIpHeader() !== undefined
  )
}

export function shouldWarnAboutRateLimitMemoryFallback(): boolean {
  return isProductionRuntime() && !isRateLimitProductionExplicit()
}
