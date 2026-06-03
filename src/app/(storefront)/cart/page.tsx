import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

import { getCartAction } from '@/lib/cart/actions'
import { getSizedShopifyImageUrl } from '@/lib/shopify/image-url'
import { Button, Price } from '@/components/ui'

import { CartLineActions } from './_components/cart-line-actions'

export const metadata: Metadata = {
  title: 'Your Cart',
}

async function CartContent() {
  const cart = await getCartAction()

  if (!cart || cart.totalQuantity === 0) {
    return (
      <div className="border-default bg-surface mx-auto max-w-md rounded-md border p-6 text-center sm:p-8">
        <p className="type-heading-04 text-strong">Your cart is empty.</p>
        <p className="type-body-sm text-muted mt-2">
          Browse retail samples, loose leaf teas, herbs, and spices when you are
          ready to build an order.
        </p>
        <Button href="/collections/all" className="mt-6 w-full sm:w-auto">
          Continue shopping
        </Button>
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
          <span className="type-caption col-start-3 text-center">
            Quantity
          </span>
          <span className="type-caption col-start-4 text-right">Total</span>
        </div>
        <ul
          className="space-y-4 xl:divide-y xl:divide-border xl:space-y-0"
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
                className="border-default bg-surface grid grid-cols-[5rem_minmax(0,1fr)] gap-x-4 gap-y-4 rounded-md border p-4 sm:grid-cols-[6rem_minmax(0,1fr)] sm:p-5 xl:grid-cols-[5rem_minmax(0,1fr)_auto_7rem_auto] xl:items-center xl:rounded-none xl:border-0 xl:bg-transparent xl:px-0 xl:py-6"
              >
                <Link
                  href={productHref}
                  className="bg-surface-sunken focus-visible:ring-ring relative row-span-3 aspect-square w-20 overflow-hidden rounded focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:w-24 xl:row-span-1 xl:w-20"
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
                  <Link
                    href={productHref}
                    className="text-strong focus-visible:ring-ring line-clamp-2 min-h-10 wrap-break-word rounded-md py-2 font-medium hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    {product.title}
                  </Link>
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
                  productTitle={product.title}
                  quantity={line.quantity}
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
                          <span className="truncate">
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

      <div className="border-default bg-surface rounded-md border p-4 sm:p-6 xl:sticky xl:top-24">
        <h2 className="type-heading-04 text-strong">Order summary</h2>
        <div className="border-default mt-5 space-y-3 border-t pt-5">
          <div className="type-body-sm flex justify-between gap-4">
            <span className="text-muted">Items</span>
            <span className="text-strong font-medium">{itemCountLabel}</span>
          </div>
          <div className="flex justify-between gap-4 text-lg font-semibold">
            <span>Subtotal</span>
            <Price price={cart.cost.subtotalAmount} size="lg" />
          </div>
        </div>
        <p className="text-muted mt-1 text-sm">
          Shipping and taxes calculated at checkout.
        </p>

        <a
          href={cart.checkoutUrl}
          className="bg-action-primary text-action-primary-text hover:bg-action-primary-hover focus-visible:ring-ring mt-4 flex min-h-12 w-full items-center justify-center rounded-md px-5 text-center font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          aria-label="Proceed to checkout"
        >
          Checkout
        </a>

        <Link
          href="/collections/all"
          className="text-muted focus-visible:ring-ring mt-3 flex min-h-11 items-center justify-center text-center text-sm hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  )
}

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8 lg:px-8">
      <h1 className="type-heading-02 mb-6">Your Cart</h1>
      <Suspense
        fallback={
          <div
            className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start"
            role="status"
            aria-live="polite"
          >
            <span className="sr-only">Loading cart</span>
            <div className="space-y-4">
              {Array.from({ length: 2 }, (_, index) => (
                <div
                  key={index}
                  className="border-default bg-surface grid grid-cols-[5rem_minmax(0,1fr)] gap-x-4 gap-y-4 rounded-md border p-4 sm:grid-cols-[6rem_minmax(0,1fr)] sm:p-5 xl:grid-cols-[5rem_minmax(0,1fr)_auto_7rem_auto] xl:items-center xl:rounded-none xl:border-0 xl:bg-transparent xl:px-0 xl:py-6"
                >
                  <div className="bg-surface-sunken row-span-3 aspect-square w-20 animate-pulse rounded motion-reduce:animate-none sm:w-24 xl:row-span-1 xl:w-20" />
                  <div className="flex min-w-0 flex-col gap-2">
                    <div className="bg-surface-sunken h-5 w-3/4 animate-pulse rounded motion-reduce:animate-none" />
                    <div className="bg-surface-sunken h-4 w-1/2 animate-pulse rounded motion-reduce:animate-none" />
                    <div className="bg-surface-sunken h-5 w-24 animate-pulse rounded motion-reduce:animate-none xl:hidden" />
                  </div>
                  <div className="bg-surface-sunken col-start-2 h-11 w-40 animate-pulse rounded motion-reduce:animate-none xl:col-start-auto" />
                  <div className="bg-surface-sunken hidden h-6 w-24 animate-pulse rounded motion-reduce:animate-none xl:block" />
                  <div className="bg-surface-sunken col-start-2 h-11 w-full animate-pulse rounded motion-reduce:animate-none xl:col-start-auto xl:w-20" />
                </div>
              ))}
            </div>
            <div className="border-default bg-surface rounded-md border p-4 sm:p-6">
              <div className="bg-surface-sunken h-7 w-40 animate-pulse rounded motion-reduce:animate-none" />
              <div className="bg-surface-sunken mt-5 h-6 w-full animate-pulse rounded motion-reduce:animate-none" />
              <div className="bg-surface-sunken mt-4 h-12 w-full animate-pulse rounded motion-reduce:animate-none" />
            </div>
          </div>
        }
      >
        <CartContent />
      </Suspense>
    </div>
  )
}
