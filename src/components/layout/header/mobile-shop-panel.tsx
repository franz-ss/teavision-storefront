import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { ToggleButton } from '@/components/ui'
import { cn } from '@/lib/utils'

import { SHOP_SECTIONS } from './mega-nav-data'
import { PANEL_LINK_CLASS } from './mega-nav-styles'
import type { ShopMenuProps } from './shop-menu-types'

export function MobileShopPanel({
  activeShop,
  onActiveShopChange,
  onClose,
  open,
}: ShopMenuProps) {
  return (
    <div
      id="mobile-shop-mega"
      className="border-subtle bg-surface-raised border-t"
      hidden={!open}
    >
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 sm:px-6 md:grid-cols-[16rem_minmax(0,1fr)]">
        <div className="overflow-x-auto md:overflow-visible">
          <div className="flex min-w-max gap-2 md:min-w-0 md:flex-col">
            {SHOP_SECTIONS.map((section) => {
              const isActive = section.key === activeShop.key

              return (
                <ToggleButton
                  key={section.key}
                  variant="menuRow"
                  pressed={isActive}
                  onClick={() => onActiveShopChange(section.key)}
                >
                  {section.name}
                  <ChevronRight
                    className={cn(
                      'hidden size-4 md:block',
                      isActive && 'text-brand',
                    )}
                    aria-hidden="true"
                    strokeWidth={1.8}
                  />
                </ToggleButton>
              )
            })}
          </div>
        </div>

        <div id={`mobile-shop-panel-${activeShop.key}`} className="space-y-4">
          <div>
            <p className="type-label text-strong">{activeShop.name}</p>
            {activeShop.description && (
              <p className="type-caption text-muted mt-1 max-w-prose">
                {activeShop.description}
              </p>
            )}
          </div>

          <ul className="grid gap-1 sm:grid-cols-2" role="list">
            {activeShop.links.map((link) => (
              <li key={`mobile-${activeShop.key}-${link.href}-${link.label}`}>
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

          <Link
            href={activeShop.ctaHref}
            className="focus-visible:ring-ring type-label text-brand hover:bg-brand-subtle inline-flex min-h-11 items-center gap-2 rounded-md px-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            onClick={onClose}
          >
            View all {activeShop.name}
            <ChevronRight
              className="size-4"
              aria-hidden="true"
              strokeWidth={1.8}
            />
          </Link>
        </div>
      </div>
    </div>
  )
}
