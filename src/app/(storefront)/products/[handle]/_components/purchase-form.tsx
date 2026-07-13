'use client'

import { useSearchParams } from 'next/navigation'

import { ProductForm } from '@/components/product'
import type {
  BulkPricingTier,
  ProductOption,
  ProductVariant,
} from '@/lib/shopify/types'

type PurchaseFormProps = {
  variants: ProductVariant[]
  options: ProductOption[]
  bulkPricingTiers: BulkPricingTier[]
  className?: string
}

export function PurchaseForm({
  variants,
  options,
  bulkPricingTiers,
  className,
}: PurchaseFormProps) {
  const initialVariantId = useSearchParams().get('variant') ?? undefined

  return (
    <ProductForm
      variants={variants}
      options={options}
      bulkPricingTiers={bulkPricingTiers}
      initialVariantId={initialVariantId}
      className={className}
    />
  )
}
