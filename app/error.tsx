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
    <div className="bg-background flex min-h-[60vh] items-center justify-center px-4">
      <div className="bg-surface rounded p-10 text-center max-w-md w-full">
        <p className="text-destructive text-7xl font-semibold tracking-tight">!</p>
        <h1 className="text-text mt-4 text-2xl font-semibold">Something went wrong</h1>
        <p className="text-text-muted mt-2 text-base">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="bg-primary text-background rounded px-5 py-2.5 text-sm font-medium hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Try again
          </button>
          <Link
            href="/"
            className="bg-background text-text rounded px-5 py-2.5 text-sm font-medium hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
