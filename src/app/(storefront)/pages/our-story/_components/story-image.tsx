import Image from 'next/image'

import { cn } from '@/lib/utils'

import type { ImageAsset } from '../_lib/data'

type StoryImageProps = {
  className?: string
  image: ImageAsset
  sizes: string
}

export function StoryImage({ className, image, sizes }: StoryImageProps) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      className={cn('size-full object-cover', className)}
    />
  )
}
