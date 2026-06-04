'use client'

import { useMemo, useState, type FormEvent } from 'react'
import { ShoppingCart } from 'lucide-react'

import type { ProductVariant } from '@/lib/shopify/types'
import { Button, Price, QuantityStepper, Select } from '@/components/ui'
import {
  type AddToCart,
  useAddToCart,
} from '@/components/product/use-add-to-cart'
import {
  clampQuantity,
  getVariantMaximumQuantity,
  getVariantMinimumQuantity,
  getVariantQuantityIncrement,
} from '@/lib/shopify/quantity-rules'
import { cn } from '@/lib/utils'

type ProductPurchaseFormProps = {
  variants: ProductVariant[]
  productTitle: string
  addToCart?: AddToCart
  onCartChanged?: () => void
  layout?: 'stacked' | 'inline'
  showPrice?: boolean
}

function getInitialVariant(
  variants: ProductVariant[],
): ProductVariant | undefined {
  return variants.find((variant) => variant.availableForSale) ?? variants[0]
}

export function ProductPurchaseForm({
  variants,
  productTitle,
  addToCart,
  onCartChanged,
  layout = 'stacked',
  showPrice,
}: ProductPurchaseFormProps) {
  const initialVariant = getInitialVariant(variants)
  const [selectedVariantId, setSelectedVariantId] = useState(
    () => initialVariant?.id ?? '',
  )
  const [quantity, setQuantity] = useState(() =>
    getVariantMinimumQuantity(initialVariant),
  )
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
  const minimumQuantity = getVariantMinimumQuantity(selectedVariant)
  const maximumQuantity = getVariantMaximumQuantity(selectedVariant)
  const quantityIncrement = getVariantQuantityIncrement(selectedVariant)
  const effectiveQuantity = clampQuantity({
    maximumQuantity,
    minimumQuantity,
    quantityIncrement,
    value: quantity,
  })
  const canAddToCart =
    selectedVariant?.availableForSale === true &&
    (maximumQuantity === undefined || maximumQuantity >= minimumQuantity)
  const hasMultipleVariants = variants.length > 1

  const inlineSelect = layout === 'inline'

  function handleSelectVariant(nextVariantId: string) {
    const nextVariant =
      variants.find((variant) => variant.id === nextVariantId) ?? variants[0]

    setSelectedVariantId(nextVariantId)
    setQuantity(getVariantMinimumQuantity(nextVariant))
    resetFeedback()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedVariant || !canAddToCart) return

    addItem(selectedVariant.id, effectiveQuantity)
  }

  if (variants.length === 0) {
    return (
      <div className="border-default bg-surface-sunken text-muted rounded-md border border-dashed p-4 text-sm">
        No purchasable variants are currently available.
      </div>
    )
  }

  const variantOptions = variants.map((variant) => (
    <option key={variant.id} value={variant.id}>
      {variant.title}
      {!variant.availableForSale ? ' - sold out' : ''}
    </option>
  ))

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      {showPrice !== false && (
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          {selectedVariant && <Price price={selectedVariant.price} size="lg" />}
          {!canAddToCart && (
            <span className="type-caption text-danger-text">Sold out</span>
          )}
        </div>
      )}

      {/* Stacked layout (PDP): label above select */}
      {!inlineSelect && hasMultipleVariants && (
        <label className="grid gap-2">
          <span className="type-caption text-muted">Pack size</span>
          <Select
            name="variantId"
            value={selectedVariantId}
            onChange={(event) => handleSelectVariant(event.currentTarget.value)}
            disabled={isPending}
            aria-label={`Select pack size for ${productTitle}`}
          >
            {variantOptions}
          </Select>
        </label>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {/* Inline layout (card): select in the same row as the button */}
        {inlineSelect && hasMultipleVariants && (
          <div className="min-w-40 flex-[1_1_10rem]">
            <Select
              name="variantId"
              value={selectedVariantId}
              onChange={(event) =>
                handleSelectVariant(event.currentTarget.value)
              }
              disabled={isPending}
              aria-label={`Select pack size for ${productTitle}`}
            >
              {variantOptions}
            </Select>
          </div>
        )}
        {!inlineSelect && (
          <QuantityStepper
            name="quantity"
            value={effectiveQuantity}
            onChange={(nextQuantity) => {
              setQuantity(nextQuantity)
              resetFeedback()
            }}
            min={minimumQuantity}
            max={maximumQuantity}
            step={quantityIncrement}
            disabled={isPending || !canAddToCart}
            label={`Quantity for ${productTitle}`}
          />
        )}
        <div
          className={cn(
            inlineSelect && hasMultipleVariants
              ? 'min-w-36 flex-1'
              : 'min-w-36 flex-1 sm:flex-none',
          )}
        >
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
