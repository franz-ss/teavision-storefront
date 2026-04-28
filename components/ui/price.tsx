import type { Money } from '@/lib/shopify/types'

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

export function Price({
  price,
  compareAtPrice,
  size = 'md',
  className = '',
}: PriceProps) {
  const formattedPrice = `${price.currencyCode} ${price.amount}`

  if (!compareAtPrice) {
    return (
      <span
        className={['tabular-nums', sizeStyles[size], className]
          .filter(Boolean)
          .join(' ')}
        style={{ color: 'var(--color-text)' }}
      >
        {formattedPrice}
      </span>
    )
  }

  const formattedCompare = `${compareAtPrice.currencyCode} ${compareAtPrice.amount}`

  return (
    <span
      className={['inline-flex items-baseline gap-2 tabular-nums', className]
        .filter(Boolean)
        .join(' ')}
    >
      <span
        className="text-sm line-through"
        style={{ color: 'var(--color-text-muted)' }}
        aria-label={`Was ${formattedCompare}`}
      >
        {formattedCompare}
      </span>
      <span
        className={sizeStyles[size]}
        style={{ color: 'var(--color-primary)' }}
        aria-label={`Now ${formattedPrice}`}
      >
        {formattedPrice}
      </span>
    </span>
  )
}
