import { describe, expect, test } from 'vitest'

import {
  clampQuantity,
  getVariantMaximumQuantity,
  getVariantMinimumQuantity,
  getVariantQuantityIncrement,
} from './quantity-rules'
import type { ProductVariant } from './types'

const variant: ProductVariant = {
  id: 'gid://shopify/ProductVariant/test',
  title: 'Carton',
  availableForSale: true,
  currentlyNotInStock: false,
  quantityAvailable: 12,
  quantityRule: {
    minimum: 5,
    maximum: 20,
    increment: 5,
  },
  price: { amount: '24.00', currencyCode: 'AUD' },
  quantityPriceBreaks: [],
  image: null,
}

describe('Shopify quantity rules', () => {
  test('derives minimum, maximum, and increment from variant constraints', () => {
    expect(getVariantMinimumQuantity(variant)).toBe(5)
    expect(getVariantMaximumQuantity(variant)).toBe(12)
    expect(getVariantQuantityIncrement(variant)).toBe(5)
  })

  test('rounds quantities down to the nearest valid increment from the minimum', () => {
    expect(
      clampQuantity({
        maximumQuantity: 20,
        minimumQuantity: 5,
        quantityIncrement: 5,
        value: 14,
      }),
    ).toBe(10)
  })

  test('keeps impossible maximum values from producing a below-minimum quantity', () => {
    expect(
      clampQuantity({
        maximumQuantity: 0,
        minimumQuantity: 1,
        quantityIncrement: 1,
        value: 1,
      }),
    ).toBe(1)
  })

  test('does not return an unaligned maximum as a valid quantity', () => {
    expect(
      clampQuantity({
        maximumQuantity: 12,
        minimumQuantity: 5,
        quantityIncrement: 5,
        value: 12,
      }),
    ).toBe(10)
  })
})
