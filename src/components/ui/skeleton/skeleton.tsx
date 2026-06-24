import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export type SkeletonProps = ComponentProps<'div'>

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'bg-paper-2 animate-pulse rounded motion-reduce:animate-none',
        className,
      )}
      {...props}
    />
  )
}
