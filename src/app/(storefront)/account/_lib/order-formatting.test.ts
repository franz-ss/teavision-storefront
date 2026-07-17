import { describe, expect, test } from 'vitest'

import {
  formatAccountMoney,
  formatAccountOrderDate,
  formatFulfillmentStatus,
  formatOrderStatus,
} from './order-formatting'

describe('account order formatting', () => {
  test('formats account order dates for Australia', () => {
    expect(formatAccountOrderDate('2026-06-01T04:20:00Z')).toBe('01/06/2026')
  })

  test('formats Shopify statuses into customer-friendly labels', () => {
    expect(formatOrderStatus('PARTIALLY_REFUNDED')).toBe('Partially Refunded')
    expect(formatFulfillmentStatus(null)).toBe('Not fulfilled')
  })

  test('formats money values', () => {
    expect(formatAccountMoney({ amount: '148.50', currencyCode: 'AUD' })).toBe(
      '$148.50',
    )
  })
})
