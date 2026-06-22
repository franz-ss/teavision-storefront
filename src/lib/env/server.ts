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
