import Image from 'next/image'
import Link from 'next/link'

import { Button, Price } from '@/components/ui'
import { getSizedShopifyImageUrl } from '@/lib/shopify/image-url'
import {
  getVariantMaximumQuantity,
  getVariantMinimumQuantity,
  getVariantQuantityIncrement,
} from '@/lib/shopify/quantity-rules'
import type { Cart } from '@/lib/shopify/types'

import { CartLineActions } from './cart-line-actions'

type CartViewProps = {
  cart: Cart | null
}

const TRUST_SIGNALS = [
  '1,000+ businesses served',
  'ACO Organic certified',
  'HACCP certified',
  'Sourced from 15+ countries',
]

export function CartView({ cart }: CartViewProps) {
  if (!cart || cart.totalQuantity === 0) {
    return (
      <div>
        <div className="text-center">
          <h2 className="type-heading-02 text-strong">Your cart is empty</h2>
          <p className="type-body text-muted mx-auto mt-3 max-w-lg">
            Browse our range of 1,000+ teas, herbs, and spices, or get in touch
            to set up a wholesale account.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/pages/wholesale" variant="brand" size="cta">
              Apply for wholesale
            </Button>
            <Button href="/collections/all" variant="secondary" size="md">
              Browse collections
            </Button>
          </div>
          <p className="type-body-sm text-muted mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            {TRUST_SIGNALS.map((signal, i) => (
              <span key={signal} className="inline-flex items-center gap-2">
                {i > 0 && (
                  <span className="text-subtle" aria-hidden="true">
                    ·
                  </span>
                )}
                {signal}
              </span>
            ))}
          </p>
        </div>
      </div>
    )
  }

  const itemCountLabel =
    cart.totalQuantity === 1 ? '1 item' : `${cart.totalQuantity} items`

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">
      <div className="min-w-0">
        <div className="border-default text-muted hidden border-b pb-3 xl:grid xl:grid-cols-[5rem_minmax(0,1fr)_auto_7rem_auto] xl:items-center xl:gap-x-4">
          <span className="type-caption col-start-2">Product</span>
          <span className="type-caption col-start-3 text-center">Quantity</span>
          <span className="type-caption col-start-4 text-right">Total</span>
        </div>
        <ul
          className="xl:divide-border space-y-4 xl:space-y-0 xl:divide-y"
          role="list"
          aria-label="Cart items"
        >
          {cart.lines.map((line) => {
            const product = line.merchandise.product
            const productImage = product.featuredImage
            const productHref = `/products/${product.handle}`
            const variantTitle =
              line.merchandise.title === 'Default Title'
                ? null
                : line.merchandise.title
            const hasDiscounts = line.discountAllocations.length > 0

            return (
              <li
                key={line.id}
                className="border-default bg-surface grid grid-cols-[5rem_minmax(0,1fr)] gap-x-4 gap-y-4 rounded-md border p-4 sm:grid-cols-[6rem_minmax(0,1fr)] sm:p-5 lg:grid-cols-[5rem_minmax(0,1fr)_auto_auto] lg:items-center xl:grid-cols-[5rem_minmax(0,1fr)_auto_7rem_auto] xl:rounded-none xl:border-0 xl:bg-transparent xl:px-0 xl:py-6"
              >
                <Link
                  href={productHref}
                  className="bg-surface-sunken focus-visible:ring-ring relative row-span-3 aspect-square w-20 overflow-hidden rounded focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:w-24 lg:row-span-1 lg:w-20"
                  aria-label={`View ${product.title}`}
                >
                  {productImage ? (
                    <Image
                      src={getSizedShopifyImageUrl(productImage.url, 200)}
                      alt=""
                      width={productImage.width ?? 200}
                      height={productImage.height ?? 200}
                      sizes="(min-width: 1280px) 5rem, (min-width: 640px) 6rem, 5rem"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="block h-full w-full" aria-hidden="true" />
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <h3>
                    <Link
                      href={productHref}
                      className="text-strong focus-visible:ring-ring line-clamp-2 min-h-10 rounded-md py-2 font-medium wrap-break-word hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                      {product.title}
                    </Link>
                  </h3>
                  {variantTitle ? (
                    <p className="type-body-sm text-muted mt-1 wrap-break-word">
                      {variantTitle}
                    </p>
                  ) : null}
                  <div className="mt-2 xl:hidden">
                    <Price price={line.cost.totalAmount} size="md" />
                    {hasDiscounts ? (
                      <div className="mt-1 flex flex-col gap-1">
                        {line.discountAllocations.map((discount, index) => (
                          <p
                            key={`${discount.title ?? 'discount'}-${index}-mobile`}
                            className="type-caption text-success-text flex min-w-0 flex-wrap gap-1"
                          >
                            <span className="min-w-0 wrap-break-word">
                              {discount.title ?? 'Discount'}
                            </span>
                            <span className="inline-flex gap-0.5">
                              <span aria-hidden="true">-</span>
                              <Price
                                price={discount.discountedAmount}
                                size="sm"
                              />
                            </span>
                          </p>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                <CartLineActions
                  lineId={line.id}
                  maximumQuantity={getVariantMaximumQuantity(line.merchandise)}
                  minimumQuantity={getVariantMinimumQuantity(line.merchandise)}
                  productTitle={product.title}
                  quantity={line.quantity}
                  quantityIncrement={getVariantQuantityIncrement(
                    line.merchandise,
                  )}
                />

                <div className="hidden w-28 text-right xl:col-start-4 xl:row-start-1 xl:block">
                  <Price price={line.cost.totalAmount} size="md" />
                  {hasDiscounts ? (
                    <div className="mt-1 flex flex-col gap-1">
                      {line.discountAllocations.map((discount, index) => (
                        <p
                          key={`${discount.title ?? 'discount'}-${index}`}
                          className="type-caption text-success-text flex justify-end gap-1"
                        >
                          <span className="min-w-0 wrap-break-word">
                            {discount.title ?? 'Discount'}
                          </span>
                          <span className="inline-flex gap-0.5">
                            <span aria-hidden="true">-</span>
                            <Price
                              price={discount.discountedAmount}
                              size="sm"
                            />
                          </span>
                        </p>
                      ))}
                    </div>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <aside
        aria-label="Order summary"
        className="border-default bg-surface rounded-md border p-4 sm:p-6 xl:sticky xl:top-24"
      >
        <h2 className="type-heading-04 text-strong">Order summary</h2>
        <div className="border-default mt-5 space-y-3 border-t pt-5">
          <div className="type-body-sm flex justify-between gap-4">
            <span className="text-muted">Items</span>
            <span
              className="text-strong font-medium"
              role="status"
              aria-live="polite"
            >
              {itemCountLabel}
            </span>
          </div>
          <div className="type-heading-05 flex justify-between gap-4">
            <span>Subtotal</span>
            <Price price={cart.cost.subtotalAmount} size="lg" />
          </div>
        </div>
        <p className="type-body-sm text-muted mt-1">
          Shipping and taxes calculated at checkout.
        </p>

        <Button
          href={cart.checkoutUrl}
          size="cta"
          className="mt-4 w-full"
          aria-label="Proceed to checkout"
        >
          Checkout
        </Button>

        <Link
          href="/collections/all"
          className="type-body-sm text-muted focus-visible:ring-ring mt-3 flex min-h-11 items-center justify-center text-center hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Continue shopping
        </Link>
      </aside>
    </div>
  )
}
