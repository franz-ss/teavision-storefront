import { readFileSync } from 'node:fs'

import { afterEach, describe, expect, test, vi } from 'vitest'

import {
  createAnalyticsAdapter,
  dispatchAnalyticsEvent,
  type AnalyticsDestination,
} from './adapter'
import {
  createDefaultAnalyticsDestinations,
} from './destinations'
import {
  clearCapturedAnalyticsEvents,
  createFakeAnalyticsDestination,
  getCapturedAnalyticsEvents,
} from './destinations/fake'
import { mapAnalyticsEventToGa4 } from './destinations/ga4'
import type { AnalyticsEvent } from './events'
import { grantOptionalConsent, rejectOptionalConsent } from '../consent/adapter'

type ForbiddenAnalyticsField =
  | 'email'
  | 'phone'
  | 'message'
  | 'firstName'
  | 'lastName'
  | 'company'
  | 'address'
  | 'note'

type LeadSubmitEvent = Extract<AnalyticsEvent, { name: 'lead_submit' }>
type LeadSubmitForbiddenKeys = Extract<
  keyof LeadSubmitEvent,
  ForbiddenAnalyticsField
>
type AssertNoForbiddenKeys<T extends never> = T
export type LeadSubmitHasNoForbiddenKeys =
  AssertNoForbiddenKeys<LeadSubmitForbiddenKeys>

const launchEvents = [
  {
    name: 'product_view',
    product: {
      id: 'gid://shopify/Product/1',
      handle: 'english-breakfast',
      title: 'English Breakfast',
    },
  },
  {
    name: 'search',
    resultCount: 12,
  },
  {
    name: 'add_to_cart',
    item: {
      id: 'gid://shopify/Product/1',
      handle: 'english-breakfast',
      title: 'English Breakfast',
      variantId: 'gid://shopify/ProductVariant/1',
      quantity: 2,
    },
  },
  {
    name: 'cart_update',
    action: 'quantity_change',
    quantity: 3,
  },
  {
    name: 'checkout_start',
    cartIdPresent: true,
  },
  {
    name: 'lead_submit',
    kind: 'newsletter',
  },
  {
    name: 'lead_submit',
    kind: 'contact',
  },
  {
    name: 'lead_submit',
    kind: 'wholesale',
  },
  {
    name: 'lead_submit',
    kind: 'npd',
  },
] as const satisfies readonly AnalyticsEvent[]

function collectKeys(value: unknown): string[] {
  if (!value || typeof value !== 'object') return []

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectKeys(item))
  }

  return Object.entries(value).flatMap(([key, child]) => [
    key,
    ...collectKeys(child),
  ])
}

afterEach(() => {
  clearCapturedAnalyticsEvents()
  vi.unstubAllGlobals()
})

