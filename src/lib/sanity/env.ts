import 'server-only'

import { optionalEnv, requiredEnv } from '@/lib/env/read'

export type SanityRuntimeConfig = {
  projectId: string
  dataset: string
  apiVersion: string
}

const DEFAULT_API_VERSION = '2026-05-28'

export function getSanityConfig(): SanityRuntimeConfig {
  return {
    projectId: requiredEnv('NEXT_PUBLIC_SANITY_PROJECT_ID'),
    dataset: requiredEnv('NEXT_PUBLIC_SANITY_DATASET'),
    apiVersion:
      optionalEnv('NEXT_PUBLIC_SANITY_API_VERSION') ?? DEFAULT_API_VERSION,
  }
}

export function getSanityReadToken(): string | undefined {
  return optionalEnv('SANITY_API_READ_TOKEN')
}

export function getSanityDraftReadToken(): string {
  return requiredEnv('SANITY_API_READ_TOKEN')
}

export function getSanityRevalidateSecret(): string {
  return requiredEnv('SANITY_REVALIDATE_SECRET')
}

export function getSanityPreviewSecret(): string {
  return requiredEnv('SANITY_PREVIEW_SECRET')
}
