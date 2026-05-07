import Image from 'next/image'

import { Button, Section } from '@/components/ui'

import { CATALOGUE_IMAGE } from '../content'

export function Catalogues() {
  return (
    <Section.Root tone="inverse" className="relative overflow-hidden">
      <Image
        src={CATALOGUE_IMAGE.src}
        alt={CATALOGUE_IMAGE.alt}
        width={CATALOGUE_IMAGE.width}
        height={CATALOGUE_IMAGE.height}
        className="absolute right-0 bottom-0 hidden h-full w-1/2 object-cover opacity-35 md:block"
      />
      <Section.Container className="relative z-10 mx-auto max-w-prose">
        <h2 className="type-heading-02 text-on-brand">
          Explore Tea and Herb Catalogues
        </h2>
        <p className="type-body text-on-brand/85 mt-4">
          Browse our catalogues to explore hundreds of options in black tea,
          green tea, herbal blends,and bulk spices. Each listing includes
          quality details to guide your wholesale orders.
        </p>
        <div className="mt-8">
          <Button
            href="/pages/download-catalogues"
            variant="inverseSecondary"
            size="cta"
          >
            Download Catalogue
          </Button>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
