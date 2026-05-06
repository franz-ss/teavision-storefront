import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-default mt-auto border-t px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <p className="type-body-sm text-muted">
          &copy; 2026 Teavision. All rights reserved.
        </p>
        <nav
          aria-label="Footer navigation"
          className="type-body-sm mt-4 flex gap-4"
        >
          <Link
            href="/pages/contact"
            className="focus-visible:ring-ring hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Contact
          </Link>
          <Link
            href="/pages/wholesale"
            className="focus-visible:ring-ring hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Wholesale
          </Link>
        </nav>
      </div>
    </footer>
  )
}
