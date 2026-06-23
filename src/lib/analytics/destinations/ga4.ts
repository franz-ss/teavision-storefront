import { canUseAnalytics, type ConsentState } from '@/lib/consent/adapter'

import type { AnalyticsDestination } from '../adapter'
import type { AnalyticsEvent } from '../events'

type Ga4Item = {
  item_id?: string
  item_name?: string
  item_variant?: string
  quantity?: number
}

type Ga4Payload = Record<string, boolean | number | string | Ga4Item[]>

type GtagWindow = typeof globalThis & {
  gtag?: (command: 'event', eventName: string, payload: Ga4Payload) => void
}

export type Ga4MappedEvent = {
  eventName: string
  payload: Ga4Payload
}

function mapAnalyticsItem(event: AnalyticsEvent): Ga4Item[] | undefined {
  if (event.name === 'product_view') {
    return [
      {
        item_id: event.product.id,
        item_name: event.product.title,
      },
    ]
  }

  if (event.name === 'add_to_cart') {
    return [
      {
        item_id: event.item.id,
        item_name: event.item.title,
        item_variant: event.item.variantId,
        quantity: event.item.quantity,
      },
    ]
  }

  return undefined
}

export function mapAnalyticsEventToGa4(
  event: AnalyticsEvent,
): Ga4MappedEvent {
  switch (event.name) {
    case 'product_view':
      return {
        eventName: 'view_item',
        payload: {
          items: mapAnalyticsItem(event) ?? [],
        },
      }
    case 'search':
      return {
        eventName: 'search',
        payload: {
          search_term: event.query,
          results_count: event.resultCount,
        },
      }
    case 'add_to_cart':
      return {
        eventName: 'add_to_cart',
        payload: {
          items: mapAnalyticsItem(event) ?? [],
        },
      }
    case 'cart_update':
      return {
        eventName: 'cart_update',
        payload: {
          cart_action: event.action,
          line_id: event.lineId,
          quantity: event.quantity ?? 0,
        },
      }
    case 'checkout_start':
      return {
        eventName: 'begin_checkout',
        payload: {
          cart_id_present: event.cartIdPresent,
        },
      }
    case 'lead_submit':
      return {
        eventName: 'generate_lead',
        payload: {
          lead_kind: event.kind,
        },
      }
  }
}

export function createGa4AnalyticsDestination(
  measurementId: string | undefined,
): AnalyticsDestination {
  return {
    id: 'ga4',
    category: 'analytics',
    isEnabled(consent: ConsentState) {
      return canUseAnalytics(consent) && Boolean(measurementId)
    },
    dispatch(event, consent) {
      if (!canUseAnalytics(consent) || !measurementId) return

      const mappedEvent = mapAnalyticsEventToGa4(event)
      const target = globalThis as GtagWindow

      target.gtag?.('event', mappedEvent.eventName, {
        ...mappedEvent.payload,
        send_to: measurementId,
      })
    },
  }
}
