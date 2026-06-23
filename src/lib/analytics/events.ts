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
      query: string
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
      lineId: string
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
