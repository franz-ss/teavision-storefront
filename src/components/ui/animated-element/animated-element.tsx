import Image from 'next/image'

import { cn } from '@/lib/utils'

type AnimatedElementProps = {
  animation: 'float-primary' | 'float-secondary'
  className?: string
  height: number
  sizes: string
  src: string
  width: number
}

const animationClassName = {
  'float-primary': 'animate-bc-float',
  'float-secondary': 'animate-st-float',
} as const

export function AnimatedElement({
  animation,
  className,
  height,
  sizes,
  src,
  width,
}: AnimatedElementProps) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden="true"
      width={width}
      height={height}
      className={cn(
        animationClassName[animation],
        'h-auto max-w-none object-contain motion-reduce:animate-none',
        className,
      )}
      sizes={sizes}
    />
  )
}
