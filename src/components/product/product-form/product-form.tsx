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

function getVariantMinimumQuantity(
  variant: ProductVariant | undefined,
): number {
  return variant?.quantityRule?.minimum ?? 1
}

function getVariantMaximumQuantity(
  variant: ProductVariant | undefined,
): number | undefined {
  if (!variant) return undefined

  const candidates = [
    variant.quantityRule?.maximum ?? undefined,
    variant.currentlyNotInStock === true
      ? undefined
      : (variant.quantityAvailable ?? undefined),
  ].filter((value): value is number => value !== undefined && value >= 0)

  if (candidates.length === 0) return undefined

  return Math.min(...candidates)
}

function clampQuantity(
  value: number,
  minimumQuantity: number,
  maximumQuantity: number | undefined,
): number {
  const safeValue = Number.isFinite(value) ? value : minimumQuantity
  const lowerBounded = Math.max(minimumQuantity, safeValue)

  return maximumQuantity === undefined
    ? lowerBounded
    : Math.min(maximumQuantity, lowerBounded)
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
  const [selectedBulkTierQuantity, setSelectedBulkTierQuantity] = useState<
    number | null
  >(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const selectedVariant = variants.find((v) => v.id === selectedVariantId)
  const canAddToCart = selectedVariant?.availableForSale === true
  const minimumQuantity = getVariantMinimumQuantity(selectedVariant)
  const maximumQuantity = getVariantMaximumQuantity(selectedVariant)
  const effectiveQuantity = clampQuantity(
    quantity,
    minimumQuantity,
    maximumQuantity,
  )
  const selectedBulkPricingTiers =
    selectedVariant && selectedVariant.quantityPriceBreaks.length > 0
      ? selectedVariant.quantityPriceBreaks
      : bulkPricingTiers

  function canUseQuantity(nextQuantity: number): boolean {
    if (maximumQuantity !== undefined && nextQuantity > maximumQuantity) {
      setError('Maximum quantity available reached.')
      return false
    }

    return true
  }

  function addQuantityToCart(nextQuantity: number) {
    if (!canAddToCart || !selectedVariant) return
    if (!canUseQuantity(nextQuantity)) return

    startTransition(async () => {
      try {
        await addToCartAction(selectedVariant.id, nextQuantity)
        setError(null)
      } catch {
        setError('Unable to add to cart. Please try again.')
      }
    })
  }

  function handleQuantityChange(nextQuantity: number) {
    setQuantity(clampQuantity(nextQuantity, minimumQuantity, maximumQuantity))
    setSelectedBulkTierQuantity(null)
    setError(null)
  }

  function handleSelectVariant(nextVariantId: string) {
    setSelectedVariantId(nextVariantId)
    setSelectedBulkTierQuantity(null)
    setError(null)
  }

  function handleSelectBulkTier(nextQuantity: number) {
    setSelectedBulkTierQuantity(nextQuantity)
    if (!canUseQuantity(nextQuantity)) return

    setError(null)
  }

  function handleGrabDeal() {
    addQuantityToCart(selectedBulkTierQuantity ?? effectiveQuantity)
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
              onClick={() => handleSelectVariant(v.id)}
            >
              {v.title}
            </ToggleButton>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-2">
          <FormLabel htmlFor={quantityInputId}>Quantity</FormLabel>
          <QuantityStepper
            id={quantityInputId}
            value={effectiveQuantity}
            onChange={handleQuantityChange}
            min={minimumQuantity}
            max={maximumQuantity}
            disabled={!canAddToCart || isPending}
          />
        </div>

        <div className="sm:flex-1">
          <Button
            onClick={() => addQuantityToCart(effectiveQuantity)}
            isLoading={isPending}
            disabled={!canAddToCart || isPending}
            size="lg"
            className="w-full"
          >
            {canAddToCart ? 'Add to Cart' : 'Sold Out'}
          </Button>
        </div>
      </div>

      {selectedVariant && (
        <BulkSavings
          tiers={selectedBulkPricingTiers}
          basePrice={selectedVariant.price}
          selectedQuantity={effectiveQuantity}
          selectedTierQuantity={selectedBulkTierQuantity}
          canAddToCart={canAddToCart}
          isPending={isPending}
          onGrabDeal={handleGrabDeal}
          onSelectTier={handleSelectBulkTier}
        />
      )}

      {error && (
        <p role="alert" className="text-danger-text mt-1 text-sm">
          {error}
        </p>
      )}
    </div>
  )
}
