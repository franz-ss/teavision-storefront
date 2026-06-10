import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export type SelectProps = ComponentProps<'select'>

const selectClassName =
  'type-body-sm border-hairline focus:border-brand focus:shadow-focus focus:ring-0 focus:outline-none bg-card text-ink min-h-12 w-full rounded-sm border px-4 py-3.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40'

export function Select({ className, ...props }: SelectProps) {
  return <select className={cn(selectClassName, className)} {...props} />
}
