export type BadgeVariant = 'outOfStock' | 'sale' | 'new'

type BadgeProps = {
  variant: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  outOfStock: 'bg-surface-warm text-destructive',
  sale: 'bg-surface-sage text-primary-hover',
  new: 'bg-border text-text-muted',
}

const labels: Record<BadgeVariant, string> = {
  outOfStock: 'Out of stock',
  sale: 'Sale',
  new: 'New',
}

export function Badge({ variant, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-block rounded px-1.5 py-0.5 text-[0.65rem] font-semibold tracking-wide uppercase',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {labels[variant]}
    </span>
  )
}
