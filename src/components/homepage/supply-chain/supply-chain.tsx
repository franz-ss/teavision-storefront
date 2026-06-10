import Image from 'next/image'

import { Button, Eyebrow, Section } from '@/components/ui'

import { Stamp } from '../stamp'

export function SupplyChain() {
  return (
    <Section.Root tone="inverse" className="overflow-hidden">
      <Section.Container>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,260px)_1fr_minmax(0,210px)]">
          <div className="flex justify-center">
            {/* Original-site handshake brush illustration (owner-supplied asset) */}
            <Image
              src="/images/business-handshake.png"
              alt=""
              aria-hidden="true"
              width={678}
              height={594}
              className="animate-bc-float h-auto w-[clamp(188px,23.5vw,252px)] object-contain motion-reduce:animate-none"
              sizes="(min-width: 1024px) 252px, 40vw"
            />
          </div>

          <div className="mx-auto max-w-[52ch] text-center">
            <Eyebrow tone="gold" className="mb-4 justify-center">
              For business
            </Eyebrow>
            <h2 className="type-heading-01 text-paper">
              Let the experts help <em className="text-gold italic">grow</em>{' '}
              your business
            </h2>
            <p className="type-lede text-paper/75 mt-4">
              Here at Teavision, we take pride in everything we do and
              we&apos;re always on a mission to source the best ingredients at
              the lowest prices. Our team of certified tea masters and
              herbalists are dedicated to helping your business grow and achieve
              it&apos;s goals.
            </p>
            <div className="mt-7 flex justify-center">
              <Button href="/pages/contact" variant="inverse" size="cta">
                Contact the team
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            <Stamp
              top="Business"
              bottom="Teavision"
              tone="none"
              ringSrc="/images/business-stamp.png"
            />
          </div>
        </div>
      </Section.Container>
    </Section.Root>
  )
}
