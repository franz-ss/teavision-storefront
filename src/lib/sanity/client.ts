import 'server-only'

import {
  createImageUrlBuilder,
  type SanityImageSource,
} from '@sanity/image-url'
import { createClient } from 'next-sanity'

import { getSanityConfig, getSanityReadToken } from './env'

export function getSanityClient() {
  const config = getSanityConfig()
  const token = getSanityReadToken()

  return createClient({
    ...config,
    ...(token ? { token } : {}),
    useCdn: false,
    perspective: 'published',
    stega: false,
  })
}

/**
 * CDN-backed client for public published reads. Safe to use when:
 * - perspective is always 'published' (no draft/preview paths)
 * - webhook/cacheTag invalidation is confirmed (see src/app/api/webhooks/sanity/route.ts)
 * - no auth token is required for the query
 *
 * Cache invalidation chain: Sanity webhook → revalidateTag('blog', 'blog-${slug}') →
 * Next.js 'use cache' purge → next request fetches fresh data from Sanity CDN.
 */
function getSanityCdnClient() {
  const config = getSanityConfig()

  return createClient({
    ...config,
    useCdn: true,
    perspective: 'published',
    stega: false,
  })
}

export async function sanityFetch<T>(
  query: string,
  params: Record<string, string | number | boolean | null> = {},
): Promise<T> {
  return getSanityClient().fetch<T>(query, params)
}

/**
 * Fetch published content via Sanity's CDN for reduced latency on public reads.
 * Only use for published-perspective queries that are invalidated by the Sanity webhook.
 */
export async function sanityPublishedFetch<T>(
  query: string,
  params: Record<string, string | number | boolean | null> = {},
): Promise<T> {
  return getSanityCdnClient().fetch<T>(query, params)
}

export type SanityImageUrlOptions = {
  width?: number
  height?: number
  quality?: number
  fit?: 'max' | 'min' | 'clip' | 'crop' | 'fill' | 'fillmax' | 'scale'
}

export function getSanityImageUrl(
  source: SanityImageSource,
  options: SanityImageUrlOptions = {},
): string {
  const { projectId, dataset } = getSanityConfig()
  const { width, height, quality = 75, fit = 'max' } = options

  let builder = createImageUrlBuilder({ projectId, dataset })
    .image(source)
    .auto('format')
    .fit(fit)
    .quality(quality)

  if (width !== undefined) {
    builder = builder.width(Math.round(width))
  }

  if (height !== undefined) {
    builder = builder.height(Math.round(height))
  }

  return builder.url()
}
