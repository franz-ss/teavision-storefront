import Image from 'next/image'
import Link from 'next/link'
import { Check, ShoppingBag } from 'lucide-react'

import { Button, Card, Price } from '@/components/ui'
import { getSizedShopifyImageUrl } from '@/lib/shopify/image-url'
import {
  getVariantMaximumQuantity,
  getVariantMinimumQuantity,
  getVariantQuantityIncrement,
} from '@/lib/shopify/quantity-rules'
import type { Cart } from '@/lib/shopify/types'

import { CartCheckoutForm } from './cart-checkout-form'
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

function TrustSignalList({ layout }: { layout: 'inline' | 'stacked' }) {
  if (layout === 'inline') {
    return (
      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {TRUST_SIGNALS.map((signal) => (
          <span
            key={signal}
            className="type-caption text-muted inline-flex items-center gap-1.5"
          >
            <Check
              className="text-success-text h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            />
            {signal}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="border-default mt-4 space-y-2.5 border-t pt-4">
      {TRUST_SIGNALS.map((signal) => (
        <div key={signal} className="flex items-start gap-2">
          <Check
            className="text-success-text mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          <span className="type-caption text-muted">{signal}</span>
        </div>
      ))}
    </div>
  )
}

export function CartView({ cart }: CartViewProps) {
  if (!cart || cart.totalQuantity === 0) {
    return (
      <div className="py-16 text-center sm:py-24">
        <div className="bg-surface-sunken mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl">
          <ShoppingBag
            className="text-muted h-10 w-10"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>
        <h2 className="type-heading-02 text-strong">Your cart is empty</h2>
        <p className="type-body text-muted mx-auto mt-3 max-w-lg">
          Browse our range of 1,000+ teas, herbs, and spices, or get in touch to
          set up a wholesale account.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/collections/all" variant="brand" size="cta">
            Browse collections
          </Button>
          <Button href="/pages/wholesale" variant="secondary" size="md">
            Apply for wholesale
          </Button>
        </div>
        <TrustSignalList layout="inline" />
      </div>
    )
  }

  const itemCountLabel =
    cart.totalQuantity === 1 ? '1 item' : `${cart.totalQuantity} items`

  return (
    <>
      <div className="grid gap-8 pb-24 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start xl:gap-10 xl:pb-0">
        <div className="min-w-0">
          <Card padding="md">
            {/* Desktop table header */}
            <div className="text-muted border-default hidden border-b pb-3 xl:grid xl:grid-cols-[6rem_minmax(0,1fr)_7rem_10rem_7rem] xl:items-center xl:gap-x-6">
              <span className="type-caption">Photo</span>
              <span className="type-caption">Name</span>
              <span className="type-caption">Price/kg</span>
              <span className="type-caption text-center">Quantity/kg</span>
              <span className="type-caption text-right">Total</span>
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
                    className="border-default bg-surface grid grid-cols-[5rem_minmax(0,1fr)] gap-x-4 gap-y-4 rounded-md border p-4 sm:grid-cols-[6rem_minmax(0,1fr)] sm:p-5 lg:grid-cols-[5rem_minmax(0,1fr)_auto_auto] lg:items-center xl:grid-cols-[6rem_minmax(0,1fr)_7rem_10rem_7rem] xl:items-start xl:gap-x-6 xl:rounded-none xl:border-0 xl:bg-transparent xl:p-0 xl:py-5"
                  >
                    {/* Product image */}
                    <Link
                      href={productHref}
                      className="bg-surface-sunken focus-visible:ring-ring relative row-span-3 aspect-square w-20 overflow-hidden rounded focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:w-24 lg:row-span-1 xl:row-span-2 xl:w-24"
                      aria-label={`View ${product.title}`}
                    >
                      {productImage ? (
                        <Image
                          src={getSizedShopifyImageUrl(productImage.url, 200)}
                          alt=""
                          width={productImage.width ?? 200}
                          height={productImage.height ?? 200}
                          sizes="(min-width: 1280px) 6rem, (min-width: 640px) 6rem, 5rem"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span
                          className="block h-full w-full"
                          aria-hidden="true"
                        />
                      )}
                    </Link>

                    {/* Product info */}
                    <div className="min-w-0 flex-1">
                      <h3>
                        <Link
                          href={productHref}
                          className="text-strong focus-visible:ring-ring line-clamp-2 rounded-md font-medium wrap-break-word hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                        >
                          {product.title}
                        </Link>
                      </h3>
                      {variantTitle ? (
                        <p className="type-body-sm text-muted mt-1 wrap-break-word">
                          {variantTitle}
                        </p>
                      ) : null}
                      {/* Mobile price — hidden on desktop where it has its own column */}
                      <div className="mt-2 xl:hidden">
                        <Price
                          price={line.cost.totalAmount}
                          size="md"
                          className="text-strong font-medium"
                        />
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
                      {/* Desktop discount info — shown under name */}
                      {hasDiscounts ? (
                        <div className="mt-2 hidden flex-col gap-1 xl:flex">
                          {line.discountAllocations.map((discount, index) => (
                            <p
                              key={`${discount.title ?? 'discount'}-${index}-desktop-name`}
                              className="type-caption text-success-text flex min-w-0 items-center gap-1"
                            >
                              <Check
                                className="h-3.5 w-3.5 shrink-0"
                                aria-hidden="true"
                              />
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

                    {/* Desktop unit price column */}
                    <div className="hidden xl:col-start-3 xl:row-start-1 xl:block">
                      <Price
                        price={line.cost.amountPerQuantity}
                        size="md"
                        className="text-strong font-medium"
                      />
                    </div>

                    {/* Quantity stepper + Remove (from CartLineActions) */}
                    <CartLineActions
                      lineId={line.id}
                      maximumQuantity={getVariantMaximumQuantity(
                        line.merchandise,
                      )}
                      minimumQuantity={getVariantMinimumQuantity(
                        line.merchandise,
                      )}
                      productTitle={product.title}
                      quantity={line.quantity}
                      quantityIncrement={getVariantQuantityIncrement(
                        line.merchandise,
                      )}
                    />

                    {/* Desktop line total column */}
                    <div className="hidden text-right xl:col-start-5 xl:row-start-1 xl:block">
                      <Price
                        price={line.cost.totalAmount}
                        size="md"
                        className="text-strong font-medium"
                      />
                      {hasDiscounts ? (
                        <div className="mt-1 flex flex-col gap-1">
                          {line.discountAllocations.map((discount, index) => (
                            <p
                              key={`${discount.title ?? 'discount'}-${index}-total`}
                              className="type-caption text-success-text flex justify-end gap-1"
                            >
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
          </Card>

          {/* Packaging note */}
          <p className="type-caption text-muted border-default bg-brand-subtle mt-6 rounded-md border px-3 py-2.5 leading-snug">
            <span className="font-semibold">Note:</span> When ordering in sizes
            over 1kg, your package may not be packed in individual 1kg bags and
            will instead come in bulk packed bags (2kg 5kg 10kg etc)
          </p>

          {/* Order notes, terms, and checkout actions */}
          <CartCheckoutForm checkoutUrl={cart.checkoutUrl} />
        </div>

        {/* Order summary sidebar */}
        <aside
          aria-label="Order summary"
          className="border-default bg-surface rounded-lg border p-4 sm:p-6 xl:sticky xl:top-24"
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

          <TrustSignalList layout="stacked" />
        </aside>
      </div>

      {/* Sticky mobile checkout bar */}
      <div
        className="border-default bg-surface shadow-3 fixed inset-x-0 bottom-0 z-40 border-t xl:hidden"
        aria-label="Checkout"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="min-w-0">
            <p className="type-caption text-muted">Subtotal</p>
            <p className="type-heading-05 text-strong tabular-nums">
              <Price price={cart.cost.subtotalAmount} size="lg" />
            </p>
          </div>
          <Button
            href={cart.checkoutUrl}
            size="cta"
            className="shrink-0"
            aria-label="Proceed to checkout"
          >
            Checkout
          </Button>
        </div>
      </div>
    </>
  )
}
