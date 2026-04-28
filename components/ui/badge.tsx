export type BadgeVariant = 'outOfStock' | 'sale' | 'new'

type BadgeProps = {
  variant: BadgeVariant
  className?: string
}

const styles: Record<
  BadgeVariant,
  { background: string; color: string; label: string }
> = {
  outOfStock: {
    background: '#E8DDD5',
    color: 'var(--color-destructive)',
    label: 'Out of stock',
  },
  sale: {
    background: '#D8E2D0',
    color: 'var(--color-primary-hover)',
    label: 'Sale',
  },
  new: {
    background: 'var(--color-border)',
    color: 'var(--color-text-muted)',
    label: 'New',
  },
}

export function Badge({ variant, className = '' }: BadgeProps) {
  const { background, color, label } = styles[variant]
  return (
    <span
      className={[
        'inline-block rounded px-1.5 py-0.5 text-[0.65rem] font-semibold tracking-wide uppercase',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ background, color }}
    >
      {label}
    </span>
  )
}
