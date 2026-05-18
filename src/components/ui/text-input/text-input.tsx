import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export type TextInputProps = ComponentProps<'input'>

const inputClassName =
  'type-body-sm border-default focus-visible:ring-ring bg-canvas text-strong placeholder:text-muted min-h-12 w-full rounded-md border px-4 transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40'

export function TextInput({
  className,
  type = 'text',
  ...props
}: TextInputProps) {
  return (
    <input type={type} className={cn(inputClassName, className)} {...props} />
  )
}
