import 'server-only'

import {
  getRateLimitTrustedIpHeader,
  isRateLimitProductionExplicit,
  shouldWarnAboutRateLimitMemoryFallback,
} from '@/lib/env/server'

type HeaderReader = Pick<Headers, 'get'>

type RateLimitBucket = {
  count: number
  resetAt: number
}

export type RateLimitStore = {
  increment: (
    key: string,
    windowMs: number,
    now: number,
  ) => Promise<RateLimitBucket>
}

type RateLimitOptions = {
  namespace: string
  identifier: string
  limit: number
  windowMs: number
}

type RateLimitResult = {
  limited: boolean
  remaining: number
  resetAt: number
}

const memoryBuckets = new Map<string, RateLimitBucket>()
let productionFallbackWarningLogged = false

function getDefaultStore(): RateLimitStore {
  return {
    async increment(key, windowMs, now) {
      for (const [bucketKey, bucket] of memoryBuckets) {
        if (bucket.resetAt <= now) {
          memoryBuckets.delete(bucketKey)
        }
      }

      const existingBucket = memoryBuckets.get(key)

      if (!existingBucket || existingBucket.resetAt <= now) {
        const nextBucket = {
          count: 1,
          resetAt: now + windowMs,
        }
        memoryBuckets.set(key, nextBucket)
        return nextBucket
      }

      const nextBucket = {
        count: existingBucket.count + 1,
        resetAt: existingBucket.resetAt,
      }
      memoryBuckets.set(key, nextBucket)
      return nextBucket
    },
  }
}

function warnIfProductionFallbackIsImplicit() {
  if (
    !shouldWarnAboutRateLimitMemoryFallback() ||
    productionFallbackWarningLogged
  ) {
    return
  }

  productionFallbackWarningLogged = true
  console.warn(
    'Rate limiting is failing closed because production abuse protection is not explicit. Configure RATE_LIMIT_EXTERNAL_PROTECTION=true or RATE_LIMIT_ALLOW_MEMORY_FALLBACK=true with RATE_LIMIT_TRUSTED_IP_HEADER.',
  )
}

function getFirstForwardedIp(headers: HeaderReader): string | undefined {
  return headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined
}

export function getClientIpFromHeaders(headers: HeaderReader): string {
  const trustedHeader = getRateLimitTrustedIpHeader()

  if (trustedHeader === 'x-forwarded-for') {
    return getFirstForwardedIp(headers) ?? 'unknown'
  }

  if (trustedHeader) {
    return headers.get(trustedHeader)?.trim() || 'unknown'
  }

  return (
    getFirstForwardedIp(headers) ||
    headers.get('x-real-ip')?.trim() ||
    headers.get('cf-connecting-ip')?.trim() ||
    'unknown'
  )
}

export async function checkRateLimit({
  namespace,
  identifier,
  limit,
  windowMs,
}: RateLimitOptions): Promise<RateLimitResult> {
  warnIfProductionFallbackIsImplicit()

  const safeLimit = Math.max(1, Math.trunc(limit))
  const safeWindowMs = Math.max(1, Math.trunc(windowMs))
  const now = Date.now()

  if (!isRateLimitProductionExplicit()) {
    return {
      limited: true,
      remaining: 0,
      resetAt: now + safeWindowMs,
    }
  }

  const key = `${namespace}:${identifier}`
  const bucket = await getDefaultStore().increment(
    key,
    safeWindowMs,
    now,
  )
  const remaining = Math.max(0, safeLimit - bucket.count)

  return {
    limited: bucket.count > safeLimit,
    remaining,
    resetAt: bucket.resetAt,
  }
}
