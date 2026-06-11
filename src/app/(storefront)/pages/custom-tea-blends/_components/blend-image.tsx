import Image from 'next/image'

import type { ImageAsset } from '../_lib/data'

type BlendImageProps = {
  image: ImageAsset
  priority?: boolean
  sizes: string
}

export function BlendImage({
  image,
  priority = false,
  sizes,
}: BlendImageProps) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      preload={priority}
      quality={68}
      sizes={sizes}
      className="border-hairline size-full rounded-lg border object-cover"
    />
  )
}
