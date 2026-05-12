import Image from 'next/image'
import Link from 'next/link'

import type { ImageCard } from '../content'

type OverlayImageCardProps = {
  card: ImageCard
}

export function OverlayImageCard({ card }: OverlayImageCardProps) {
  return (
    <Link
      href={card.href}
      className="group focus-visible:ring-ring relative block overflow-hidden rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <div className="relative aspect-video">
        <Image
          src={card.image.src}
          alt={card.image.alt}
          fill
          sizes="(min-width: 1024px) 31vw, (min-width: 768px) 48vw, 48vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <span className="from-inverse/80 via-inverse/30 to-inverse/0 absolute inset-0 bg-linear-to-t" />
        {card.badge && (
          <Image
            src={card.badge.src}
            alt={card.badge.alt}
            width={80}
            height={80}
            className="absolute top-3 left-3 size-12 rounded-full object-contain sm:size-16"
          />
        )}

        <span className="type-heading-05 text-on-brand absolute inset-x-0 bottom-0 p-3 sm:p-6">
          {card.title}
        </span>
      </div>
    </Link>
  )
}
