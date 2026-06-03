'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { addToCartAction } from '@/lib/cart/actions'

export type AddToCart = (
  variantId: string,
  quantity: number,
) => Promise<unknown>

type UseAddToCartOptions = {
  addToCart?: AddToCart
  getErrorMessage?: (error: unknown) => string
  getSuccessMessage?: (quantity: number) => string
  onCartChanged?: () => void
}

const DEFAULT_ERROR = 'Unable to add to cart. Please try again.'

export function useAddToCart({
  addToCart = addToCartAction,
  getErrorMessage = () => DEFAULT_ERROR,
  getSuccessMessage = (quantity) => `${quantity} added to cart`,
  onCartChanged,
}: UseAddToCartOptions = {}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function resetFeedback() {
    setMessage(null)
    setError(null)
  }

  function reportError(nextError: string) {
    setMessage(null)
    setError(nextError)
  }

  function addItem(variantId: string, quantity: number) {
    startTransition(async () => {
      try {
        await addToCart(variantId, quantity)
        setMessage(getSuccessMessage(quantity))
        setError(null)
        if (onCartChanged) {
          onCartChanged()
        } else {
          router.refresh()
        }
      } catch (addError) {
        setMessage(null)
        setError(getErrorMessage(addError))
      }
    })
  }

  return {
    addItem,
    error,
    isPending,
    message,
    reportError,
    resetFeedback,
  }
}
