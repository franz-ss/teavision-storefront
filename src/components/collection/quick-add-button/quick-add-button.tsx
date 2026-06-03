'use client'

import { ShoppingCart } from 'lucide-react'

import {
  type AddToCart,
  useAddToCart,
} from '@/components/product/use-add-to-cart'
import { Button } from '@/components/ui'

export type QuickAddButtonProps = {
  addToCart?: AddToCart
  disabled?: boolean
  productTitle: string
  variantId: string
}

export function QuickAddButton({
  addToCart,
  disabled = false,
  productTitle,
  variantId,
}: QuickAddButtonProps) {
  const { addItem, error, isPending, message } = useAddToCart({
    addToCart,
    getSuccessMessage: () => 'Added to cart',
  })
  const isDisabled = disabled || isPending

  function handleAddToCart() {
    if (isDisabled) return
    addItem(variantId, 1)
  }

  return (
    <div className="grid min-w-36 gap-2">
      <Button
        type="button"
        size="sm"
        isLoading={isPending}
        disabled={isDisabled}
        onClick={handleAddToCart}
        aria-label={
          disabled
            ? `${productTitle} is sold out`
            : `Add ${productTitle} to cart`
        }
        className="w-full"
      >
        <ShoppingCart className="h-4 w-4" aria-hidden="true" />
        {disabled ? 'Sold out' : 'Add to cart'}
      </Button>

      {message && (
        <p role="status" className="type-caption text-brand">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="type-caption text-danger-text">
          {error}
        </p>
      )}
    </div>
  )
}
