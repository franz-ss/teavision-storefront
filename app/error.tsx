'use client'

import Link from 'next/link'

export default function Error({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="bg-canvas flex min-h-[60vh] items-center justify-center px-4">
      <div className="bg-surface w-full max-w-md rounded p-10 text-center">
        <p className="text-danger text-7xl font-semibold">!</p>
        <h1 className="text-default mt-4 text-2xl font-semibold">
          Something went wrong
        </h1>
        <p className="text-muted mt-2 text-base">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="bg-action-primary text-action-primary-text rounded px-5 py-2.5 text-sm font-medium hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Try again
          </button>
          <Link
            href="/"
            className="bg-canvas text-default rounded px-5 py-2.5 text-sm font-medium hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
