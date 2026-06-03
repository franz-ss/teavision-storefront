import type { MetadataRoute } from 'next'

import { isNoindexModeEnabled } from '@/lib/seo/noindex'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://teavision.com.au'

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
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
