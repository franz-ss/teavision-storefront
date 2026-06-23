import {
  canUseAnalytics,
  canUseMarketing,
  type ConsentCategory,
  type ConsentState,
} from '@/lib/consent/adapter'

import type { AnalyticsEvent } from './events'

export type AnalyticsDestinationConsentCategory = Extract<
  ConsentCategory,
  'analytics' | 'marketing'
>

export type AnalyticsDestination = {
  id: string
  category: AnalyticsDestinationConsentCategory
  isEnabled?: (consent: ConsentState) => boolean
  dispatch: (
    event: AnalyticsEvent,
    consent: ConsentState,
  ) => Promise<void> | void
}

export type AnalyticsDispatchResult = {
  dispatched: number
  skipped: number
}

function canUseDestination(
  consent: ConsentState,
  category: AnalyticsDestinationConsentCategory,
): boolean {
  if (category === 'analytics') return canUseAnalytics(consent)
  return canUseMarketing(consent)
}

export async function dispatchAnalyticsEvent(
  event: AnalyticsEvent,
  consent: ConsentState,
  destinations: readonly AnalyticsDestination[] = [],
): Promise<AnalyticsDispatchResult> {
  if (destinations.length === 0) {
    return {
      dispatched: 0,
      skipped: 0,
    }
  }

  let dispatched = 0
  let skipped = 0

  for (const destination of destinations) {
    if (!canUseDestination(consent, destination.category)) {
      skipped += 1
      continue
    }

    if (destination.isEnabled && !destination.isEnabled(consent)) {
      skipped += 1
      continue
    }

    await destination.dispatch(event, consent)
    dispatched += 1
  }

  return {
    dispatched,
    skipped,
  }
}

export function createAnalyticsAdapter(
  consent: ConsentState,
  destinations: readonly AnalyticsDestination[] = [],
): {
  dispatch: (event: AnalyticsEvent) => Promise<AnalyticsDispatchResult>
} {
  return {
    dispatch(event) {
      return dispatchAnalyticsEvent(event, consent, destinations)
    },
  }
}
