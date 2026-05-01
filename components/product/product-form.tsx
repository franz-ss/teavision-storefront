'use client'

import { useState, useTransition } from 'react'

import { addToCartAction } from '@/lib/cart/actions'
import { Button, Price } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { ProductOption, ProductVariant } from '@/lib/shopify/types'

type ProductFormProps = {
  variants: ProductVariant[]
  options: ProductOption[]
}

export function ProductForm({ variants, options }: ProductFormProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    variants.find((v) => v.availableForSale)?.id ?? variants[0]?.id ?? '',
  )
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const selectedVariant = variants.find((v) => v.id === selectedVariantId)

  function handleAddToCart() {
    if (!selectedVariantId) return
    startTransition(async () => {
      try {
        await addToCartAction(selectedVariantId, 1)
        setError(null)
      } catch {
        setError('Unable to add to cart. Please try again.')
      }
    })
  }

  if (variants.length === 0) {
    return (
      <div className={cn('text-text-muted rounded border border-dashed p-4 text-sm')}>
        No variants available
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-4')}>
      {selectedVariant && (
        <Price price={selectedVariant.price} size="lg" />
      )}

      <fieldset>
        <legend className={cn('mb-2 text-sm font-medium')}>
          {options[0]?.name ?? 'Option'}
        </legend>
        <div className={cn('flex flex-wrap gap-2')}>
          {variants.map((v) => (
            <button
              key={v.id}
              type="button"
              disabled={!v.availableForSale}
              aria-pressed={selectedVariantId === v.id}
              aria-label={`${v.title}${!v.availableForSale ? ', out of stock' : ''}`}
              onClick={() => setSelectedVariantId(v.id)}
              className={cn(
                'rounded border px-4 py-2 text-sm font-medium focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40',
                selectedVariantId === v.id
                  ? 'border-primary bg-primary text-background'
                  : 'border-border hover:border-primary',
              )}
            >
              {v.title}
            </button>
          ))}
        </div>
      </fieldset>

      <Button
        onClick={handleAddToCart}
        isLoading={isPending}
        disabled={!selectedVariantId || isPending}
        size="lg"
      >
        Add to Cart
      </Button>

      {error && (
        <p role="alert" className={cn('text-destructive mt-1 text-sm')}>
          {error}
        </p>
      )}
    </div>
  )
}
