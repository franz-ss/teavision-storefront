import type { Money } from '@/lib/shopify/types'

export function makeMoney(amount = '10.00', currencyCode = 'AUD'): Money {
  return { amount, currencyCode }
}
