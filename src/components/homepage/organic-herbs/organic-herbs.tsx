import Image from 'next/image'
import { Check } from 'lucide-react'

import { Button, Eyebrow, Section } from '@/components/ui'

import { HERBS_IMAGE } from '../content'

const HERB_CHECKLIST = [
  {
    title: 'Import & freight insurance on all ingredients',
    sub: 'Every order covered from origin to your door',
  },
  {
    title: 'Highest quality standards',
    sub: 'From our certified facilities and trusted farming partners',
  },
  {
    title: 'Quality-focused, consistent and reliable',
    sub: 'Efficient, cost-effective supply for cafes, retailers and wellness brands',
  },
]

export function OrganicHerbs() {
  return (
    <Section.Root tone="sunken">
      <Section.Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow className="mb-4">Wild-grown &amp; certified organic</Eyebrow>
          <h2 className="type-heading-02">
            Herbs &amp; spices, sourced direct from farm.
          </h2>
          <p className="type-lede mt-4 text-ink-soft">
            We supply only the freshest wild-grown herbs and certified-organic
            spices, sourced directly from trusted farmers and plantations across
            the globe — with quality, sustainability and reliability built in.
          </p>
          <ul className="mt-8 divide-y divide-hairline">
            {HERB_CHECKLIST.map((item) => (
              <li
                key={item.title}
                className="flex gap-3 border-t border-hairline py-4 first:border-t-0"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-brand"
                  aria-hidden="true"
                />
                <div>
                  <p className="type-body font-medium">{item.title}</p>
                  <p className="type-body-sm text-ink-soft">{item.sub}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button
              href="/collections/herbs-and-spices"
              variant="brand"
              size="lg"
              aria-label="Shop herbs and spices"
            >
              Shop herbs &amp; spices
            </Button>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg shadow-2">
          <Image
            src={HERBS_IMAGE.src}
            alt={HERBS_IMAGE.alt}
            width={HERBS_IMAGE.width}
            height={HERBS_IMAGE.height}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="aspect-3/2 h-full w-full object-cover"
          />
        </div>
      </Section.Container>
    </Section.Root>
  )
}
