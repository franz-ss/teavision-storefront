import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { Minus, Plus } from 'lucide-react'

import {
  getCartAction,
  updateCartLineAction,
  removeCartLineAction,
} from '@/lib/cart/actions'
import { Button, IconButton, Price } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Your Cart',
}

async function CartContent() {
  const cart = await getCartAction()

  if (!cart || cart.totalQuantity === 0) {
    return (
      <div className="text-center">
        <p className="text-muted mb-6">Your cart is empty.</p>
        <Link
          href="/collections/all"
          className="bg-action-primary text-action-primary-text hover:bg-action-primary-hover inline-block rounded px-6 py-3 font-medium focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <>
      <ul className="divide-y" role="list">
        {cart.lines.map((line) => {
          const decreaseAction = updateCartLineAction.bind(
            null,
            line.id,
            Math.max(1, line.quantity - 1),
          )
          const increaseAction = updateCartLineAction.bind(
            null,
            line.id,
            line.quantity + 1,
          )
          const removeAction = removeCartLineAction.bind(null, line.id)
          const hasDiscounts = line.discountAllocations.length > 0

          return (
            <li key={line.id} className="flex items-center gap-4 py-6">
              <div
                className="bg-surface h-20 w-20 shrink-0 rounded"
                role="img"
                aria-label={`${line.merchandise.product.title} image`}
              />

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {line.merchandise.product.title}
                </p>
                <p className="text-muted text-sm">{line.merchandise.title}</p>
              </div>

              <div className="flex items-center gap-2">
                <form action={decreaseAction}>
                  <IconButton
                    type="submit"
                    size="sm"
                    aria-label={`Decrease quantity of ${line.merchandise.product.title}`}
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </IconButton>
                </form>
                <span aria-label={`Quantity: ${line.quantity}`}>
                  {line.quantity}
                </span>
                <form action={increaseAction}>
                  <IconButton
                    type="submit"
                    size="sm"
                    aria-label={`Increase quantity of ${line.merchandise.product.title}`}
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </IconButton>
                </form>
              </div>

              <div className="w-28 text-right">
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
                          <Price price={discount.discountedAmount} size="sm" />
                        </span>
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>

              <form action={removeAction}>
                <Button variant="ghost" size="sm" type="submit">
                  Remove
                </Button>
              </form>
            </li>
          )
        })}
      </ul>

      <div className="border-default mt-8 rounded border p-6">
        <div className="flex justify-between text-lg font-semibold">
          <span>Subtotal</span>
          <Price price={cart.cost.subtotalAmount} size="lg" />
        </div>
        <p className="text-muted mt-1 text-sm">
          Shipping and taxes calculated at checkout.
        </p>

        <a
          href={cart.checkoutUrl}
          className="bg-action-primary text-action-primary-text hover:bg-action-primary-hover mt-4 block w-full rounded py-3 text-center font-medium focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label="Proceed to checkout"
        >
          Checkout
        </a>

        <Link
          href="/collections/all"
          className="text-muted mt-3 block text-center text-sm hover:underline focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Continue shopping
        </Link>
      </div>
    </>
  )
}

export default function CartPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-medium">Your Cart</h1>
      <Suspense
        fallback={
          <p className="text-muted" aria-live="polite">
            Loading cart…
          </p>
        }
      >
        <CartContent />
      </Suspense>
    </div>
  )
}
