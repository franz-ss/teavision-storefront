import type { MetadataRoute } from 'next'

import { isNoindexModeEnabled } from '@/lib/seo/noindex'
import { SITE_URL } from '@/lib/seo/site-url'

export default function robots(): MetadataRoute.Robots {
  const rules = {
    userAgent: '*',
    allow: '/',
    disallow: ['/api/'],
  }

  if (isNoindexModeEnabled()) {
    return { rules }
  }

  return {
    rules,
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
