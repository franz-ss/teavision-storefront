import Image from 'next/image'

import type { ShopifyImage } from '@/lib/shopify/types'
import { getSizedShopifyImageUrl } from '@/lib/shopify/image-url'

type ProductQuickViewImageProps = {
  image: ShopifyImage | null
  title: string
}

export function ProductQuickViewImage({
  image,
  title,
}: ProductQuickViewImageProps) {
  if (!image) {
    return <div className="size-full" aria-hidden="true" />
  }

  return (
    <Image
      src={getSizedShopifyImageUrl(image.url, 900)}
      alt={image.altText ?? title}
      fill
      sizes="(min-width: 1024px) min(50vw, 36rem), calc(100vw - 2rem)"
      className="object-cover"
    />
  )
}
