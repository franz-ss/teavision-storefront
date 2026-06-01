import Image from 'next/image'

import type { ShopifyImage } from '@/lib/shopify/types'

type ProductQuickViewImageProps = {
  image: ShopifyImage | null
  title: string
}

function getSizedImageUrl(url: string, width: number): string {
  return `${url}${url.includes('?') ? '&' : '?'}width=${width}`
}

export function ProductQuickViewImage({
  image,
  title,
}: ProductQuickViewImageProps) {
  if (!image) {
    return <div className="h-full w-full" aria-hidden="true" />
  }

  return (
    <Image
      src={getSizedImageUrl(image.url, 900)}
      alt={image.altText ?? title}
      fill
      sizes="(min-width: 1024px) min(50vw, 36rem), calc(100vw - 2rem)"
      className="object-cover"
    />
  )
}
