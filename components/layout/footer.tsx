'use client'

import Link from 'next/link'
import { Suspense } from 'react'

function FooterYear() {
  return (
    <p className="text-sm text-gray-500">
      &copy; {new Date().getFullYear()} Teavision. All rights reserved.
    </p>
  )
}

export function Footer() {
  return (
    <footer className="mt-auto border-t px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <Suspense
          fallback={
            <p className="text-sm text-gray-500">
              &copy; Teavision. All rights reserved.
            </p>
          }
        >
          <FooterYear />
        </Suspense>
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
