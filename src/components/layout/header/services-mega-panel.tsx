import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Eyebrow } from '@/components/ui'

import { CatalogueLinks } from './catalogue-links'
import { ServicesLinks } from './services-links'
import type { ServicesMenuProps } from './services-menu-types'

export function ServicesMegaPanel({ onClose, open }: ServicesMenuProps) {
  return (
    <div
      id="services-menu"
      className="fixed inset-x-0 top-28.5 z-50 bg-paper border-b border-hairline shadow-4"
      hidden={!open}
    >
      <div className="max-w-wide mx-auto px-gutter py-10">
        <div className="grid gap-10 max-lg:grid-cols-1 lg:grid-cols-[1.1fr_3.7fr]">
          {/* Intro column */}
          <div className="flex flex-col gap-4">
            <Eyebrow tone="brand">Services</Eyebrow>
            <h4 className="font-display text-[1.7rem] text-ink leading-[1.04] tracking-[-0.01em]">
              Build your brand
            </h4>
            <p className="text-ink-soft text-[0.95rem] leading-[1.55]">
              From a single signature blend to fully-packaged private label —
              concept to shelf.
            </p>
            <Link
              href="/pages/wholesale"
              onClick={onClose}
              className="focus-visible:ring-ring mt-2 inline-flex items-center gap-2 type-label border-b-[1.5px] border-hairline pb-1 text-ink hover:border-brand hover:text-brand transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 self-start"
            >
              All services
              <ArrowRight className="size-3.75" aria-hidden="true" strokeWidth={1.8} />
            </Link>
          </div>

          {/* Link columns */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <ServicesLinks onClose={onClose} />
            <CatalogueLinks onClose={onClose} />
          </div>
        </div>
      </div>
    </div>
  )
}
