import React from 'react'
import Link, { type LinkProps } from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { LoaderCircle } from 'lucide-react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'items-center justify-center gap-2',
    'inline-flex cursor-pointer transition-colors',
    'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
    'disabled:cursor-not-allowed disabled:opacity-40',
    'rounded-md',
  ],
  {
    variants: {
      variant: {
        brand:
          'bg-brand text-on-brand hover:bg-brand-strong active:bg-brand-strong',
        primary:
          'bg-action-primary text-action-primary-text hover:bg-action-primary-hover active:bg-action-primary-active',
        secondary:
          'border border-action-secondary-border bg-action-secondary text-action-secondary-text hover:bg-action-secondary-hover',
        inverse:
          'bg-canvas text-strong hover:bg-surface-sunken active:bg-surface-sunken',
        inverseSecondary:
          'border border-on-brand/70 bg-transparent text-on-brand hover:border-on-brand hover:bg-canvas hover:text-strong active:bg-surface-sunken',
        ghost:
          'text-action-tertiary hover:bg-surface-sunken hover:text-action-tertiary-hover',
      },
      size: {
        sm: 'type-label min-h-11 px-3',
        md: 'type-label min-h-11 px-4',
        lg: 'type-label min-h-12 px-5',
        cta: 'type-label min-h-12 px-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

function shouldUseNextLink(href: LinkProps['href']) {
  return (
    typeof href !== 'string' ||
    (href.startsWith('/') && !href.startsWith('//')) ||
    href.startsWith('#')
  )
}

type ButtonVariantProps = VariantProps<typeof buttonVariants>

type ButtonSharedProps = ButtonVariantProps & {
  children?: React.ReactNode
}

type ButtonAsButton = ButtonSharedProps &
  Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    keyof ButtonSharedProps
  > & {
    href?: never
    isLoading?: boolean
  }

type ButtonAsAnchor = ButtonSharedProps &
  Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof ButtonSharedProps | keyof LinkProps | 'type'
  > &
  LinkProps & {
    disabled?: never
    isLoading?: never
    type?: never
  }

export type ButtonProps = ButtonAsButton | ButtonAsAnchor

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    { variant = 'primary', size = 'md', children, className, ...props },
    ref,
  ) => {
    const classes = cn(buttonVariants({ variant, size }), className)

    if (props.href !== undefined) {
      if (!shouldUseNextLink(props.href)) {
        return (
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            className={classes}
            {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {children}
          </a>
        )
      }

      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          {...props}
        >
          {children}
        </Link>
      )
    }

    const {
      disabled,
      isLoading = false,
      type = 'button',
      ...buttonProps
    } = props

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={classes}
        {...buttonProps}
      >
        {isLoading && (
          <LoaderCircle
            className="h-4 w-4 animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
