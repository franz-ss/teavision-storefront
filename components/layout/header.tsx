import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'

import { getCartAction } from '@/lib/cart/actions'

async function CartCount() {
  const cart = await getCartAction()
  const count = cart?.totalQuantity ?? 0
  if (count === 0) return null
  return (
    <span className="bg-action-primary text-action-primary-text ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold">
      {count}
    </span>
  )
}

export function Header() {
  return (
    <header className="border-b px-4">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl items-center justify-between"
      >
        <Link
          href="/"
          className="inline-flex min-h-11 shrink-0 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          <Image
            src="/teavision.svg"
            alt="Teavision"
            width={188}
            height={44}
            className="h-8 w-auto sm:h-9"
            priority
          />
        </Link>
        <ul className="flex text-sm" role="list">
          <li>
            <Link
              href="/collections/all"
              className="inline-flex min-h-11 items-center px-3 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Shop
            </Link>
          </li>
          <li>
            <Link
              href="/pages/wholesale"
              className="inline-flex min-h-11 items-center px-3 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Wholesale
            </Link>
          </li>
          <li>
            <Link
              href="/cart"
              className="inline-flex min-h-11 items-center px-3 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
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
