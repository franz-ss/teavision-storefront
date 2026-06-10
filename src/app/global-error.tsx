'use client'

import { useEffect } from 'react'

import { Button } from '@/components/ui'

import './globals.css'

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body className="bg-paper text-ink font-sans">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md rounded-lg border border-hairline bg-card p-10 text-center">
            <p className="font-display text-[3rem] font-medium text-danger">!</p>
            <h1 className="type-heading-02 mt-4">Something went wrong</h1>
            <p className="type-body mt-2 text-ink-soft">
              The page could not recover automatically. Please try again.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button href="/" variant="brand">
                Go home
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
