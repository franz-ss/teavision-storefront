import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Badge, Eyebrow, ToggleButton } from '@/components/ui'

import { SHOP_IMAGE_SRC, SHOP_SECTIONS } from './mega-nav-data'
import { PANEL_LINK_CLASS } from './mega-nav-styles'
import type { ShopMenuProps } from './shop-menu-types'

export function ShopMegaPanel({
  activeShop,
  onActiveShopChange,
  onClose,
  open,
}: ShopMenuProps) {
  return (
    <div
      id="shop-mega"
      className="absolute inset-x-0 top-full z-50 bg-paper border-b border-hairline shadow-4"
      hidden={!open}
    >
      <div className="max-w-wide mx-auto px-gutter py-10">
        <div className="grid gap-10 max-lg:grid-cols-1 lg:grid-cols-[1.1fr_2.4fr_1.3fr]">
          {/* Intro column */}
          <div className="flex flex-col gap-4">
            <Eyebrow tone="brand">Shop</Eyebrow>
            <h4 className="font-display text-[1.7rem] text-ink leading-[1.04] tracking-[-0.01em]">
              Shop {activeShop.name}
            </h4>
            {activeShop.asideDescription && (
              <p className="text-ink-soft text-[0.95rem] leading-[1.55]">
                {activeShop.asideDescription}
              </p>
            )}
            <Link
              href={activeShop.ctaHref}
              onClick={onClose}
              className="focus-visible:ring-ring mt-2 inline-flex items-center gap-2 type-label border-b-[1.5px] border-hairline pb-1 text-ink hover:border-brand hover:text-brand transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 self-start"
            >
              View all {activeShop.name}
              <ArrowRight className="size-3.75" aria-hidden="true" strokeWidth={1.8} />
            </Link>
          </div>

          {/* Category selector + links */}
          <div className="flex flex-col gap-5">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2" role="list">
              {SHOP_SECTIONS.map((section) => {
                const isActive = section.key === activeShop.key
                return (
                  <ToggleButton
                    key={section.key}
                    variant="chip"
                    pressed={isActive}
                    onClick={() => onActiveShopChange(section.key)}
                    onMouseEnter={() => onActiveShopChange(section.key)}
                  >
                    {section.name}
                  </ToggleButton>
                )
              })}
            </div>

            {/* Links grid */}
            <div id={`shop-panel-${activeShop.key}`}>
              <p className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-ink-faint mb-3">
                Browse {activeShop.name}
              </p>
              <ul
                className="-mx-2.5 grid auto-rows-min grid-cols-2 gap-x-4 gap-y-0.5"
                role="list"
              >
                {activeShop.links.map((link) => (
                  <li key={`${activeShop.key}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className={PANEL_LINK_CLASS}
                      onClick={onClose}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feature card (right) */}
          {activeShop.imageAlt && (
            <div className="relative overflow-hidden rounded-lg aspect-4/3">
              <Image
                src={SHOP_IMAGE_SRC}
                alt={activeShop.imageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 1480px) 370px, 25vw"
              />
              {/* Bottom gradient scrim */}
              <div
                className="absolute inset-0 bg-linear-to-t from-ink/70 to-transparent"
                aria-hidden="true"
              />
              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2">
                <Badge variant="onDark" label="Featured" />
                <p className="font-display text-paper text-[1.1rem] leading-[1.1]">
                  {activeShop.name} Collection
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
