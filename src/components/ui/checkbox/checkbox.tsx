import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export type CheckboxProps = Omit<ComponentProps<'input'>, 'type'>

const checkboxClassName =
  'border-hairline focus-visible:ring-ring size-4.5 rounded-[5px] border-[1.5px] accent-brand checked:bg-brand checked:border-brand checked:text-paper focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40'

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={cn(checkboxClassName, className)}
      {...props}
    />
  )
}
