import type { AnalyticsDestination } from '../adapter'
import type { AnalyticsEvent } from '../events'

const capturedAnalyticsEvents: AnalyticsEvent[] = []

export function createFakeAnalyticsDestination(): AnalyticsDestination {
  return {
    id: 'fake',
    category: 'analytics',
    dispatch(event) {
      capturedAnalyticsEvents.push(event)
    },
  }
}

export function getCapturedAnalyticsEvents(): readonly AnalyticsEvent[] {
  return [...capturedAnalyticsEvents]
}

export function clearCapturedAnalyticsEvents(): void {
  capturedAnalyticsEvents.length = 0
}
