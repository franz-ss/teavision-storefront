import { unstable_cache } from 'next/cache'

import { shopifyFetch } from '@/lib/shopify/client'
import {
  GetPageDocument,
  GetPagesDocument,
  type GetPageQuery,
  type GetPagesQuery,
} from '@/lib/shopify/types'

const SHOPIFY_PAGE_SIZE = 250

type PageSeo = {
  title: string | null
  description: string | null
}

export type ShopifyPage = {
  id: string
  handle: string
  title: string
  body: string
  bodySummary: string
  updatedAt: string
  seo: PageSeo
}

export type ShopifyPageSummary = Omit<ShopifyPage, 'body'>

type PageNode = NonNullable<GetPageQuery['page']>
type PagesNode = GetPagesQuery['pages']['edges'][number]['node']

function reshapeSeo(seo: PageNode['seo'] | PagesNode['seo']): PageSeo {
  return {
    title: seo?.title ?? null,
    description: seo?.description ?? null,
  }
}

function reshapePage(page: PageNode): ShopifyPage {
  return {
    id: page.id,
    handle: page.handle,
    title: page.title,
    body: String(page.body),
    bodySummary: page.bodySummary,
    updatedAt: String(page.updatedAt),
    seo: reshapeSeo(page.seo),
  }
}

function reshapePageSummary(page: PagesNode): ShopifyPageSummary {
  return {
    id: page.id,
    handle: page.handle,
    title: page.title,
    bodySummary: page.bodySummary,
    updatedAt: String(page.updatedAt),
    seo: reshapeSeo(page.seo),
  }
}

export function getPagePath(handle: string): string {
  return `/pages/${handle}`
}

export function getPageHandleFromSlug(slug: string | string[]): string {
  return Array.isArray(slug) ? (slug[0] ?? '') : slug
}

export const getPage = unstable_cache(
  async (handle: string): Promise<ShopifyPage | null> => {
    const data = await shopifyFetch({
      query: GetPageDocument,
      variables: { handle },
    })

    return data.page ? reshapePage(data.page) : null
  },
  ['page'],
  {
    tags: ['page'],
    revalidate: 3600, // cacheLife('hours')
  },
)

export const getPages = unstable_cache(
  async (): Promise<ShopifyPageSummary[]> => {
    const pages: ShopifyPageSummary[] = []
    let after: string | null | undefined
    let hasNextPage = true

    while (hasNextPage) {
      const data = await shopifyFetch({
        query: GetPagesDocument,
        variables: {
          first: SHOPIFY_PAGE_SIZE,
          after,
        },
      })

      pages.push(
        ...data.pages.edges.map((edge) => reshapePageSummary(edge.node)),
      )
      hasNextPage = data.pages.pageInfo.hasNextPage
      after = data.pages.pageInfo.endCursor
    }

    return pages
  },
  ['pages'],
  {
    tags: ['pages'],
    revalidate: 3600, // cacheLife('hours')
  },
)
