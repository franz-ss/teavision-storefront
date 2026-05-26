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
        chip: 'min-h-11 items-center justify-center gap-2 rounded border border-default px-4 py-2 text-sm font-medium text-default hover:border-brand aria-pressed:border-brand aria-pressed:bg-action-primary aria-pressed:text-action-primary-text',
        menuCard:
          'group min-h-[72px] w-full items-start justify-between gap-4 rounded-md border border-transparent p-3 text-left text-default hover:bg-surface hover:text-brand aria-pressed:border-subtle aria-pressed:bg-surface-raised aria-pressed:text-brand',
        menuRow:
          'type-label min-h-11 items-center justify-between gap-2 rounded-md border border-transparent px-3 text-left text-default hover:bg-surface-sunken hover:text-brand aria-pressed:border-subtle aria-pressed:bg-brand-subtle aria-pressed:text-brand md:w-full',
        thumbnail:
          'relative h-16 w-16 shrink-0 overflow-hidden rounded opacity-60 hover:opacity-100 focus-visible:ring-offset-1 aria-pressed:opacity-100 aria-pressed:ring-ring aria-pressed:ring-2',
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
