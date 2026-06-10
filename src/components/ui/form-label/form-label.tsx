import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export type FormLabelProps = ComponentProps<'label'>

export function FormLabel({ className, ...props }: FormLabelProps) {
  return (
    <label
      className={cn('type-mono-meta text-ink-faint block', className)}
      {...props}
    />
  )
}
