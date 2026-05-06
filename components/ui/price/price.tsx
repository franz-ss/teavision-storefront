import { cva } from 'class-variance-authority'

import type { Money } from '@/lib/shopify/types'
import { cn } from '@/lib/utils'

export type PriceSize = 'sm' | 'md' | 'lg'

export type PriceProps = {
  price: Money
  compareAtPrice?: Money
  size?: PriceSize
  className?: string
}

const priceTextVariants = cva('tabular-nums', {
  variants: {
    tone: {
      default: 'text-default',
      sale: 'text-brand',
    },
    size: {
      sm: 'type-body-sm',
      md: 'type-body',
      lg: 'type-heading-05',
    } satisfies Record<PriceSize, string>,
  },
  defaultVariants: {
    tone: 'default',
    size: 'md',
  },
})

const comparePriceTextVariants = cva('text-muted line-through', {
  variants: {
    size: {
      sm: 'type-caption',
      md: 'type-body-sm',
      lg: 'type-body',
    } satisfies Record<PriceSize, string>,
  },
  defaultVariants: {
    size: 'md',
  },
})

function format(money: Money): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: money.currencyCode,
  }).format(parseFloat(money.amount))
}

export function Price({
  price,
  compareAtPrice,
  size = 'md',
  className,
}: PriceProps) {
  const formattedPrice = format(price)

  if (!compareAtPrice) {
    return (
      <span className={cn(priceTextVariants({ size }), className)}>
        {formattedPrice}
      </span>
    )
  }

  const formattedCompare = format(compareAtPrice)

  return (
    <span
      className={cn('inline-flex items-baseline gap-2 tabular-nums', className)}
    >
      <span
        className={comparePriceTextVariants({ size })}
        aria-label={`Was ${formattedCompare}`}
      >
        {formattedCompare}
      </span>
      <span
        className={priceTextVariants({ tone: 'sale', size })}
        aria-label={`Now ${formattedPrice}`}
      >
        {formattedPrice}
      </span>
    </span>
  )
}
