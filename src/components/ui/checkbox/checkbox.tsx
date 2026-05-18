import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export type CheckboxProps = Omit<ComponentProps<'input'>, 'type'>

const checkboxClassName =
  'border-default focus-visible:ring-ring size-4 rounded accent-brand focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40'

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={cn(checkboxClassName, className)}
      {...props}
    />
  )
}
