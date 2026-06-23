import { DEFAULT_CONSENT } from '@/lib/consent/adapter'
import { readStoredConsent } from '@/lib/consent/storage'

import {
  dispatchAnalyticsEvent,
  type AnalyticsDispatchResult,
  type AnalyticsDestination,
} from './adapter'
import { createDefaultAnalyticsDestinations } from './destinations'
import type { AnalyticsEvent } from './events'

const clientDestinations = createDefaultAnalyticsDestinations()

export async function dispatchClientAnalyticsEvent(
  event: AnalyticsEvent,
  destinations: readonly AnalyticsDestination[] = clientDestinations,
): Promise<AnalyticsDispatchResult> {
  try {
    return await dispatchAnalyticsEvent(
      event,
      readStoredConsent() ?? DEFAULT_CONSENT,
      destinations,
    )
  } catch {
    return {
      dispatched: 0,
      skipped: destinations.length,
    }
  }
}
