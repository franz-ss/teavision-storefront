import Image from 'next/image'

import { Section } from '@/components/ui'

import { SUPPLY_CHAIN_IMAGES } from '../content'

export function SupplyChain() {
  return (
    <Section.Root tone="surface" spacing="compact">
      <Section.Container>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
          {SUPPLY_CHAIN_IMAGES.map((image, index) => (
            <li key={`${image.src}-${index}`}>
              <div className="flex min-h-28 items-center justify-center rounded-md p-4">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes="(min-width: 1024px) 12vw, 45vw"
                  className="h-auto w-full max-w-36 object-contain"
                />
              </div>
            </li>
          ))}
        </ul>
      </Section.Container>
    </Section.Root>
  )
}
