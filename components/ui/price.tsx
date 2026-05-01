import type { Money } from '@/lib/shopify/types'
import { cn } from '@/lib/utils'

type PriceProps = {
  price: Money
  compareAtPrice?: Money
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeStyles: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl font-semibold',
}

const compareSizeStyles: Record<string, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

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
      <span className={cn('text-text tabular-nums', sizeStyles[size], className)}>
        {formattedPrice}
      </span>
    )
  }

  const formattedCompare = format(compareAtPrice)

  return (
    <span className={cn('inline-flex items-baseline gap-2 tabular-nums', className)}>
      <span
        className={cn(compareSizeStyles[size], 'text-text-muted line-through')}
        aria-label={`Was ${formattedCompare}`}
      >
        {formattedCompare}
      </span>
      <span
        className={cn(sizeStyles[size], 'text-primary')}
        aria-label={`Now ${formattedPrice}`}
      >
        {formattedPrice}
      </span>
    </span>
  )
}
