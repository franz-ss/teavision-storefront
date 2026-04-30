import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

import {
  getCartAction,
  updateCartLineAction,
  removeCartLineAction,
} from '@/lib/cart/actions'
import { Button } from '@/components/ui/button'
import { Price } from '@/components/ui/price'

export const metadata: Metadata = {
  title: 'Your Cart',
}

async function CartContent() {
  const cart = await getCartAction()

  if (!cart || cart.totalQuantity === 0) {
    return (
      <div className="text-center">
        <p className="text-text-muted mb-6">Your cart is empty.</p>
        <Link
          href="/collections/all"
          className="bg-primary text-background hover:bg-primary-hover inline-block rounded px-6 py-3 font-medium focus-visible:ring-2 focus-visible:ring-offset-2"
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
                <p className="text-text-muted text-sm">
                  {line.merchandise.title}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <form action={decreaseAction}>
                  <button
                    type="submit"
                    aria-label={`Decrease quantity of ${line.merchandise.product.title}`}
                    className="border-border hover:border-primary flex h-8 w-8 items-center justify-center rounded border focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    &minus;
                  </button>
                </form>
                <span aria-label={`Quantity: ${line.quantity}`}>
                  {line.quantity}
                </span>
                <form action={increaseAction}>
                  <button
                    type="submit"
                    aria-label={`Increase quantity of ${line.merchandise.product.title}`}
                    className="border-border hover:border-primary flex h-8 w-8 items-center justify-center rounded border focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    +
                  </button>
                </form>
              </div>

              <div className="w-20 text-right">
                <Price price={line.merchandise.price} size="md" />
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

      <div className="border-border mt-8 rounded border p-6">
        <div className="flex justify-between text-lg font-semibold">
          <span>Subtotal</span>
          <Price price={cart.cost.subtotalAmount} size="lg" />
        </div>
        <p className="text-text-muted mt-1 text-sm">
          Shipping and taxes calculated at checkout.
        </p>

        <a
          href={cart.checkoutUrl}
          className="bg-primary text-background hover:bg-primary-hover mt-4 block w-full rounded py-3 text-center font-medium focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label="Proceed to checkout"
        >
          Checkout
        </a>

        <Link
          href="/collections/all"
          className="text-text-muted mt-3 block text-center text-sm hover:underline focus-visible:ring-2 focus-visible:ring-offset-2"
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
      <h1 className="mb-8 text-2xl font-bold">Your Cart</h1>
      <Suspense
        fallback={
          <p className="text-text-muted" aria-live="polite">
            Loading cart…
          </p>
        }
      >
        <CartContent />
      </Suspense>
    </div>
  )
}
