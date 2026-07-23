import type { PageProps } from '../_lib/page-types'
import { Results } from './results'

// Suspense fallback for the query-gated results. Reads only params and cached
// Shopify data, so it renders the real page-1 grid in the served shell —
// crawlers and no-JS renders see actual products instead of a skeleton, and
// query-free requests swap to identical resolved content. JsonLd and
// rel=prev/next stay off here so they appear exactly once per document.
export async function DefaultResults({ params }: Pick<PageProps, 'params'>) {
  const { handle, category } = await params

  return Results({
    handle,
    category,
    sort: 'featured',
    page: 1,
    selectedFilters: [],
    productFilters: [],
    includeMeta: false,
  })
}
