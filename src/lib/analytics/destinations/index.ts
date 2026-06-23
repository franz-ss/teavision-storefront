import type { AnalyticsDestination } from '../adapter'
import { createFakeAnalyticsDestination } from './fake'
import { createGa4AnalyticsDestination } from './ga4'

type AnalyticsMode = 'disabled' | 'fake' | 'ga4' | 'auto'

type AnalyticsDestinationEnv = {
  CI?: string
  NEXT_PUBLIC_ANALYTICS_MODE?: string
  NEXT_PUBLIC_GA4_MEASUREMENT_ID?: string
  NODE_ENV?: string
}

function readAnalyticsMode(value: string | undefined): AnalyticsMode {
  if (value === 'disabled' || value === 'fake' || value === 'ga4') {
    return value
  }

  return 'auto'
}

function isLocalOrCi(env: AnalyticsDestinationEnv): boolean {
  return env.CI === 'true' || env.NODE_ENV !== 'production'
}

export function createDefaultAnalyticsDestinations(
  env: AnalyticsDestinationEnv = process.env,
): AnalyticsDestination[] {
  const mode = readAnalyticsMode(env.NEXT_PUBLIC_ANALYTICS_MODE)
  const ga4MeasurementId = env.NEXT_PUBLIC_GA4_MEASUREMENT_ID

  if (mode === 'disabled') return []
  if (mode === 'fake') return [createFakeAnalyticsDestination()]

  if (isLocalOrCi(env)) return [createFakeAnalyticsDestination()]

  if (mode === 'ga4' || ga4MeasurementId) {
    return ga4MeasurementId
      ? [createGa4AnalyticsDestination(ga4MeasurementId)]
      : []
  }

  return []
}
