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
              Private Label &amp; Custom Tea Solutions
            </h2>
          </div>
          <p className="text-ink-soft max-w-[34ch] lg:text-right">
            We partner with you to develop custom blends, manufacture tea bags,
            and deliver fully packaged private label tea products.
          </p>
        </div>
        <ul className="grid gap-4.5 md:grid-cols-3">
          {SERVICE_CARDS.map((card, index) => (
            <li
              key={card.title}
              className="bg-card border border-hairline-2 rounded-lg p-7.5 flex flex-col duration-350 transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-3 motion-reduce:hover:translate-y-0"
            >
              {/* 150px media block */}
              <div className="relative mb-5.5 h-37.5 w-full overflow-hidden rounded-md">
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
              <h3 className="mt-4 font-display text-[1.45rem] leading-[1.1]">
                {card.title}
              </h3>
              {/* Card body */}
              {card.body ? (
                <p className="mt-3 text-[0.96rem] text-ink-soft">{card.body}</p>
              ) : null}
              {/* Link-arrow CTA */}
              <Link
                href={card.href}
                className="mt-5.5 inline-flex items-center gap-2 type-label border-b-[1.5px] border-hairline pb-0.75 text-[0.92rem] hover:border-brand hover:text-brand group"
              >
                {card.action}
                <ArrowRight
                  className="size-3.75 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section.Container>
    </Section.Root>
  )
}
