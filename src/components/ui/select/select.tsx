import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export type SelectProps = ComponentProps<'select'>

const selectClassName =
  'type-body-sm border-default focus-visible:ring-ring bg-canvas text-strong min-h-12 w-full rounded-md border px-4 transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40'

export function Select({ className, ...props }: SelectProps) {
  return <select className={cn(selectClassName, className)} {...props} />
}
