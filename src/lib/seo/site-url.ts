import { optionalUrlOriginEnv } from '@/lib/env/read'
import { isProductionRuntime } from '@/lib/env/runtime'

const DEFAULT_SITE_URL = 'https://www.teavision.com.au'
const TEAVISION_APEX_ORIGIN = 'https://teavision.com.au'
const TEAVISION_WWW_ORIGIN = 'https://www.teavision.com.au'

function normalizeSiteOrigin(origin: string): string {
  return origin === TEAVISION_APEX_ORIGIN ? TEAVISION_WWW_ORIGIN : origin
}

function readSiteUrl(): string {
  const siteUrl =
    optionalUrlOriginEnv('SITE_URL') ??
    optionalUrlOriginEnv('NEXT_PUBLIC_SITE_URL')

  if (siteUrl) return normalizeSiteOrigin(siteUrl)

  if (isProductionRuntime()) {
    throw new Error(
      'Missing required environment variable: SITE_URL (or NEXT_PUBLIC_SITE_URL)',
    )
  }

  return DEFAULT_SITE_URL
}

export const SITE_URL = readSiteUrl()

export function getSiteUrl(path = '/'): string {
  return new URL(path, SITE_URL).toString()
}
