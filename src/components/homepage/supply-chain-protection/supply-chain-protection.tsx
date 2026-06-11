import Image from 'next/image'

import { Section } from '@/components/ui'

const CERTIFICATION_MARKS = [
  {
    src: '/images/certifications/halal.png',
    alt: 'Halal certification mark',
    width: 633,
    height: 408,
  },
  {
    src: '/images/certifications/haccp.png',
    alt: 'HACCP certified mark',
    width: 630,
    height: 408,
  },
  {
    src: '/images/certifications/fda.png',
    alt: 'FDA registration mark',
    width: 633,
    height: 408,
  },
  {
    src: '/images/certifications/kosher.png',
    alt: 'Kosher certification mark',
    width: 636,
    height: 408,
  },
  {
    src: '/images/certifications/usda-organic.png',
    alt: 'USDA Organic certification mark',
    width: 630,
    height: 408,
  },
  {
    src: '/images/certifications/australian-organic.png',
    alt: 'Australian Organic certification mark',
    width: 1270,
    height: 818,
  },
  {
    src: '/images/certifications/organic-eu.png',
    alt: 'European organic certification mark',
    width: 633,
    height: 408,
  },
]

export function SupplyChainProtection() {
  return (
    <Section.Root tone="surface">
      <Section.Container>
        <div className="mx-auto max-w-200 text-center">
          <h2 className="type-heading-02 text-ink">
            You&apos;re protected at all times throughout our entire supply
            chain journey
          </h2>
          <p className="text-ink-soft mx-auto mt-7 max-w-184">
            We seek long-term partnerships with customers and suppliers, built
            on shared values and common goals for mutual benefit.
          </p>
        </div>

        <ul
          className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7 lg:gap-7"
          aria-label="Supply chain certification marks"
        >
          {CERTIFICATION_MARKS.map((mark) => (
            <li
              key={mark.src}
              className="bg-paper-2 flex aspect-170/124 items-center justify-center overflow-hidden"
            >
              <Image
                src={mark.src}
                alt={mark.alt}
                width={mark.width}
                height={mark.height}
                sizes="(min-width: 1024px) 11vw, (min-width: 640px) 30vw, 45vw"
                className="h-auto max-h-[74%] w-auto max-w-[78%]"
              />
            </li>
          ))}
        </ul>
      </Section.Container>
    </Section.Root>
  )
}
