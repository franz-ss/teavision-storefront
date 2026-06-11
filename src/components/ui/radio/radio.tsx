import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export type RadioProps = Omit<ComponentProps<'input'>, 'type'>

const radioClassName =
  'border-hairline focus-visible:ring-ring size-4.5 rounded-full border-[1.5px] accent-brand checked:bg-brand checked:border-brand checked:text-paper focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40'

export function Radio({ className, ...props }: RadioProps) {
  return (
    <input type="radio" className={cn(radioClassName, className)} {...props} />
  )
}
