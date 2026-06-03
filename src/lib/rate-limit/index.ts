import 'server-only'

type HeaderReader = Pick<Headers, 'get'>

type RateLimitBucket = {
  count: number
  resetAt: number
}

export type RateLimitStore = {
  increment: (key: string, windowMs: number, now: number) => Promise<RateLimitBucket>
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
    process.env.NODE_ENV !== 'production' ||
    process.env.RATE_LIMIT_EXTERNAL_PROTECTION === 'true' ||
    process.env.RATE_LIMIT_ALLOW_MEMORY_FALLBACK === 'true' ||
    productionFallbackWarningLogged
  ) {
    return
  }

  productionFallbackWarningLogged = true
  console.warn(
    'Using in-memory rate limiting without RATE_LIMIT_EXTERNAL_PROTECTION=true. Configure provider-level or durable-store rate limiting for production.',
  )
}

export function getClientIpFromHeaders(headers: HeaderReader): string {
  const forwardedFor = headers.get('x-forwarded-for')
  const firstForwardedIp = forwardedFor?.split(',')[0]?.trim()

  return (
    firstForwardedIp ||
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
  const key = `${namespace}:${identifier}`
  const bucket = await getDefaultStore().increment(key, safeWindowMs, Date.now())
  const remaining = Math.max(0, safeLimit - bucket.count)

  return {
    limited: bucket.count > safeLimit,
    remaining,
    resetAt: bucket.resetAt,
  }
}
