'use client'

import { useEffect } from 'react'

import { Button } from '@/components/ui'

export default function Error({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="bg-paper flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border border-hairline bg-card p-10 text-center">
        <p className="font-display text-[3rem] font-medium text-danger">!</p>
        <h1 className="type-heading-02 mt-4">Something went wrong</h1>
        <p className="type-body mt-2 text-ink-soft">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button href="/" variant="brand">
            Go home
          </Button>
        </div>
      </div>
    </div>
  )
}
