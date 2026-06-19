import type { Money } from '@/lib/shopify/types'

export function formatAccountOrderDate(value: string): string {
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function formatOrderStatus(value: string | null): string {
  if (!value) return 'Unknown'

  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function formatFulfillmentStatus(value: string | null): string {
  if (!value) return 'Not fulfilled'

  return formatOrderStatus(value)
}

export function formatAccountMoney(value: Money): string {
  return new Intl.NumberFormat('en-AU', {
    currency: value.currencyCode,
    style: 'currency',
  }).format(Number(value.amount))
}
