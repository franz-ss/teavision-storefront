import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '404 — Page Not Found | Teavision',
  description: "The page you're looking for has moved or never existed.",
  robots: { index: false },
}

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-[60vh] items-center justify-center px-4">
      <div className="bg-surface rounded p-10 text-center max-w-md w-full">
        <p className="text-primary text-7xl font-semibold tracking-tight">404</p>
        <h1 className="text-text mt-4 text-2xl font-semibold">This page doesn&rsquo;t exist</h1>
        <p className="text-text-muted mt-2 text-base">
          The page you&rsquo;re looking for has moved or never existed.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="bg-primary text-background rounded px-5 py-2.5 text-sm font-medium hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Go home
          </Link>
          <Link
            href="/collections/all"
            className="bg-background text-text rounded px-5 py-2.5 text-sm font-medium hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Browse products
          </Link>
        </div>
      </div>
    </div>
  )
}
