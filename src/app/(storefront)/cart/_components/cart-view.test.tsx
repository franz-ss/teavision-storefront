/**
 * @vitest-environment jsdom
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import {
  makeCart,
  makeCartLine,
  makeDiscountAllocation,
} from '@/tests/fixtures/shopify/cart'
import { makeMoney } from '@/tests/fixtures/shopify/money'

import { CartView } from './cart-view'

vi.mock('@/lib/cart/actions', () => ({
  cartLineFormAction: vi.fn(),
}))

function getTextContent(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

describe('CartView', () => {
  it('shows original and discounted unit and line totals for bulk discounted lines', () => {
    const html = renderToStaticMarkup(
      <CartView
        cart={makeCart({
          cost: {
            subtotalAmount: makeMoney('1626.00'),
            totalAmount: makeMoney('1382.10'),
          },
          lines: [
            makeCartLine({
              quantity: 40,
              cost: {
                amountPerQuantity: makeMoney('40.65'),
                compareAtAmountPerQuantity: null,
                subtotalAmount: makeMoney('1626.00'),
                totalAmount: makeMoney('1382.10'),
              },
              discountAllocations: [
                makeDiscountAllocation({
                  title: 'Bulk discount',
                  discountedAmount: makeMoney('243.90'),
                }),
              ],
              merchandise: {
                ...makeCartLine().merchandise,
                title: '250g/box',
                product: {
                  ...makeCartLine().merchandise.product,
                  title: 'Bulk Eligible Tea',
                },
              },
            }),
          ],
        })}
      />,
    )

    expect(html).toContain('Price/kg')
    expect(html).toContain('Quantity/kg')
    expect(html).toContain('aria-label="Was $40.65"')
    expect(html).toContain('aria-label="Now $34.55"')
    expect(html).toContain('aria-label="Was $1,626.00"')
    expect(html).toContain('aria-label="Now $1,382.10"')
    expect(html).toContain('>40<')
    expect(html).toContain('Remove')
    expect(html).not.toContain('Bulk discount')
  })

  it('prompts for the next percentage bulk tier when fixed tier prices are unavailable', () => {
    const html = renderToStaticMarkup(
      <CartView
        cart={makeCart({
          cost: {
            subtotalAmount: makeMoney('624.92'),
            totalAmount: makeMoney('624.92'),
          },
          lines: [
            makeCartLine({
              quantity: 34,
              cost: {
                amountPerQuantity: makeMoney('18.38'),
                compareAtAmountPerQuantity: null,
                subtotalAmount: makeMoney('624.92'),
                totalAmount: makeMoney('624.92'),
              },
              discountAllocations: [],
              merchandise: {
                ...makeCartLine().merchandise,
                title: '250g',
                quantityPriceBreaks: [
                  {
                    minimumQuantity: 30,
                    discountPercent: 12,
                  },
                  {
                    minimumQuantity: 40,
                    discountPercent: 15,
                  },
                ],
                product: {
                  ...makeCartLine().merchandise.product,
                  title: 'Organic Raw Sticky Chai',
                },
              },
            }),
          ],
        })}
      />,
    )

    expect(html).toContain('Buy 6 more and get 15% on each product')
    expect(html).toContain(
      '<h3 class="text-strong w-full font-sans leading-normal font-medium wrap-break-word">',
    )
    expect(html).not.toContain('line-clamp-2')
    expect(html).toContain('aria-label="Was $18.38"')
    expect(html).toContain('aria-label="Now $16.17"')
    expect(html).toContain('aria-label="Was $624.92"')
    expect(html).toContain('aria-label="Now $549.93"')
    expect(getTextContent(html)).toContain(
      'Congratulations! You saved $74.99 by buying in bulk!',
    )
  })

  it('keeps non-bulk discount labels visible when a line has discounted totals', () => {
    const html = renderToStaticMarkup(
      <CartView
        cart={makeCart({
          cost: {
            subtotalAmount: makeMoney('100.00'),
            totalAmount: makeMoney('90.00'),
          },
          lines: [
            makeCartLine({
              quantity: 4,
              cost: {
                amountPerQuantity: makeMoney('25.00'),
                compareAtAmountPerQuantity: null,
                subtotalAmount: makeMoney('100.00'),
                totalAmount: makeMoney('90.00'),
              },
              discountAllocations: [
                makeDiscountAllocation({
                  title: 'Welcome discount',
                  discountedAmount: makeMoney('10.00'),
                }),
              ],
            }),
          ],
        })}
      />,
    )

    expect(html).toContain('Welcome discount')
    expect(html).toContain('aria-label="Was $100.00"')
    expect(html).toContain('aria-label="Now $90.00"')
  })
})
