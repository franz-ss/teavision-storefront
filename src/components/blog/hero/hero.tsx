import Image from 'next/image'

import { Section } from '@/components/ui'
import { DEFAULT_LISTING_DESCRIPTION } from '@/lib/blog/listing'

import { RssLink } from './rss-link'
import { SearchForm } from './search-form'

type HeroProps = {
  defaultQuery?: string
  rssHref?: string
  searchAction?: string
}

const HERO_TITLE = 'Discover the Finest Teas for Your Business'
const HERO_IMAGE = {
  src: 'https://cdn.shopify.com/s/files/1/0786/8339/files/blog-hero.webp?v=1764582604&width=2880',
  alt: '',
}

export function Hero({ defaultQuery = '', rssHref, searchAction }: HeroProps) {
  return (
    <Section.Root
      tone="brandStrong"
      spacing="none"
      className="relative isolate overflow-hidden"
    >
      <Image
        src={HERO_IMAGE.src}
        alt={HERO_IMAGE.alt}
        fill
        sizes="100vw"
        preload
        className="absolute inset-0 -z-20 object-cover"
      />
      <div
        aria-hidden="true"
        className="bg-inverse/60 absolute inset-0 -z-10"
      />
      <Section.Container
        variant="compact"
        className="relative flex flex-col items-center justify-center py-16 text-center md:py-24"
      >
        <h1 className="type-heading-01 text-on-brand md:type-display-01">
          {HERO_TITLE}
        </h1>
        <p className="type-body-lg text-on-brand mt-5 max-w-2xl">
          {DEFAULT_LISTING_DESCRIPTION}
        </p>

        <SearchForm defaultQuery={defaultQuery} searchAction={searchAction} />
        {rssHref ? <RssLink href={rssHref} /> : null}
      </Section.Container>
    </Section.Root>
  )
}
