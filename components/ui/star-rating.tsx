import { cn } from '@/lib/utils'

type StarRatingProps = {
  rating: number
  count?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: { star: 12, text: 'text-xs' },
  md: { star: 16, text: 'text-sm' },
  lg: { star: 20, text: 'text-base' },
}

function Star({ fill, size, index }: { fill: 'full' | 'half' | 'empty'; size: number; index: number }) {
  const id = `star-half-${index}`
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      aria-hidden="true"
      fill="none"
    >
      {fill === 'half' && (
        <defs>
          <linearGradient id={id}>
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.01l-4.94 2.69.94-5.49-4-3.9 5.53-.8L10 1.5z"
        fill={
          fill === 'full'
            ? 'currentColor'
            : fill === 'half'
              ? `url(#${id})`
              : 'none'
        }
        stroke="currentColor"
        strokeWidth={fill === 'empty' ? 1.5 : 0}
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function StarRating({ rating, count, size = 'md', className }: StarRatingProps) {
  const { star: starSize, text } = sizeMap[size]
  const clamped = Math.min(5, Math.max(0, rating))

  const stars = Array.from({ length: 5 }, (_, i) => {
    if (clamped >= i + 1) return 'full' as const
    if (clamped >= i + 0.5) return 'half' as const
    return 'empty' as const
  })

  return (
    <div
      className={cn('inline-flex items-center gap-1.5', className)}
      aria-label={`${clamped.toFixed(1)} out of 5 stars${count !== undefined ? `, ${count} ${count === 1 ? 'review' : 'reviews'}` : ''}`}
    >
      <div className="flex text-star" role="img" aria-hidden="true">
        {stars.map((fill, i) => (
          <Star key={i} fill={fill} size={starSize} index={i} />
        ))}
      </div>
      {count !== undefined && (
        <span className={cn('text-text-muted tabular-nums', text)}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  )
}
