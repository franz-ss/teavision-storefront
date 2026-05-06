import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'

import { getCartAction } from '@/lib/cart/actions'

async function CartCount() {
  const cart = await getCartAction()
  const count = cart?.totalQuantity ?? 0
  if (count === 0) return null
  return (
    <span className="type-caption bg-action-primary text-action-primary-text ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full">
      {count}
    </span>
  )
}

export function Header() {
  return (
    <header className="border-default border-b px-4">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl items-center justify-between gap-3"
      >
        <Link
          href="/"
          className="focus-visible:ring-ring inline-flex min-h-11 shrink-0 items-center focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
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
        <ul
          className="type-body-sm flex min-w-0 shrink items-center"
          role="list"
        >
          <li>
            <Link
              href="/collections/all"
              className="focus-visible:ring-ring inline-flex min-h-11 items-center px-2 hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:px-3"
            >
              Shop
            </Link>
          </li>
          <li>
            <Link
              href="/pages/wholesale"
              className="focus-visible:ring-ring inline-flex min-h-11 items-center px-2 hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:px-3"
            >
              Wholesale
            </Link>
          </li>
          <li>
            <Link
              href="/cart"
              className="focus-visible:ring-ring inline-flex min-h-11 items-center px-2 hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:px-3"
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
