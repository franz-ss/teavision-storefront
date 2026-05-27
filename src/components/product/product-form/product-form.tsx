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
  const safeValue = Number.isFinite(value) ? Math.trunc(value) : minimumQuantity
  const lowerBounded = Math.max(minimumQuantity, safeValue)

  return maximumQuantity === undefined
    ? lowerBounded
    : Math.min(maximumQuantity, lowerBounded)
}

function getAddToCartErrorMessage(error: unknown): string {
  if (
    error instanceof Error &&
    error.message.includes('Maximum quantity available reached.')
  ) {
    return 'Maximum quantity available reached.'
  }

  return 'Unable to add to cart. Please try again.'
}

export function ProductForm({
  variants,
  options,
  bulkPricingTiers = [],
}: ProductFormProps) {
  const quantityInputId = useId()
  const quantityErrorId = useId()
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
  const availableBulkPricingTiers = selectedBulkPricingTiers.filter(
    (tier) =>
      maximumQuantity === undefined || tier.minimumQuantity <= maximumQuantity,
  )
  const activeBulkTier =
    availableBulkPricingTiers
      .filter((tier) => effectiveQuantity >= tier.minimumQuantity)
      .sort((a, b) => b.minimumQuantity - a.minimumQuantity)[0] ?? null
  const bulkDealQuantity =
    selectedBulkTierQuantity ?? activeBulkTier?.minimumQuantity ?? null
  const showVariantSelector =
    variants.length > 1 ||
    variants.some((variant) => variant.title !== 'Default Title')

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
      } catch (addError) {
        setError(getAddToCartErrorMessage(addError))
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
    setError(null)
  }

  function handleGrabDeal() {
    if (bulkDealQuantity === null) return

    addQuantityToCart(bulkDealQuantity)
  }

  if (variants.length === 0) {
    return (
      <div className="text-muted rounded border border-dashed p-4 text-sm">
        No variants available
      </div>
    )
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      {showVariantSelector && (
        <fieldset className="min-w-0">
          <legend className="mb-2 text-sm font-medium">
            {options[0]?.name ?? 'Option'}
          </legend>
          <div className="flex min-w-0 flex-wrap gap-2">
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
      )}

      <div className="bg-surface flex min-w-0 flex-col gap-3 p-4 sm:grid sm:grid-cols-[auto_auto_minmax(0,1fr)] sm:items-center sm:gap-6">
        <div className="flex min-w-0 flex-col gap-2">
          <FormLabel htmlFor={quantityInputId}>Quantity</FormLabel>
          <QuantityStepper
            id={quantityInputId}
            value={effectiveQuantity}
            onChange={handleQuantityChange}
            min={minimumQuantity}
            max={maximumQuantity}
            disabled={!canAddToCart || isPending}
            describedBy={error ? quantityErrorId : undefined}
          />
        </div>

        {selectedVariant && (
          <Price
            price={selectedVariant.price}
            size="lg"
            className="text-brand"
          />
        )}

        <div className="min-w-0 sm:flex-1">
          <Button
            onClick={() => addQuantityToCart(effectiveQuantity)}
            isLoading={isPending}
            disabled={!canAddToCart || isPending}
            size="lg"
            className="w-full sm:ml-auto sm:max-w-44"
          >
            {canAddToCart ? 'Add to Cart' : 'Sold Out'}
          </Button>
        </div>

        {error && (
          <p
            id={quantityErrorId}
            role="alert"
            className="text-danger-text type-caption sm:col-span-3"
          >
            {error}
          </p>
        )}
      </div>

      {selectedVariant && (
        <BulkSavings
          tiers={availableBulkPricingTiers}
          basePrice={selectedVariant.price}
          selectedQuantity={effectiveQuantity}
          selectedTierQuantity={selectedBulkTierQuantity}
          canAddToCart={canAddToCart && bulkDealQuantity !== null}
          isPending={isPending}
          onGrabDeal={handleGrabDeal}
          onSelectTier={handleSelectBulkTier}
        />
      )}
    </div>
  )
}
