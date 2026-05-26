'use client'

import { useId, useState, useTransition } from 'react'

import { addToCartAction } from '@/lib/cart/actions'
import {
  Button,
  FormLabel,
  Price,
  QuantityStepper,
  ToggleButton,
} from '@/components/ui'
import type {
  BulkPricingTier,
  ProductOption,
  ProductVariant,
} from '@/lib/shopify/types'

import { BulkSavings } from '../bulk-savings'

type ProductFormProps = {
  variants: ProductVariant[]
  options: ProductOption[]
  bulkPricingTiers?: BulkPricingTier[]
}

export function ProductForm({
  variants,
  options,
  bulkPricingTiers = [],
}: ProductFormProps) {
  const quantityInputId = useId()
  const [selectedVariantId, setSelectedVariantId] = useState(
    variants.find((v) => v.availableForSale)?.id ?? variants[0]?.id ?? '',
  )
  const [quantity, setQuantity] = useState(1)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const selectedVariant = variants.find((v) => v.id === selectedVariantId)
  const canAddToCart = selectedVariant?.availableForSale === true
  const selectedBulkPricingTiers =
    selectedVariant && selectedVariant.quantityPriceBreaks.length > 0
      ? selectedVariant.quantityPriceBreaks
      : bulkPricingTiers

  function handleAddToCart() {
    if (!canAddToCart || !selectedVariant) return
    startTransition(async () => {
      try {
        await addToCartAction(selectedVariant.id, quantity)
        setError(null)
      } catch {
        setError('Unable to add to cart. Please try again.')
      }
    })
  }

  if (variants.length === 0) {
    return (
      <div className="text-muted rounded border border-dashed p-4 text-sm">
        No variants available
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {selectedVariant && <Price price={selectedVariant.price} size="lg" />}

      <fieldset>
        <legend className="mb-2 text-sm font-medium">
          {options[0]?.name ?? 'Option'}
        </legend>
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <ToggleButton
              key={v.id}
              pressed={selectedVariantId === v.id}
              disabled={!v.availableForSale}
              aria-label={`${v.title}${!v.availableForSale ? ', out of stock' : ''}`}
              onClick={() => setSelectedVariantId(v.id)}
            >
              {v.title}
            </ToggleButton>
          ))}
        </div>
      </fieldset>

      {selectedVariant && (
        <BulkSavings
          tiers={selectedBulkPricingTiers}
          basePrice={selectedVariant.price}
          selectedQuantity={quantity}
        />
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-2">
          <FormLabel htmlFor={quantityInputId}>Quantity</FormLabel>
          <QuantityStepper
            id={quantityInputId}
            value={quantity}
            onChange={setQuantity}
            min={1}
            disabled={!canAddToCart || isPending}
          />
        </div>

        <div className="sm:flex-1">
          <Button
            onClick={handleAddToCart}
            isLoading={isPending}
            disabled={!canAddToCart || isPending}
            size="lg"
            className="w-full"
          >
            {canAddToCart ? 'Add to Cart' : 'Sold Out'}
          </Button>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-danger-text mt-1 text-sm">
          {error}
        </p>
      )}
    </div>
  )
}
