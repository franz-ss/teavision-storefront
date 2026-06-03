'use client'

import { useEffect } from 'react'

import { Button, Card } from '@/components/ui'

export default function Error({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="bg-canvas flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md p-10 text-center" radius="md">
        <p className="type-display-02 text-danger-text">!</p>
        <h1 className="type-heading-03 text-default mt-4">
          Something went wrong
        </h1>
        <p className="type-body text-muted mt-2">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button href="/" variant="secondary">
            Go home
          </Button>
        </div>
      </Card>
    </div>
  )
}
