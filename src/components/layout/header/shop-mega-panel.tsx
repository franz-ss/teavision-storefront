import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { ToggleButton } from '@/components/ui'

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
      className="absolute top-full left-1/2 z-50 w-[min(calc(100vw-2rem),72rem)] -translate-x-1/2"
      hidden={!open}
    >
      <div className="border-subtle bg-surface-raised max-h-[min(38rem,calc(100vh-8rem))] overflow-y-auto rounded-lg border shadow-xl">
        <div className="grid grid-cols-[minmax(16rem,0.9fr)_minmax(0,1.7fr)]">
          <div className="bg-brand-subtle p-4">
            <div className="space-y-2">
              {SHOP_SECTIONS.map((section) => {
                const isActive = section.key === activeShop.key

                return (
                  <ToggleButton
                    key={section.key}
                    variant="menuCard"
                    pressed={isActive}
                    onClick={() => onActiveShopChange(section.key)}
                    onFocus={() => onActiveShopChange(section.key)}
                    onMouseEnter={() => onActiveShopChange(section.key)}
                  >
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="type-label">{section.name}</span>
                      {section.description && (
                        <span className="type-caption text-muted">
                          {section.description}
                        </span>
                      )}
                    </span>
                    <span className="border-subtle bg-surface text-brand mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border">
                      <ChevronRight
                        className="size-3.5"
                        aria-hidden="true"
                        strokeWidth={1.8}
                      />
                    </span>
                  </ToggleButton>
                )
              })}
            </div>
          </div>

          <div
            id={`shop-panel-${activeShop.key}`}
            className="grid grid-cols-[minmax(0,1fr)_18rem] gap-6 p-5"
          >
            <ul
              className="grid auto-rows-min grid-cols-2 gap-x-4 gap-y-1"
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

            <aside className="border-subtle bg-surface flex flex-col gap-3 rounded-md border p-3">
              {activeShop.imageAlt && (
                <Image
                  src={SHOP_IMAGE_SRC}
                  alt={activeShop.imageAlt}
                  width={420}
                  height={405}
                  className="aspect-4/3 w-full rounded-md object-cover"
                  sizes="288px"
                />
              )}
              {activeShop.asideDescription && (
                <p className="type-caption text-muted">
                  {activeShop.asideDescription}
                </p>
              )}
              <Link
                href={activeShop.ctaHref}
                className="focus-visible:ring-ring type-label text-brand hover:bg-brand-subtle inline-flex min-h-10 items-center justify-between gap-2 rounded-md px-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                onClick={onClose}
              >
                View all
                <ChevronRight
                  className="size-4"
                  aria-hidden="true"
                  strokeWidth={1.8}
                />
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
