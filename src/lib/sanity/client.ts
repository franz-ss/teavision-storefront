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
