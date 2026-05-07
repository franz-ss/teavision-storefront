import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const iconButtonVariants = cva(
  [
    'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors',
    'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
    'disabled:cursor-not-allowed disabled:opacity-40',
  ],
  {
    variants: {
      variant: {
        outline: 'border border-default hover:border-brand',
        ghost: 'text-default hover:bg-surface-sunken hover:text-brand',
      },
      size: {
        sm: 'h-11 w-11',
        md: 'h-11 w-11',
        lg: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'md',
    },
  },
)

type IconButtonAccessibleName =
  | {
      'aria-label': string
      'aria-labelledby'?: string
    }
  | {
      'aria-label'?: string
      'aria-labelledby': string
    }

export type IconButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> &
  VariantProps<typeof iconButtonVariants> &
  IconButtonAccessibleName & {
    children: React.ReactNode
  }

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { children, className, size, type = 'button', variant, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(iconButtonVariants({ size, variant }), className)}
        {...props}
      >
        {children}
      </button>
    )
  },
)

IconButton.displayName = 'IconButton'
