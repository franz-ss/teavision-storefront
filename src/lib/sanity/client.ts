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
