import 'server-only'

import {
  createImageUrlBuilder,
  type SanityImageSource,
} from '@sanity/image-url'
import { createClient } from 'next-sanity'

import { getSanityConfig } from './env'

export function getSanityClient() {
  const config = getSanityConfig()

  return createClient({
    ...config,
    useCdn: false,
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

export function getSanityImageUrl(source: SanityImageSource): string {
  const { projectId, dataset } = getSanityConfig()

  return createImageUrlBuilder({ projectId, dataset })
    .image(source)
    .auto('format')
    .url()
}
