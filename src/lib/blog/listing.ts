import { getBlogPath, getTagPath } from '@/lib/blog/operations'

export const DEFAULT_LISTING_DESCRIPTION =
  'Expert insights on bulk tea purchasing, supplier guides, and cost-effective solutions for Australian businesses.'

export function parseListingPage(page?: string): number {
  return Math.max(1, parseInt(page ?? '1', 10) || 1)
}

export function getListingHref({
  activeTag,
  blogHandle,
  page,
  query,
}: {
  activeTag: string | null
  blogHandle: string
  page?: number
  query?: string | null
}) {
  const params = new URLSearchParams()
  const normalizedQuery = query?.trim()

  if (normalizedQuery) params.set('q', normalizedQuery)
  if (page && page > 1) params.set('page', String(page))

  const path = activeTag
    ? getTagPath(blogHandle, activeTag)
    : getBlogPath(blogHandle)
  const qs = params.toString()
  return `${path}${qs ? `?${qs}` : ''}`
}
