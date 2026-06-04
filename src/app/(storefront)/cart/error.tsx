'use client'

import { useEffect } from 'react'

import { Button } from '@/components/ui'

export default function CartError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8 lg:px-8">
      <div className="border-default bg-surface max-w-xl rounded-md border p-6 sm:p-8">
        <h1 className="type-heading-03 text-strong">
          We could not load your cart
        </h1>
        <p className="type-body-sm text-muted mt-3">
          Your cart is still safe with Shopify. Try loading it again, or
          continue shopping while the storefront reconnects.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button onClick={reset}>Try again</Button>
          <Button href="/collections/all" variant="secondary">
            Continue shopping
          </Button>
        </div>
      </div>
    </div>
  )
}
