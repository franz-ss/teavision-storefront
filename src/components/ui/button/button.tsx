import React from 'react'
import Link, { type LinkProps } from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { LoaderCircle } from 'lucide-react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'items-center justify-center gap-2.5',
    'inline-flex cursor-pointer',
    'transition-[background-color,color,box-shadow,transform]',
    'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
    'disabled:cursor-not-allowed disabled:opacity-40',
    'rounded-full',
  ],
  {
    variants: {
      variant: {
        brand:
          'bg-brand text-paper hover:bg-brand-deep active:bg-brand-deep',
        primary:
          'bg-ink text-paper hover:bg-ink/90 active:bg-ink/90',
        secondary:
          'border-[1.5px] border-hairline bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-paper',
        inverse:
          'bg-paper text-ink hover:bg-card',
        inverseSecondary:
          'border-[1.5px] border-paper/35 bg-transparent text-paper hover:bg-paper hover:text-ink',
        ghost:
          'text-brand hover:bg-brand-tint hover:text-brand-deep',
      },
      size: {
        sm: 'type-label min-h-11 px-4.5 text-[0.86rem]',
        md: 'type-label min-h-11 px-6.5',
        lg: 'type-label min-h-12 px-8.5',
        cta: 'type-label min-h-12 px-8.5',
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
