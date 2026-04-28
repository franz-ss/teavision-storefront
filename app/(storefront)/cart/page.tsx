import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Your Cart',
}

const PLACEHOLDER_ITEMS = [
  {
    id: '1',
    title: 'English Breakfast 1kg',
    variant: '1kg',
    price: '$42.00',
    quantity: 2,
  },
  {
    id: '2',
    title: 'Chamomile 250g',
    variant: '250g',
    price: '$18.00',
    quantity: 1,
  },
]

export default function CartPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Your Cart</h1>

      <ul className="divide-y" role="list">
        {PLACEHOLDER_ITEMS.map((item) => (
          <li key={item.id} className="flex items-center gap-4 py-6">
            {/* Product image placeholder */}
            <div
              className="h-20 w-20 flex-shrink-0 rounded bg-gray-100"
              role="img"
              aria-label={`${item.title} image`}
            />

            {/* Item details */}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{item.title}</p>
              <p className="text-sm text-gray-500">{item.variant}</p>
            </div>

            {/* Quantity controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={`Decrease quantity of ${item.title}`}
                className="flex h-8 w-8 items-center justify-center rounded border hover:border-gray-400 focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                &minus;
              </button>
              <span aria-label={`Quantity: ${item.quantity}`}>
                {item.quantity}
              </span>
              <button
                type="button"
                aria-label={`Increase quantity of ${item.title}`}
                className="flex h-8 w-8 items-center justify-center rounded border hover:border-gray-400 focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                +
              </button>
            </div>

            <p className="w-16 text-right font-medium">{item.price}</p>

            <button
              type="button"
              aria-label={`Remove ${item.title} from cart`}
              className="text-sm text-gray-400 hover:text-gray-800 focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {/* Summary */}
      <div className="mt-8 rounded border p-6">
        <div className="flex justify-between text-lg font-semibold">
          <span>Subtotal</span>
          <span>$102.00</span>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Shipping and taxes calculated at checkout.
        </p>

        {/* Checkout CTA — placeholder href until Shopify cart.checkoutUrl is wired */}
        <a
          href="#"
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
