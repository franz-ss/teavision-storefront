import Link from 'next/link'
import { Suspense } from 'react'
import { getCartAction } from '@/lib/cart/actions'

async function CartCount() {
  const cart = await getCartAction()
  const count = cart?.totalQuantity ?? 0
  if (count === 0) return null
  return (
    <span className="bg-primary text-background ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold">
      {count}
    </span>
  )
}

export function Header() {
  return (
    <header className="border-b px-4 py-3">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl items-center justify-between"
      >
        <Link
          href="/"
          className="font-semibold focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Teavision
        </Link>
        <ul className="flex gap-6 text-sm" role="list">
          <li>
            <Link
              href="/collections/all"
              className="hover:underline focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Shop
            </Link>
          </li>
          <li>
            <Link
              href="/pages/wholesale"
              className="hover:underline focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Wholesale
            </Link>
          </li>
          <li>
            <Link
              href="/cart"
              className="inline-flex items-center hover:underline focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Cart
              <Suspense fallback={null}>
                <CartCount />
              </Suspense>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
