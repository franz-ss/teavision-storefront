import { cacheLife, cacheTag } from 'next/cache'

import { shopifyFetch } from '@/lib/shopify/client'
import { GetPageDocument } from '@/lib/shopify/types'

export async function getPage(
  handle: string,
): Promise<{ title: string; body: string } | null> {
  'use cache'
  cacheTag('page', `page-${handle}`)
  cacheLife('hours')

  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return {
      title: handle.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      body: '<p>Page content will appear here once the Shopify API is connected.</p>',
    }
  }

  const data = await shopifyFetch({
    query: GetPageDocument,
    variables: { handle },
  })

  return data.page
    ? {
        title: data.page.title,
        body: String(data.page.body),
      }
    : null
}
