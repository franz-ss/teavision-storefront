import Link from 'next/link'

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
              className="hover:underline focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Cart
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
