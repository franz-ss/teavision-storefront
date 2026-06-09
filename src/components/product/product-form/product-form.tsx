'use client'

import { useId, useState } from 'react'

import {
  Button,
  Price,
  QuantityStepper,
  ToggleButton,
} from '@/components/ui'
import type {
  BulkPricingTier,
  ProductOption,
  ProductVariant,
} from '@/lib/shopify/types'
import {
  clampQuantity,
  getVariantMaximumQuantity,
  getVariantMinimumQuantity,
  getVariantQuantityIncrement,
} from '@/lib/shopify/quantity-rules'

import { BulkSavings } from '../bulk-savings'
import { type AddToCart, useAddToCart } from '../use-add-to-cart'

type ProductFormProps = {
  variants: ProductVariant[]
  options: ProductOption[]
  bulkPricingTiers?: BulkPricingTier[]
  initialVariantId?: string
  addToCart?: AddToCart
  onCartChanged?: () => void
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

function getNumericVariantId(variantId: string): string {
  return variantId.replace('gid://shopify/ProductVariant/', '')
}

function getInitialSelectedVariantId(
  variants: ProductVariant[],
  initialVariantId?: string,
): string {
  const normalizedInitialVariantId = initialVariantId?.trim()
  const initialVariant = normalizedInitialVariantId
    ? variants.find(
        (variant) =>
          variant.id === normalizedInitialVariantId ||
          getNumericVariantId(variant.id) === normalizedInitialVariantId,
      )
    : undefined

  return (
    initialVariant?.id ??
    variants.find((variant) => variant.availableForSale)?.id ??
    variants[0]?.id ??
    ''
  )
}

export function ProductForm({
  variants,
  options,
  bulkPricingTiers = [],
  initialVariantId,
  addToCart,
  onCartChanged,
}: ProductFormProps) {
  const quantityErrorId = useId()
  const quantityStatusId = useId()
  const [selectedVariantId, setSelectedVariantId] = useState(() =>
    getInitialSelectedVariantId(variants, initialVariantId),
  )
  const [quantity, setQuantity] = useState(1)
  const [selectedBulkTierQuantity, setSelectedBulkTierQuantity] = useState<
    number | null
  >(null)
  const { addItem, error, isPending, message, reportError, resetFeedback } =
    useAddToCart({
      addToCart,
      getErrorMessage: getAddToCartErrorMessage,
      onCartChanged,
    })

  const selectedVariant = variants.find((v) => v.id === selectedVariantId)
  const canAddToCart = selectedVariant?.availableForSale === true
  const minimumQuantity = getVariantMinimumQuantity(selectedVariant)
  const maximumQuantity = getVariantMaximumQuantity(selectedVariant)
  const quantityIncrement = getVariantQuantityIncrement(selectedVariant)
  const effectiveQuantity = clampQuantity({
    maximumQuantity,
    minimumQuantity,
    quantityIncrement,
    value: quantity,
  })
  const canUseSelectedVariantQuantity =
    maximumQuantity === undefined || maximumQuantity >= minimumQuantity
  const selectedBulkPricingTiers =
    selectedVariant && selectedVariant.quantityPriceBreaks.length > 0
      ? selectedVariant.quantityPriceBreaks
      : bulkPricingTiers
  const activeBulkTier =
    selectedBulkPricingTiers
      .filter((tier) => effectiveQuantity >= tier.minimumQuantity)
      .sort((a, b) => b.minimumQuantity - a.minimumQuantity)[0] ?? null
  const bulkDealQuantity =
    selectedBulkTierQuantity ?? activeBulkTier?.minimumQuantity ?? null
  const showVariantSelector =
    variants.length > 1 ||
    variants.some((variant) => variant.title !== 'Default Title')

  function canUseQuantity(nextQuantity: number): boolean {
    if (maximumQuantity !== undefined && nextQuantity > maximumQuantity) {
      reportError('Maximum quantity available reached.')
      return false
    }

    return true
  }

  function addQuantityToCart(
    nextQuantity: number,
    { enforceMaximumQuantity = true } = {},
  ) {
    if (!canAddToCart || !selectedVariant || !canUseSelectedVariantQuantity) {
      return
    }
    if (enforceMaximumQuantity && !canUseQuantity(nextQuantity)) return

    addItem(selectedVariant.id, nextQuantity)
  }

  function handleQuantityChange(nextQuantity: number) {
    setQuantity(
      clampQuantity({
        maximumQuantity,
        minimumQuantity,
        quantityIncrement,
        value: nextQuantity,
      }),
    )
    setSelectedBulkTierQuantity(null)
    resetFeedback()
  }

  function handleSelectVariant(nextVariantId: string) {
    setSelectedVariantId(nextVariantId)
    setSelectedBulkTierQuantity(null)
    resetFeedback()
  }

  function handleSelectBulkTier(nextQuantity: number) {
    setSelectedBulkTierQuantity(nextQuantity)
    resetFeedback()
  }

  function handleGrabDeal() {
    if (bulkDealQuantity === null) return

    addQuantityToCart(bulkDealQuantity, { enforceMaximumQuantity: false })
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

      <div className="bg-surface flex min-w-0 flex-col items-center gap-3 p-4 sm:grid sm:grid-cols-[auto_auto_minmax(0,1fr)] sm:gap-6">
        <QuantityStepper
          value={effectiveQuantity}
          onChange={handleQuantityChange}
          min={minimumQuantity}
          max={maximumQuantity}
          step={quantityIncrement}
          disabled={!canAddToCart || isPending}
          describedBy={error ? quantityErrorId : undefined}
        />

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
            disabled={
              !canAddToCart || !canUseSelectedVariantQuantity || isPending
            }
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
        {message && (
          <p
            id={quantityStatusId}
            role="status"
            className="text-brand type-caption sm:col-span-3"
          >
            {message}
          </p>
        )}
      </div>

      {selectedVariant && (
        <BulkSavings
          tiers={selectedBulkPricingTiers}
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
