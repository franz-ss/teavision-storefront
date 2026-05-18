import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export type TextareaProps = ComponentProps<'textarea'>

const textareaClassName =
  'type-body-sm border-default focus-visible:ring-ring bg-canvas text-strong placeholder:text-muted min-h-36 w-full resize-y rounded-md border px-4 py-3 transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40'

export function Textarea({ className, ...props }: TextareaProps) {
  return <textarea className={cn(textareaClassName, className)} {...props} />
}
