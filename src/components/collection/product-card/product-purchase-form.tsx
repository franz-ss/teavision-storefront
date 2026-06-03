'use client'

import { useMemo, useState, type FormEvent } from 'react'
import { ShoppingCart } from 'lucide-react'

import type { ProductVariant } from '@/lib/shopify/types'
import { Button, Price, QuantityStepper, Select } from '@/components/ui'
import {
  type AddToCart,
  useAddToCart,
} from '@/components/product/use-add-to-cart'

type ProductPurchaseFormProps = {
  variants: ProductVariant[]
  productTitle: string
  addToCart?: AddToCart
  onCartChanged?: () => void
}

function getInitialVariantId(variants: ProductVariant[]): string {
  return (
    variants.find((variant) => variant.availableForSale)?.id ??
    variants[0]?.id ??
    ''
  )
}

export function ProductPurchaseForm({
  variants,
  productTitle,
  addToCart,
  onCartChanged,
}: ProductPurchaseFormProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(() =>
    getInitialVariantId(variants),
  )
  const [quantity, setQuantity] = useState(1)
  const { addItem, error, isPending, message, resetFeedback } = useAddToCart({
    addToCart,
    onCartChanged,
  })

  const selectedVariant = useMemo(
    () =>
      variants.find((variant) => variant.id === selectedVariantId) ??
      variants[0],
    [selectedVariantId, variants],
  )
  const canAddToCart = selectedVariant?.availableForSale === true
  const hasMultipleVariants = variants.length > 1

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedVariant || !canAddToCart) return

    addItem(selectedVariant.id, quantity)
  }

  if (variants.length === 0) {
    return (
      <div className="border-default bg-surface-sunken text-muted rounded-md border border-dashed p-4 text-sm">
        No purchasable variants are currently available.
      </div>
    )
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        {selectedVariant && <Price price={selectedVariant.price} size="lg" />}
        {!canAddToCart && (
          <span className="type-caption text-danger-text">Sold out</span>
        )}
      </div>

      {hasMultipleVariants && (
        <label className="grid gap-2">
          <span className="type-caption text-muted">Pack size</span>
          <Select
            value={selectedVariantId}
            onChange={(event) => {
              setSelectedVariantId(event.currentTarget.value)
              resetFeedback()
            }}
            disabled={isPending}
            aria-label={`Select pack size for ${productTitle}`}
          >
            {variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.title}
                {!variant.availableForSale ? ' - sold out' : ''}
              </option>
            ))}
          </Select>
        </label>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper
          value={quantity}
          onChange={(nextQuantity) => {
            setQuantity(nextQuantity)
            resetFeedback()
          }}
          disabled={isPending || !canAddToCart}
          label={`Quantity for ${productTitle}`}
        />
        <div className="min-w-36 flex-1 sm:flex-none">
          <Button
            type="submit"
            isLoading={isPending}
            disabled={!canAddToCart || isPending}
            className="w-full"
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            {canAddToCart ? 'Add to cart' : 'Sold out'}
          </Button>
        </div>
      </div>

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
    </form>
  )
}
