import type { ComponentProps } from 'react'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

export type BadgeVariant = 'outOfStock' | 'sale' | 'new' | 'certification'

export type BadgeProps = Omit<ComponentProps<'span'>, 'children'> & {
  variant: BadgeVariant
  label?: string
}

const badgeVariants = cva(
  'type-eyebrow inline-block rounded-sm px-1.5 py-0.5',
  {
    variants: {
      variant: {
        outOfStock: 'border border-danger-border bg-danger-bg text-danger-text',
        sale: 'border border-accent/30 bg-accent-subtle text-accent',
        new: 'border border-default bg-surface-sunken text-muted',
        certification: 'border border-default bg-surface-sunken text-muted',
      } satisfies Record<BadgeVariant, string>,
    },
  },
)

const defaultLabels: Partial<Record<BadgeVariant, string>> = {
  outOfStock: 'Sold out',
  sale: 'Sale',
  new: 'New',
}

export function Badge({ variant, label, className, ...props }: BadgeProps) {
  const text = label ?? defaultLabels[variant]
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {text}
    </span>
  )
}
