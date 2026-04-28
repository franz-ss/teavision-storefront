'use client'

import { useState, useTransition } from 'react'
import { addToCartAction } from '@/lib/cart/actions'
import type { ProductVariant } from '@/lib/shopify/types'

type ProductFormProps = {
  variants: ProductVariant[]
}

export function ProductForm({ variants }: ProductFormProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    variants.find((v) => v.availableForSale)?.id ?? variants[0]?.id ?? '',
  )
  const [isPending, startTransition] = useTransition()

  function handleAddToCart() {
    if (!selectedVariantId) return
    startTransition(async () => {
      await addToCartAction(selectedVariantId, 1)
    })
  }

  if (variants.length === 0) {
    return (
      <div className="rounded border border-dashed p-4 text-sm text-gray-400">
        No variants available
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Size</legend>
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              type="button"
              disabled={!v.availableForSale}
              aria-pressed={selectedVariantId === v.id}
              aria-label={`${v.title}${!v.availableForSale ? ', out of stock' : ''}`}
              onClick={() => setSelectedVariantId(v.id)}
              className={`rounded border px-4 py-2 text-sm font-medium focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${
                selectedVariantId === v.id
                  ? 'border-black bg-black text-white'
                  : 'hover:border-gray-800'
              }`}
            >
              {v.title}
            </button>
          ))}
        </div>
      </fieldset>

      <button
        type="button"
        disabled={isPending || !selectedVariantId}
        aria-label={isPending ? 'Adding to cart…' : 'Add to cart'}
        onClick={handleAddToCart}
        className="rounded bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50"
      >
        {isPending ? 'Adding…' : 'Add to Cart'}
      </button>
    </div>
  )
}
