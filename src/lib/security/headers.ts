export type SecurityHeader = {
  key: string
  value: string
}

export const contentSecurityPolicyReportOnlyHeaderName =
  'Content-Security-Policy-Report-Only'

const contentSecurityPolicyDirectives = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://searchserverapi.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://cdn.shopify.com https://www.teavision.com.au https://cdn.sanity.io https://searchserverapi.com https://searchserverapi1.com",
  "font-src 'self' data:",
  "connect-src 'self' https://searchserverapi1.com https://api.trustoo.io https://*.myshopify.com https://*.shopify.com",
  "frame-src 'self' https://maps.google.com",
  "media-src 'self'",
  "manifest-src 'self'",
  'upgrade-insecure-requests',
]

export function buildContentSecurityPolicy(): string {
  return contentSecurityPolicyDirectives.join('; ')
}

export const securityHeaders: SecurityHeader[] = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: contentSecurityPolicyReportOnlyHeaderName,
    value: buildContentSecurityPolicy(),
  },
]
