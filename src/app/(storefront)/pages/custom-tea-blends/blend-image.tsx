import Image from 'next/image'

import type { CustomTeaBlendImage } from './custom-tea-blends-data'

type BlendImageProps = {
  image: CustomTeaBlendImage
  sizes: string
}

export function BlendImage({ image, sizes }: BlendImageProps) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      quality={68}
      sizes={sizes}
      className="border-default h-full w-full rounded-lg border object-cover"
    />
  )
}
