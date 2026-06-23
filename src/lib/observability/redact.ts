import { createHash } from 'node:crypto'

export const REDACTED_VALUE = '[redacted]'

const TOKEN_VALUE_PATTERN =
  /\b(?:shcat|shpat|shpca)[A-Za-z0-9._:-]*\b|\bcustomer-(?:access|refresh)-token[A-Za-z0-9._:-]*\b|\bBearer\s+[A-Za-z0-9._~+/-]+=*/gi
const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi
const PHONE_LIKE_PATTERN =
  /(?<![A-Za-z0-9])(?:\+?\d[\d\s().-]{6,}\d)(?![A-Za-z0-9])/g
const URL_PATTERN = /\bhttps?:\/\/[^\s"'<>]+/gi
const COOKIE_VALUE_PATTERN =
  /\b(?:teavision_customer_session|teavision_cart|checkout)[A-Za-z0-9._=:%/-]*/gi
const SENSITIVE_KEY_PARTS = [
  'name',
  'email',
  'phone',
  'address',
  'message',
  'brief',
  'notes',
  'token',
  'secret',
  'password',
  'payload',
  'body',
  'cookie',
  'checkouturl',
  'cartid',
  'orderid',
]

function isSensitiveKey(key: string): boolean {
  const normalizedKey = key.toLowerCase()

  return SENSITIVE_KEY_PARTS.some((part) => normalizedKey.includes(part))
}

function redactCheckoutUrl(value: string): string {
  return value.replace(URL_PATTERN, (url) => {
    try {
      const parsedUrl = new URL(url)
      const hostAndPath =
        `${parsedUrl.hostname}${parsedUrl.pathname}`.toLowerCase()

      return hostAndPath.includes('checkout') ? REDACTED_VALUE : url
    } catch {
      return url.toLowerCase().includes('checkout') ? REDACTED_VALUE : url
    }
  })
}

function redactPhoneLikeValues(value: string): string {
  return value.replace(PHONE_LIKE_PATTERN, (match) => {
    const digitCount = match.replace(/\D/g, '').length

    return digitCount >= 8 ? REDACTED_VALUE : match
  })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function redactValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return redactText(value)
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item))
  }

  if (isRecord(value)) {
    return redactRecord(value)
  }

  return value
}

export function redactText(value: string): string {
  return redactPhoneLikeValues(
    redactCheckoutUrl(value)
      .replace(TOKEN_VALUE_PATTERN, REDACTED_VALUE)
      .replace(EMAIL_PATTERN, REDACTED_VALUE)
      .replace(COOKIE_VALUE_PATTERN, REDACTED_VALUE),
  )
}

export function redactRecord(
  value: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value).map(([key, entryValue]) => [
      key,
      isSensitiveKey(key) ? REDACTED_VALUE : redactValue(entryValue),
    ]),
  )
}

export function hashIdentifier(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 16)
}
