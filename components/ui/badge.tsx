import { cn } from '@/lib/utils'

export type BadgeVariant = 'outOfStock' | 'sale' | 'new'

type BadgeProps = {
  variant: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  outOfStock: 'border border-danger bg-danger text-danger',
  sale: 'border border-accent/30 bg-accent-subtle text-accent',
  new: 'border border-default bg-surface-sunken text-muted',
}

const labels: Record<BadgeVariant, string> = {
  outOfStock: 'Out of stock',
  sale: 'Sale',
  new: 'New',
}

export function Badge({ variant, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'type-eyebrow inline-block rounded-sm px-1.5 py-0.5',
        variantClasses[variant],
        className,
      )}
    >
      {labels[variant]}
    </span>
  )
}
