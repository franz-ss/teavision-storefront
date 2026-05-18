import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export type FormLabelProps = ComponentProps<'label'>

export function FormLabel({ className, ...props }: FormLabelProps) {
  return (
    <label
      className={cn('type-label text-strong block', className)}
      {...props}
    />
  )
}
