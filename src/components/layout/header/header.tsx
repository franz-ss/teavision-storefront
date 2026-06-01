import Image from 'next/image'
import Link from 'next/link'
import { Mail, Phone, ShoppingCart, User } from 'lucide-react'
import { Suspense } from 'react'

import { CartCount } from './cart-count'
import { MegaNav, MobileMegaNav } from './mega-nav'
import { Search } from './search'
import { SearchForm } from './search-form'

const ACTION_LINK_CLASS =
  'type-label focus-visible:ring-ring relative inline-flex min-h-11 items-center justify-center rounded-md px-3 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

const ANNOUNCEMENT_LINK_CLASS =
  'focus-visible:ring-ring focus-visible:ring-offset-brand inline-flex min-h-11 items-center gap-1 rounded-md text-on-brand underline-offset-4 transition-colors hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none lg:min-h-8'

export function Header() {
  return (
    <header className="border-subtle bg-surface sticky top-0 z-50 border-b">
      <div className="bg-brand text-on-brand">
        <div className="type-caption max-w-wide mx-auto flex flex-col gap-1 px-4 py-2 md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <a
              href="tel:1300729617"
              className={ANNOUNCEMENT_LINK_CLASS}
              aria-label="Call Teavision at 1300 729 617"
            >
              <Phone className="size-3.5 shrink-0" aria-hidden="true" />
              <span>1300 729 617</span>
            </a>
            <span className="text-on-brand/60" aria-hidden="true">
              |
            </span>
            <a
              href="mailto:info@teavision.com.au"
              className={ANNOUNCEMENT_LINK_CLASS}
              aria-label="Email Teavision at info@teavision.com.au"
            >
              <Mail className="size-4 shrink-0" aria-hidden="true" />
              <span>info@teavision.com.au</span>
            </a>
          </div>
          <p className="text-on-brand/85 max-w-2xl">
            We&apos;re committed to delivering the greatest value and customer
            service on the planet.
          </p>
        </div>
      </div>

      <div className="max-w-wide mx-auto grid min-h-14 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-2 md:px-6 lg:min-h-18 lg:grid-cols-[minmax(10rem,1fr)_minmax(18rem,42rem)_minmax(7rem,1fr)] lg:px-8 lg:py-0">
        <Link
          href="/"
          className="focus-visible:ring-ring col-start-1 row-start-1 inline-flex min-h-11 shrink-0 items-center gap-1 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          aria-label="Teavision home"
        >
          <Image
            src="/teavision.svg"
            alt="Teavision"
            width={188}
            height={44}
            className="h-6 w-auto sm:h-8 lg:h-9"
            priority
          />
          <span
            className="bg-accent hidden h-1.5 w-1.5 rounded-full sm:block"
            aria-hidden="true"
          />
        </Link>

        <div className="col-span-2 row-start-2 min-w-0 lg:col-span-1 lg:col-start-2 lg:row-start-1">
          <Suspense fallback={<SearchForm />}>
            <Search />
          </Suspense>
        </div>

        <div className="col-start-2 row-start-1 flex shrink-0 items-center justify-end gap-2 lg:col-start-3">
          <a
            href="https://mrtea.com.au/account/login"
            className={ACTION_LINK_CLASS}
          >
            <User className="size-4" aria-hidden="true" strokeWidth={1.8} />
            <span className="sr-only">Log in</span>
          </a>
          <Link href="/cart" className={ACTION_LINK_CLASS}>
            <ShoppingCart
              className="size-4"
              aria-hidden="true"
              strokeWidth={1.8}
            />
            <span className="sr-only">Cart</span>
            <Suspense fallback={null}>
              <CartCount />
            </Suspense>
          </Link>
        </div>
      </div>

      <div className="border-subtle hidden border-t lg:block">
        <div className="max-w-wide mx-auto flex justify-center px-8">
          <MegaNav />
        </div>
      </div>

      <MobileMegaNav />
    </header>
  )
}
