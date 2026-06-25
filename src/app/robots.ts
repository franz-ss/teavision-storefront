import type { MetadataRoute } from 'next'

import { isNoindexModeEnabled } from '@/lib/seo/noindex'
import { SITE_URL } from '@/lib/seo/site-url'

const DISALLOWED_PATHS = [
  '/api/',
  '/account',
  '/account/',
  '/account/login',
  '/account/callback',
  '/account/logout',
]

export default function robots(): MetadataRoute.Robots {
  const rules = {
    userAgent: '*',
    allow: '/',
    disallow: DISALLOWED_PATHS,
  }

  if (isNoindexModeEnabled()) {
    return { rules }
  }

  return {
    rules,
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
