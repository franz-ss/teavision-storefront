import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Eyebrow, Section } from '@/components/ui'

import { SERVICE_CARDS } from '../content'

export function PrivateLabel() {
  return (
    <Section.Root tone="surface">
      <Section.Container>
        {/* Split section head */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow className="mb-4">Private label &amp; custom solutions</Eyebrow>
            <h2 className="type-heading-01">
              We make the tea.
              <br />
              You build the brand.
            </h2>
          </div>
          <p className="text-ink-soft max-w-[34ch] lg:text-right">
            Develop custom blends, manufacture tea bags and ship
            fully-packaged private-label product — all under one certified
            roof.
          </p>
        </div>
        <ul className="grid gap-6 md:grid-cols-3">
          {SERVICE_CARDS.map((card, index) => (
            <li
              key={card.title}
              className="bg-card border border-hairline-2 rounded-lg p-7.5 flex flex-col gap-4 transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-3 motion-reduce:hover:translate-y-0"
            >
              {/* 150px media block */}
              <div className="relative h-37.5 w-full overflow-hidden rounded-md">
                <Image
                  src={card.image.src}
                  alt={card.image.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 90vw"
                  className="object-cover"
                />
              </div>
              {/* Numbering */}
              <p className="font-mono text-xs tracking-[0.14em] uppercase text-gold-deep">
                {String(index + 1).padStart(2, '0')}
              </p>
              {/* Title */}
              <h3 className="font-display text-[1.45rem] leading-[1.1]">
                {card.title}
              </h3>
              {/* Link-arrow CTA */}
              <Link
                href={card.href}
                className="mt-auto inline-flex items-center gap-2 type-label border-b-[1.5px] border-hairline pb-1 hover:border-brand hover:text-brand"
              >
                {card.action}
                <ArrowRight className="size-3.75" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Section.Container>
    </Section.Root>
  )
}
