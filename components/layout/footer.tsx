import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-auto border-t px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm text-text-muted">
          &copy; 2026 Teavision. All rights reserved.
        </p>
        <nav aria-label="Footer navigation" className="mt-4 flex gap-4 text-sm">
          <Link
            href="/pages/contact"
            className="hover:underline focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Contact
          </Link>
          <Link
            href="/pages/wholesale"
            className="hover:underline focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Wholesale
          </Link>
        </nav>
      </div>
    </footer>
  )
}
