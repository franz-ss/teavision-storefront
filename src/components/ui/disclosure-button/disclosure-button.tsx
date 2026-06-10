import React from 'react'

import { cn } from '@/lib/utils'

const disclosureButtonStyles =
  'type-label focus-visible:ring-ring inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-md px-2 text-ink transition-colors hover:text-brand focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none aria-expanded:text-brand disabled:cursor-not-allowed disabled:opacity-40'

type DisclosureButtonStateProps = {
  'aria-controls': string
  'aria-expanded': boolean
}

export type DisclosureButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-controls' | 'aria-expanded'
> &
  DisclosureButtonStateProps & {
    children: React.ReactNode
  }

export const DisclosureButton = React.forwardRef<
  HTMLButtonElement,
  DisclosureButtonProps
>(({ children, className, type = 'button', ...props }, ref) => {
  return (
    <button
      ref={ref}
      type={type}
      {...props}
      className={cn(disclosureButtonStyles, className)}
    >
      {children}
    </button>
  )
})

DisclosureButton.displayName = 'DisclosureButton'
