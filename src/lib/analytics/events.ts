export type LeadSubmitKind = 'newsletter' | 'contact' | 'wholesale' | 'npd'

export type AnalyticsItem = {
  id?: string
  handle?: string
  title?: string
  variantId?: string
  quantity?: number
}

export type AnalyticsEvent =
  | {
      name: 'product_view'
      product: Pick<AnalyticsItem, 'id' | 'handle' | 'title'>
    }
  | {
      name: 'search'
      resultCount: number
    }
  | {
      name: 'add_to_cart'
      item: Pick<AnalyticsItem, 'id' | 'handle' | 'title' | 'variantId'> & {
        quantity: number
      }
    }
  | {
      name: 'cart_update'
      action: 'quantity_change' | 'remove'
      quantity?: number
    }
  | {
      name: 'checkout_start'
      cartIdPresent: boolean
    }
  | {
      name: 'lead_submit'
      kind: LeadSubmitKind
    }

export const ANALYTICS_EVENT_NAMES = [
  'product_view',
  'search',
  'add_to_cart',
  'cart_update',
  'checkout_start',
  'lead_submit',
] as const satisfies readonly AnalyticsEvent['name'][]

export function createProductViewEvent(
  product: Extract<AnalyticsEvent, { name: 'product_view' }>['product'],
): AnalyticsEvent {
  return {
    name: 'product_view',
    product,
  }
}

export function createSearchEvent({
  resultCount,
}: {
  resultCount: number
}): AnalyticsEvent {
  return {
    name: 'search',
    resultCount,
  }
}

export function createAddToCartEvent({
  quantity,
  variantId,
}: {
  quantity: number
  variantId: string
}): AnalyticsEvent {
  return {
    name: 'add_to_cart',
    item: {
      quantity,
      variantId,
    },
  }
}

export function createCartUpdateEvent({
  action,
  quantity,
}: {
  action: Extract<AnalyticsEvent, { name: 'cart_update' }>['action']
  quantity?: number
}): AnalyticsEvent {
  return {
    name: 'cart_update',
    action,
    quantity,
  }
}

export function createCheckoutStartEvent({
  cartIdPresent,
}: {
  cartIdPresent: boolean
}): AnalyticsEvent {
  return {
    name: 'checkout_start',
    cartIdPresent,
  }
}

export function createLeadSubmitEvent(kind: LeadSubmitKind): AnalyticsEvent {
  return {
    name: 'lead_submit',
    kind,
  }
}
