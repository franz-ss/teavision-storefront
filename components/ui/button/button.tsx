'use client'

import React from 'react'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

export type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
}

const buttonVariants = cva(
  [
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-md transition-colors',
    'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
    'disabled:cursor-not-allowed disabled:opacity-40',
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-action-primary text-action-primary-text hover:bg-action-primary-hover active:bg-action-primary-active',
        secondary:
          'border border-action-secondary-border bg-action-secondary text-action-secondary-text hover:bg-action-secondary-hover',
        ghost:
          'text-action-tertiary hover:bg-surface-sunken hover:text-action-tertiary-hover',
      } satisfies Record<ButtonVariant, string>,
      size: {
        sm: 'type-label min-h-10 px-3',
        md: 'type-label min-h-11 px-4',
        lg: 'type-label min-h-12 px-5',
      } satisfies Record<ButtonSize, string>,
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      className,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
