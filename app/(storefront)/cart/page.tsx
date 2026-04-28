import type { Metadata } from 'next'
import Link from 'next/link'
import {
  getCartAction,
  updateCartLineAction,
  removeCartLineAction,
} from '@/lib/cart/actions'

export const metadata: Metadata = {
  title: 'Your Cart',
}

export default async function CartPage() {
  const cart = await getCartAction()

  if (!cart || cart.totalQuantity === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">Your Cart</h1>
        <p className="mb-6 text-gray-500">Your cart is empty.</p>
        <Link
          href="/collections/all"
          className="inline-block rounded bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Your Cart</h1>

      <ul className="divide-y" role="list">
        {cart.lines.map((line) => {
          const decreaseAction = updateCartLineAction.bind(
            null,
            line.id,
            Math.max(1, line.quantity - 1),
          ) as unknown as () => Promise<void>
          const increaseAction = updateCartLineAction.bind(
            null,
            line.id,
            line.quantity + 1,
          ) as unknown as () => Promise<void>
          const removeAction = removeCartLineAction.bind(
            null,
            line.id,
          ) as unknown as () => Promise<void>

          return (
            <li key={line.id} className="flex items-center gap-4 py-6">
              <div
                className="h-20 w-20 shrink-0 rounded bg-gray-100"
                role="img"
                aria-label={`${line.merchandise.product.title} image`}
              />

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {line.merchandise.product.title}
                </p>
                <p className="text-sm text-gray-500">
                  {line.merchandise.title}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <form action={decreaseAction}>
                  <button
                    type="submit"
                    aria-label={`Decrease quantity of ${line.merchandise.product.title}`}
                    className="flex h-8 w-8 items-center justify-center rounded border hover:border-gray-400 focus-visible:ring-2 focus-visible:ring-offset-2"
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
                    className="flex h-8 w-8 items-center justify-center rounded border hover:border-gray-400 focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    +
                  </button>
                </form>
              </div>

              <p className="w-20 text-right font-medium">
                {line.merchandise.price.currencyCode}{' '}
                {line.merchandise.price.amount}
              </p>

              <form action={removeAction}>
                <button
                  type="submit"
                  aria-label={`Remove ${line.merchandise.product.title} from cart`}
                  className="text-sm text-gray-400 hover:text-gray-800 focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  Remove
                </button>
              </form>
            </li>
          )
        })}
      </ul>

      <div className="mt-8 rounded border p-6">
        <div className="flex justify-between text-lg font-semibold">
          <span>Subtotal</span>
          <span>
            {cart.cost.subtotalAmount.currencyCode}{' '}
            {cart.cost.subtotalAmount.amount}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Shipping and taxes calculated at checkout.
        </p>
        <a
          href={cart.checkoutUrl}
          className="mt-4 block w-full rounded bg-black py-3 text-center font-medium text-white hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label="Proceed to checkout"
        >
          Checkout
        </a>
        <Link
          href="/collections/all"
          className="mt-3 block text-center text-sm text-gray-500 hover:underline focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  )
}
