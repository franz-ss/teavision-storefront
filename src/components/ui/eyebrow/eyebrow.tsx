import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const eyebrowVariants = cva('type-eyebrow inline-flex items-center gap-2.5', {
  variants: {
    tone: {
      brand: 'text-brand',
      muted: 'text-ink-faint',
      gold: 'text-gold',
    },
  },
  defaultVariants: {
    tone: 'brand',
  },
})

type EyebrowVariantProps = VariantProps<typeof eyebrowVariants>

export type EyebrowProps = EyebrowVariantProps & {
  children: React.ReactNode
  rule?: boolean
  className?: string
}

export function Eyebrow({
  tone,
  rule = true,
  className,
  children,
}: EyebrowProps) {
  return (
    <span
      className={cn(
        eyebrowVariants({ tone }),
        rule && 'before:h-px before:w-5.5 before:bg-current before:opacity-60',
        className,
      )}
    >
      {children}
    </span>
  )
}
