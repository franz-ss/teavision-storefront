import type React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Eyebrow, Section } from '@/components/ui'
import { getSizedShopifyImageUrl } from '@/lib/shopify/image-url'
import { cn } from '@/lib/utils'

import { type HeroImage } from '../_lib/page-helpers'

type HeroProps = {
  collectionTitle: string
  heroDescription: string
  heroImage: HeroImage | null
  belowHeroImage?: React.ReactNode
  showIntro?: boolean
}

export function Hero({
  collectionTitle,
  heroDescription,
  heroImage,
  belowHeroImage,
  showIntro = true,
}: HeroProps) {
  return (
    <Section.Root
      tone="brand"
      spacing="none"
      className="relative overflow-hidden py-[clamp(40px,5vw,70px)]"
    >
      {/* Background hero image at 35% opacity */}
      {heroImage?.width && heroImage.height ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={getSizedShopifyImageUrl(heroImage.url, 1440)}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-35"
            aria-hidden="true"
          />
        </div>
      ) : null}

      <Section.Container className="relative z-10">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="type-mono-meta text-paper/60 mb-6 flex flex-wrap items-center gap-2"
        >
          <Link
            href="/"
            className="focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none rounded hover:text-paper/90"
          >
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href="/collections/all"
            className="focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none rounded hover:text-paper/90"
          >
            Collections
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-gold">
            {collectionTitle}
          </span>
        </nav>

        {belowHeroImage && <div className="mb-6">{belowHeroImage}</div>}

        {showIntro ? (
          <div className="max-w-[52ch]">
            <Eyebrow tone="gold">Wholesale collection</Eyebrow>

            <h1
              className={cn(
                'font-display text-paper mt-4 text-balance',
                'text-[clamp(2.4rem,5vw,4rem)] leading-[1.04]',
              )}
            >
              {collectionTitle}
            </h1>

            {heroDescription && (
              <p className="text-paper/85 mt-4 max-w-[52ch] text-[1.02rem]">
                {heroDescription}
              </p>
            )}
          </div>
        ) : (
          <h1 className="sr-only">{collectionTitle}</h1>
        )}
      </Section.Container>
    </Section.Root>
  )
}
