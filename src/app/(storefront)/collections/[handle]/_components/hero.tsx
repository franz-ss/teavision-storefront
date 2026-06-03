import type React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Section } from '@/components/ui'
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

const PRIMARY_LINK_CLASS_NAME =
  'type-label bg-action-primary text-action-primary-text hover:bg-action-primary-hover focus-visible:ring-ring inline-flex min-h-11 items-center justify-center rounded-md px-5 text-center transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

const SECONDARY_LINK_CLASS_NAME =
  'type-label border-action-secondary-border text-action-secondary-text hover:bg-action-secondary-hover focus-visible:ring-ring inline-flex min-h-11 items-center justify-center rounded-md border px-5 text-center transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

export function Hero({
  collectionTitle,
  heroDescription,
  heroImage,
  belowHeroImage,
  showIntro = true,
}: HeroProps) {
  return (
    <Section.Root tone="sunken" spacing="compact">
      <Section.Container>
        <nav
          aria-label="Breadcrumb"
          className="type-body-sm text-muted mb-8 flex flex-wrap items-center gap-2"
        >
          <Link
            href="/"
            className="focus-visible:ring-ring inline-flex min-h-10 items-center rounded hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href="/collections/all"
            className="focus-visible:ring-ring inline-flex min-h-10 items-center rounded hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Collections
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-default">
            {collectionTitle}
          </span>
        </nav>

        {heroImage?.width && heroImage.height ? (
          <figure className="border-default bg-surface mb-8 overflow-hidden rounded-md border">
            <Image
              src={getSizedShopifyImageUrl(heroImage.url, 1440)}
              alt={heroImage.altText ?? collectionTitle}
              width={heroImage.width}
              height={heroImage.height}
              preload
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="h-auto w-full"
            />
          </figure>
        ) : null}

        {belowHeroImage && <div className="mb-8">{belowHeroImage}</div>}

        {showIntro ? (
          <div className="max-w-4xl">
            <p className="type-eyebrow text-accent">Wholesale collection</p>
            <h1 className="type-heading-02 md:type-display-01 text-strong mt-5 text-balance wrap-break-word">
              {collectionTitle}
            </h1>
            {heroDescription && (
              <p className="type-body-lg text-muted mt-6 max-w-prose wrap-break-word">
                {heroDescription}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/pages/wholesale-account-request"
                className={cn(PRIMARY_LINK_CLASS_NAME, 'w-full sm:w-auto')}
              >
                Request wholesale pricing
              </Link>
              <Link
                href="/pages/contact"
                className={cn(SECONDARY_LINK_CLASS_NAME, 'w-full sm:w-auto')}
              >
                Ask about this range
              </Link>
            </div>
          </div>
        ) : (
          <h1 className="sr-only">{collectionTitle}</h1>
        )}
      </Section.Container>
    </Section.Root>
  )
}
