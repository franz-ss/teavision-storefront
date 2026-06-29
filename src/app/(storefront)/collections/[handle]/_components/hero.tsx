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
  bannerImage: HeroImage | null
}

export function Hero({
  collectionTitle,
  heroDescription,
  heroImage,
  bannerImage,
}: HeroProps) {
  // Banner mode: banner art, then a visible page-level H1 + brief intro, then
  // the breadcrumb (audit SEO-H1-02 — the H1 must be displayed, not a crumb).
  if (bannerImage) {
    return (
      <>
        {bannerImage.width && bannerImage.height ? (
          <Section.Root tone="transparent" spacing="none">
            <Section.Container className="pt-6">
              <div className="overflow-hidden">
                <Image
                  src={getSizedShopifyImageUrl(bannerImage.url, 1440)}
                  alt={bannerImage.altText ?? collectionTitle}
                  width={bannerImage.width}
                  height={bannerImage.height}
                  sizes="(min-width: 1480px) 1480px, 100vw"
                  className="w-full object-cover"
                  preload
                />
              </div>
            </Section.Container>
          </Section.Root>
        ) : null}

        <Section.Root tone="transparent" spacing="none">
          <Section.Container>
            <div className="max-w-[52ch] pt-6">
              <h1
                className={cn(
                  'font-display text-brand-deep text-balance',
                  'text-[clamp(2.2rem,5vw,3.9rem)] leading-[1.08] font-black',
                )}
              >
                {collectionTitle}
              </h1>

              {heroDescription && (
                <p className="text-ink mt-4 text-[1.04rem] leading-[1.6]">
                  {heroDescription}
                </p>
              )}
            </div>

            <nav
              aria-label="Breadcrumb"
              className="type-mono-meta text-ink-faint mt-6 flex flex-wrap items-center gap-2"
            >
              <Link
                href="/"
                className="focus-visible:ring-ring hover:text-brand rounded focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
              >
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link
                href="/collections/all"
                className="focus-visible:ring-ring hover:text-brand rounded focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
              >
                Collections
              </Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="text-gold-deep">
                {collectionTitle}
              </span>
            </nav>
          </Section.Container>
        </Section.Root>
      </>
    )
  }

  // Default mode: green brand band with the collection image at 35% opacity.
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
            className="focus-visible:ring-ring hover:text-paper/90 rounded focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href="/collections/all"
            className="focus-visible:ring-ring hover:text-paper/90 rounded focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Collections
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-gold">
            {collectionTitle}
          </span>
        </nav>

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
      </Section.Container>
    </Section.Root>
  )
}
