import { cva } from 'class-variance-authority'

import type { Money } from '@/lib/shopify/types'
import { cn } from '@/lib/utils'

export type PriceSize = 'sm' | 'md' | 'lg'

export type PriceProps = {
  price: Money
  compareAtPrice?: Money
  size?: PriceSize
  discountTone?: 'brand' | 'default'
  layout?: 'inline' | 'stacked'
  priceClassName?: string
  compareAtPriceClassName?: string
  className?: string
}

const priceTextVariants = cva('font-display tabular-nums', {
  variants: {
    tone: {
      default: 'text-ink',
      sale: 'text-brand',
    },
    size: {
      sm: 'text-base leading-6',
      md: 'text-lg leading-7',
      lg: 'text-2xl leading-9 font-semibold',
    } satisfies Record<PriceSize, string>,
  },
  defaultVariants: {
    tone: 'default',
    size: 'md',
  },
})

const comparePriceTextVariants = cva('font-mono text-ink-soft line-through', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-sm',
      lg: 'text-base',
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
  discountTone = 'brand',
  layout = 'inline',
  size = 'md',
  priceClassName,
  compareAtPriceClassName,
  className,
}: PriceProps) {
  const formattedPrice = format(price)

  if (!compareAtPrice) {
    return (
      <span
        className={cn(priceTextVariants({ size }), priceClassName, className)}
      >
        {formattedPrice}
      </span>
    )
  }

  const formattedCompare = format(compareAtPrice)

  return (
    <span
      className={cn(
        layout === 'stacked'
          ? 'inline-flex flex-col items-start gap-2 tabular-nums'
          : 'inline-flex items-baseline gap-2 tabular-nums',
        className,
      )}
    >
      <span
        className={cn(
          comparePriceTextVariants({ size }),
          compareAtPriceClassName,
        )}
        aria-label={`Was ${formattedCompare}`}
      >
        {formattedCompare}
      </span>
      <span
        className={cn(
          priceTextVariants({
            tone: discountTone === 'brand' ? 'sale' : 'default',
            size,
          }),
          priceClassName,
        )}
        aria-label={`Now ${formattedPrice}`}
      >
        {formattedPrice}
      </span>
    </span>
  )
}
