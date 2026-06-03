'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'

import { ToggleButton } from '@/components/ui'
import type { ShopifyImage } from '@/lib/shopify/types'
import { getSizedShopifyImageUrl } from '@/lib/shopify/image-url'

type ProductGalleryProps = {
  images: ShopifyImage[]
  title: string
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  if (images.length === 0) {
    return <div className="bg-surface aspect-4/3 w-full rounded" />
  }

  return (
    <div className="w-full" role="region" aria-label={`${title} image gallery`}>
      <div className="w-full overflow-hidden rounded" ref={emblaRef}>
        <div className="flex">
          {images.map((image, i) => (
            <div
              key={image.url}
              className="relative aspect-4/3 min-w-0 flex-[0_0_100%]"
              aria-hidden={selectedIndex !== i}
            >
              {image.width && image.height ? (
                <Image
                  src={getSizedShopifyImageUrl(image.url, 800)}
                  alt={image.altText ?? title}
                  width={image.width}
                  height={image.height}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  preload={i === 0}
                  sizes="(min-width: 1280px) 38rem, (min-width: 1024px) calc(50vw - 3.5rem), calc(100vw - 2rem)"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="bg-surface h-full w-full" />
              )}
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(4rem,1fr))] gap-2">
          {images.map((image, i) => (
            <ToggleButton
              key={image.url}
              variant="thumbnail"
              className="w-full"
              aria-label={`View image ${i + 1}`}
              pressed={selectedIndex === i}
              onClick={() => emblaApi?.scrollTo(i)}
            >
              {image.width && image.height ? (
                <Image
                  src={getSizedShopifyImageUrl(image.url, 120)}
                  alt={image.altText ?? `${title} ${i + 1}`}
                  width={image.width}
                  height={image.height}
                  sizes="120px"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="bg-surface h-full w-full" />
              )}
            </ToggleButton>
          ))}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        Image {selectedIndex + 1} of {images.length}
      </p>
    </div>
  )
}
