export type SecurityHeader = {
  key: string
  value: string
}

export const contentSecurityPolicyReportOnlyHeaderName =
  'Content-Security-Policy-Report-Only'

type SecurityHeaderEnv = {
  NEXT_PUBLIC_GA4_MEASUREMENT_ID?: string
  NEXT_PUBLIC_GTM_CONTAINER_ID?: string
  NEXT_PUBLIC_META_PIXEL_ID?: string
  NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY?: string
  NEXT_PUBLIC_SHOPIFY_PIXEL_ENABLED?: string
}

function hasEnvValue(
  env: SecurityHeaderEnv,
  key: keyof SecurityHeaderEnv,
): boolean {
  return Boolean(env[key]?.trim())
}

function isTruthyEnv(
  env: SecurityHeaderEnv,
  key: keyof SecurityHeaderEnv,
): boolean {
  return env[key]?.trim() === 'true'
}

export function buildContentSecurityPolicy(
  env: SecurityHeaderEnv = process.env,
): string {
  const scriptSources = ["'self'", "'unsafe-inline'", 'https://searchserverapi.com']
  const imgSources = [
    "'self'",
    'blob:',
    'data:',
    'https://cdn.shopify.com',
    'https://www.teavision.com.au',
    'https://cdn.sanity.io',
    'https://searchserverapi.com',
    'https://searchserverapi1.com',
  ]
  const connectSources = [
    "'self'",
    'https://searchserverapi1.com',
    'https://api.trustoo.io',
    'https://*.myshopify.com',
    'https://*.shopify.com',
  ]

  const ga4Enabled = hasEnvValue(env, 'NEXT_PUBLIC_GA4_MEASUREMENT_ID')
  const gtmEnabled = hasEnvValue(env, 'NEXT_PUBLIC_GTM_CONTAINER_ID')
  const metaEnabled = hasEnvValue(env, 'NEXT_PUBLIC_META_PIXEL_ID')
  const klaviyoEnabled = hasEnvValue(env, 'NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY')
  const shopifyPixelEnabled = isTruthyEnv(
    env,
    'NEXT_PUBLIC_SHOPIFY_PIXEL_ENABLED',
  )

  if (ga4Enabled || gtmEnabled) {
    scriptSources.push('https://www.googletagmanager.com')
    connectSources.push(
      'https://www.google-analytics.com',
      'https://region1.google-analytics.com',
    )
  }

  if (metaEnabled) {
    scriptSources.push('https://connect.facebook.net')
    connectSources.push('https://www.facebook.com')
    imgSources.push('https://www.facebook.com')
  }

  if (klaviyoEnabled) {
    scriptSources.push('https://static.klaviyo.com')
    connectSources.push(
      'https://a.klaviyo.com',
      'https://static.klaviyo.com',
      'https://telemetrics.klaviyo.com',
    )
  }

  if (shopifyPixelEnabled) {
    scriptSources.push('https://cdn.shopify.com')
    connectSources.push('https://monorail-edge.shopifysvc.com')
  }

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "form-action 'self'",
    `script-src ${scriptSources.join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src ${imgSources.join(' ')}`,
    "font-src 'self' data:",
    `connect-src ${connectSources.join(' ')}`,
    "frame-src 'self' https://maps.google.com",
    "media-src 'self'",
    "manifest-src 'self'",
    'upgrade-insecure-requests',
  ].join('; ')
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
