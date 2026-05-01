import { cn } from '@/lib/utils'

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

export function Badge({ variant, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block rounded px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide',
        variantClasses[variant],
        className,
      )}
    >
      {labels[variant]}
    </span>
  )
}
