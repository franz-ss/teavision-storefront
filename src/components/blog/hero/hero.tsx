import Image from 'next/image'

import { Eyebrow, Section } from '@/components/ui'
import { DEFAULT_LISTING_DESCRIPTION } from '@/lib/blog/listing'

import { RssLink } from './rss-link'
import { SearchForm } from './search-form'

type HeroImage = {
  url: string
  altText?: string | null
  lqip?: string | null
}

type HeroProps = {
  defaultQuery?: string
  description?: string
  image?: HeroImage | null
  preload?: boolean
  rssHref?: string
  searchAction?: string
  title?: string
}

const HERO_TITLE = 'Discover the Finest Teas for Your Business'
const HERO_IMAGE = {
  src: '/images/blog/blog-hero-tea-journal.webp',
  alt: '',
}

export function Hero({
  defaultQuery = '',
  description = DEFAULT_LISTING_DESCRIPTION,
  image,
  preload = true,
  rssHref,
  searchAction,
  title = HERO_TITLE,
}: HeroProps) {
  const heroImage = image?.url ? image : null
  const imageSrc = heroImage?.url ?? HERO_IMAGE.src
  const hasLqip = Boolean(heroImage?.lqip)

  return (
    <Section.Root
      tone="brand"
      spacing="none"
      className="relative isolate overflow-hidden"
    >
      <Image
        src={imageSrc}
        alt={heroImage?.altText ?? HERO_IMAGE.alt}
        fill
        sizes="100vw"
        preload={preload}
        placeholder={hasLqip ? 'blur' : 'empty'}
        blurDataURL={hasLqip ? (heroImage?.lqip ?? undefined) : undefined}
        className="absolute inset-0 -z-20 object-cover opacity-35"
      />
      <Section.Container
        variant="compact"
        className="relative flex flex-col items-center justify-center py-16 text-center md:py-24"
      >
        <Eyebrow tone="gold" className="mb-4">
          Tea Journal
        </Eyebrow>
        <h1 className="font-display text-paper max-w-[16ch] text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.01em] wrap-break-word">
          {title}
        </h1>
        <p className="type-lede text-paper/85 mt-5 max-w-2xl wrap-break-word">
          {description}
        </p>

        <SearchForm defaultQuery={defaultQuery} searchAction={searchAction} />
        {rssHref ? <RssLink href={rssHref} /> : null}
      </Section.Container>
    </Section.Root>
  )
}
