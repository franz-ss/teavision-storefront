import 'server-only'

import { optionalEnv, truthyEnv } from './read'
import { isProductionRuntime } from './runtime'

export function getResendApiKey(): string | undefined {
  return optionalEnv('RESEND_API_KEY')
}

export function getShopifyWebhookSecret(): string | undefined {
  return optionalEnv('SHOPIFY_WEBHOOK_SECRET')
}

export function isNoindexModeEnabledFromEnv(): boolean {
  return truthyEnv('DISABLE_INDEXING')
}

export function shouldWarnAboutRateLimitMemoryFallback(): boolean {
  return (
    isProductionRuntime() &&
    !truthyEnv('RATE_LIMIT_EXTERNAL_PROTECTION') &&
    !truthyEnv('RATE_LIMIT_ALLOW_MEMORY_FALLBACK')
  )
}
