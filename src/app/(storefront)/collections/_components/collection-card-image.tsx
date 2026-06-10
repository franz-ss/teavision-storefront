import Image from 'next/image'

import { getSizedShopifyImageUrl } from '@/lib/shopify/image-url'
import type { CollectionSummary } from '@/lib/shopify/types'

export function CollectionCardImage({
  collection,
}: {
  collection: CollectionSummary
}) {
  if (
    !collection.featuredImage ||
    !collection.featuredImage.width ||
    !collection.featuredImage.height
  ) {
    return <div className="bg-paper-2 aspect-[1/1.08] w-full rounded-lg" />
  }

  return (
    <Image
      src={getSizedShopifyImageUrl(collection.featuredImage.url, 640)}
      alt={collection.featuredImage.altText ?? collection.title}
      width={collection.featuredImage.width}
      height={collection.featuredImage.height}
      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
      className="aspect-[1/1.08] w-full object-cover transition-transform duration-300 group-hover:scale-[1.06] motion-reduce:transform-none motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    />
  )
}
