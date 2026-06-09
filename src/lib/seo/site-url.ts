import { optionalUrlOriginEnv } from '@/lib/env/read'
import { isProductionRuntime } from '@/lib/env/runtime'

const DEFAULT_SITE_URL = 'https://teavision.com.au'

function readSiteUrl(): string {
  const siteUrl =
    optionalUrlOriginEnv('SITE_URL') ??
    optionalUrlOriginEnv('NEXT_PUBLIC_SITE_URL')

  if (siteUrl) return siteUrl

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