describe('analytics adapter', () => {
  test('does not dispatch when analytics consent is denied', async () => {
    const destination = createFakeAnalyticsDestination()

    const result = await dispatchAnalyticsEvent(
      launchEvents[0],
      rejectOptionalConsent(),
      [destination],
    )

    expect(result).toEqual({
      dispatched: 0,
      skipped: 1,
    })
    expect(getCapturedAnalyticsEvents()).toHaveLength(0)
  })

  test('safely no-ops when no destination exists', async () => {
    await expect(
      dispatchAnalyticsEvent(launchEvents[0], grantOptionalConsent()),
    ).resolves.toEqual({
      dispatched: 0,
      skipped: 0,
    })
  })

  test('fake sink captures product, search, cart, checkout, and lead surfaces', async () => {
    const adapter = createAnalyticsAdapter(grantOptionalConsent(), [
      createFakeAnalyticsDestination(),
    ])

    for (const event of launchEvents) {
      await adapter.dispatch(event)
    }

    expect(getCapturedAnalyticsEvents()).toEqual(launchEvents)
    expect(getCapturedAnalyticsEvents().map((event) => event.name)).toEqual([
      'product_view',
      'search',
      'add_to_cart',
      'cart_update',
      'checkout_start',
      'lead_submit',
      'lead_submit',
      'lead_submit',
      'lead_submit',
    ])
    expect(
      getCapturedAnalyticsEvents()
        .filter((event) => event.name === 'lead_submit')
        .map((event) => event.kind),
    ).toEqual(['newsletter', 'contact', 'wholesale', 'npd'])
  })

  test('real destinations can be disabled by consent-specific checks', async () => {
    const dispatch = vi.fn()
    const destination: AnalyticsDestination = {
      id: 'disabled',
      category: 'analytics',
      isEnabled: () => false,
      dispatch,
    }

    const result = await dispatchAnalyticsEvent(
      launchEvents[0],
      grantOptionalConsent(),
      [destination],
    )

    expect(result).toEqual({
      dispatched: 0,
      skipped: 1,
    })
    expect(dispatch).not.toHaveBeenCalled()
  })

  test('local and CI destination selection uses the fake sink by default', () => {
    expect(
      createDefaultAnalyticsDestinations({
        NODE_ENV: 'development',
        NEXT_PUBLIC_GA4_MEASUREMENT_ID: 'G-PRODUCTION',
      }).map((destination) => destination.id),
    ).toEqual(['fake'])

    expect(
      createDefaultAnalyticsDestinations({
        CI: 'true',
        NODE_ENV: 'production',
        NEXT_PUBLIC_GA4_MEASUREMENT_ID: 'G-PRODUCTION',
      }).map((destination) => destination.id),
    ).toEqual(['fake'])
  })
})

describe('GA4 analytics destination', () => {
  test('maps ecommerce events without forbidden lead contact fields', () => {
    const mappedEvents = launchEvents.map((event) =>
      mapAnalyticsEventToGa4(event),
    )

    expect(mappedEvents).toContainEqual({
      eventName: 'view_item',
      payload: {
        items: [
          {
            item_id: 'gid://shopify/Product/1',
            item_name: 'English Breakfast',
          },
        ],
      },
    })
    expect(mappedEvents).toContainEqual({
      eventName: 'begin_checkout',
      payload: {
        cart_id_present: true,
      },
    })

    const forbiddenKeys = new Set<string>([
      'email',
      'phone',
      'message',
      'firstName',
      'lastName',
      'company',
      'address',
      'note',
    ])

    for (const event of launchEvents) {
      const keys = collectKeys(event)
      expect(keys.filter((key) => forbiddenKeys.has(key))).toEqual([])
    }

    for (const mappedEvent of mappedEvents) {
      const keys = collectKeys(mappedEvent.payload)
      expect(keys.filter((key) => forbiddenKeys.has(key))).toEqual([])
    }
  })

  test('does not map visitor-entered search terms or cart line identifiers', () => {
    const searchEvent: Extract<AnalyticsEvent, { name: 'search' }> = {
      name: 'search',
      resultCount: 12,
    }
    const cartUpdateEvent: Extract<
      AnalyticsEvent,
      { name: 'cart_update' }
    > = {
      name: 'cart_update',
      action: 'quantity_change',
      quantity: 3,
    }

    expect(mapAnalyticsEventToGa4(searchEvent)).toEqual({
      eventName: 'search',
      payload: {
        results_count: 12,
      },
    })
    expect(mapAnalyticsEventToGa4(cartUpdateEvent)).toEqual({
      eventName: 'cart_update',
      payload: {
        cart_action: 'quantity_change',
        quantity: 3,
      },
    })
  })
})

describe('analytics launch runbook contract', () => {
  test('documents destination verification and owner-gated launch steps', () => {
    const runbook = readFileSync(
      'docs/launch/analytics-and-indexing-runbook.md',
      'utf8',
    )

    for (const requiredText of [
      'Pre-Cutover Analytics Verification',
      'Post-Cutover Analytics Verification',
      'Owner-Gated Purchase And Order Tracking',
      'NEXT_PUBLIC_GA4_MEASUREMENT_ID',
      'fake/test sink',
    ]) {
      expect(runbook).toContain(requiredText)
    }
  })
})
