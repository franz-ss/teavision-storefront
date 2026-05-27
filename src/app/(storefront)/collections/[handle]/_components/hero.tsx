import Image from 'next/image'
import Link from 'next/link'

import { Section } from '@/components/ui'
import { cn } from '@/lib/utils'

import { type HeroImage, getResizedShopifyImageUrl } from '../_lib/page-helpers'

type HeroProps = {
  collectionTitle: string
  heroDescription: string
  heroImage: HeroImage | null
}

const PRIMARY_LINK_CLASS_NAME =
  'type-label bg-action-primary text-action-primary-text hover:bg-action-primary-hover focus-visible:ring-ring inline-flex min-h-11 items-center justify-center rounded-md px-5 text-center transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

const SECONDARY_LINK_CLASS_NAME =
  'type-label border-action-secondary-border text-action-secondary-text hover:bg-action-secondary-hover focus-visible:ring-ring inline-flex min-h-11 items-center justify-center rounded-md border px-5 text-center transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

export function Hero({
  collectionTitle,
  heroDescription,
  heroImage,
}: HeroProps) {
  return (
    <Section.Root
      tone="sunken"
      className="border-default w-full max-w-full overflow-x-hidden border-b"
    >
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

        {heroImage && (
          <figure className="border-default bg-surface mb-8 overflow-hidden rounded-md border">
            <div
              className={cn(
                'relative w-full overflow-hidden',
                heroImage.layout === 'legacy-banner' ? 'h-52' : 'aspect-[16/7]',
              )}
            >
              <Image
                src={getResizedShopifyImageUrl(heroImage.url, 1440)}
                alt={heroImage.altText ?? collectionTitle}
                fill
                priority
                sizes="(min-width: 1280px) 1200px, 100vw"
                className="object-cover"
              />
            </div>
          </figure>
        )}

        <div className="max-w-4xl">
          <p className="type-eyebrow text-accent">Wholesale collection</p>
          <h1 className="type-heading-02 md:type-display-01 text-strong mt-5 text-balance break-words">
            {collectionTitle}
          </h1>
          {heroDescription && (
            <p className="type-body-lg text-muted mt-6 max-w-prose break-words">
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
      </Section.Container>
    </Section.Root>
  )
}
