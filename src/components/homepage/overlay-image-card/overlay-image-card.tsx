import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'

import type { ImageCard } from '../content'

type OverlayImageCardProps = {
  card: ImageCard
  className?: string
}

export function OverlayImageCard({ card, className }: OverlayImageCardProps) {
  return (
    <Link
      href={card.href}
      className={cn(
        'group focus-visible:ring-ring relative block aspect-[1/1.08] overflow-hidden rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className,
      )}
    >
      <Image
        src={card.image.src}
        alt={card.image.alt}
        fill
        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 48vw, 100vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      {/* Bottom gradient scrim */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-ink/70 via-ink/20 to-transparent"
      />
      {card.badge && (
        <Image
          src={card.badge.src}
          alt={card.badge.alt}
          width={80}
          height={80}
          className="absolute top-3 left-3 size-12 rounded-full object-contain sm:size-16"
        />
      )}
      {/* Card content */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        {card.action ? (
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-gold mb-2 block">
            {card.action}
          </span>
        ) : null}
        <h3 className="font-display text-paper text-[1.15rem] leading-[1.15]">
          {card.title}
        </h3>
        <span
          aria-hidden="true"
          className="mt-2 inline-flex items-center gap-1.5 font-display text-paper text-sm opacity-0 transition-opacity max-lg:opacity-100 group-hover:opacity-100 focus-within:opacity-100 motion-reduce:transition-none"
        >
          Shop now <ArrowRight className="size-3.5" />
        </span>
      </div>
    </Link>
  )
}
