import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const toggleButtonVariants = cva(
  [
    'inline-flex cursor-pointer transition-colors',
    'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
    'disabled:cursor-not-allowed disabled:opacity-40',
  ],
  {
    variants: {
      variant: {
        chip: 'min-h-11 items-center justify-center gap-2 rounded-full border border-hairline bg-card px-4 py-2 text-sm font-medium text-ink-soft hover:border-brand hover:text-brand aria-pressed:border-brand/30 aria-pressed:bg-brand-tint aria-pressed:text-brand',
        tabText:
          'type-label items-center gap-1 rounded-sm px-1 py-1.5 text-ink-soft hover:text-brand aria-pressed:text-brand aria-pressed:border-b-[1.5px] aria-pressed:border-brand',
        menuCard:
          'group min-h-18 w-full items-start justify-between gap-4 rounded-md border border-transparent p-3 text-left text-ink-soft hover:bg-brand-tint hover:text-brand aria-pressed:border-hairline-2 aria-pressed:bg-card aria-pressed:text-brand',
        menuRow:
          'type-label min-h-11 items-center justify-between gap-2 rounded-md border border-transparent px-3 text-left text-ink-soft hover:bg-brand-tint hover:text-brand aria-pressed:border-hairline-2 aria-pressed:bg-brand-tint aria-pressed:text-brand md:w-full',
        thumbnail:
          'relative h-16 w-16 shrink-0 overflow-hidden rounded opacity-60 hover:opacity-100 focus-visible:ring-offset-1 aria-pressed:opacity-100 aria-pressed:ring-ring aria-pressed:ring-2',
        dot: 'h-1.5 flex-1 rounded-full border border-hairline bg-card px-0 text-transparent hover:border-brand/50 aria-pressed:border-brand aria-pressed:bg-brand',
      },
    },
    defaultVariants: {
      variant: 'chip',
    },
  },
)

type ToggleButtonVariantProps = VariantProps<typeof toggleButtonVariants>

export type ToggleButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-pressed'
> &
  ToggleButtonVariantProps & {
    children: React.ReactNode
    pressed: boolean
  }

export const ToggleButton = React.forwardRef<
  HTMLButtonElement,
  ToggleButtonProps
>(
  (
    { children, className, pressed, type = 'button', variant, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        {...props}
        aria-pressed={pressed}
        className={cn(toggleButtonVariants({ variant }), className)}
      >
        {children}
      </button>
    )
  },
)

ToggleButton.displayName = 'ToggleButton'
