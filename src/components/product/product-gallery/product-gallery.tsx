'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'

import { ToggleButton } from '@/components/ui'
import type { ShopifyImage } from '@/lib/shopify/types'

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
    <div className="w-full">
      <div className="w-full overflow-hidden rounded" ref={emblaRef}>
        <div className="flex">
          {images.map((image, i) => (
            <div
              key={image.url}
              className="relative aspect-4/3 min-w-0 flex-[0_0_100%]"
            >
              {image.width && image.height ? (
                <Image
                  src={`${image.url}&width=800`}
                  alt={image.altText ?? title}
                  width={image.width}
                  height={image.height}
                  priority={i === 0}
                  sizes="(min-width: 1024px) calc(100vw - 464px), 100vw"
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
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {images.map((image, i) => (
            <ToggleButton
              key={image.url}
              variant="thumbnail"
              aria-label={`View image ${i + 1}`}
              pressed={selectedIndex === i}
              onClick={() => emblaApi?.scrollTo(i)}
            >
              {image.width && image.height ? (
                <Image
                  src={`${image.url}&width=120`}
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
    </div>
  )
}
