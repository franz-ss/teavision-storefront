'use client'

import { useState } from 'react'
import Link from 'next/link'

import { Button, Checkbox, Textarea } from '@/components/ui'

type CartCheckoutFormProps = {
  checkoutUrl: string
}

export function CartCheckoutForm({ checkoutUrl }: CartCheckoutFormProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  return (
    <div className="mt-8 space-y-4">
      <Textarea
        placeholder="Order Notes"
        className="min-h-28"
        aria-label="Order notes"
      />

      <label className="flex cursor-pointer items-start gap-2.5">
        <Checkbox
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="mt-0.5"
          aria-describedby="terms-link"
        />
        <span className="type-body-sm text-ink font-medium select-none">
          I have read and agree to the{' '}
          <Link
            id="terms-link"
            href="/pages/terms-conditions"
            className="text-brand hover:text-brand-deep underline"
          >
            Terms and Conditions
          </Link>
        </span>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <Button href="/collections/all" variant="brand" size="cta">
          Continue Shopping
        </Button>
        {agreedToTerms ? (
          <Button
            href={checkoutUrl}
            size="cta"
            aria-label="Proceed to checkout"
          >
            Check Out
          </Button>
        ) : (
          <Button size="cta" disabled aria-label="Proceed to checkout">
            Check Out
          </Button>
        )}
      </div>
    </div>
  )
}
