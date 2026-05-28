import 'server-only'

export type SanityRuntimeConfig = {
  projectId: string
  dataset: string
  apiVersion: string
}

const DEFAULT_API_VERSION = '2026-05-28'

function required(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`Missing required Sanity environment variable: ${name}`)
  }

  return value
}

export function getSanityConfig(): SanityRuntimeConfig {
  return {
    projectId: required('NEXT_PUBLIC_SANITY_PROJECT_ID'),
    dataset: required('NEXT_PUBLIC_SANITY_DATASET'),
    apiVersion:
      process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() ?? DEFAULT_API_VERSION,
  }
}

export function getSanityRevalidateSecret(): string {
  return required('SANITY_REVALIDATE_SECRET')
}
