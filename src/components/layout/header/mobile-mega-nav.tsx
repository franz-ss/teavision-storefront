'use client'

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

import { DisclosureButton } from '@/components/ui'
import { cn } from '@/lib/utils'

import {
  DIRECT_LINKS,
  SHOP_SECTIONS,
  type MenuKey,
  type ShopKey,
} from './mega-nav-data'
import { NAV_TRIGGER_CLASS } from './mega-nav-styles'
import { MobileServicesPanel } from './mobile-services-panel'
import { MobileShopPanel } from './mobile-shop-panel'

export function MobileMegaNav() {
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null)
  const [activeShopKey, setActiveShopKey] = useState<ShopKey>('tea')
  const activeShop =
    SHOP_SECTIONS.find((section) => section.key === activeShopKey) ??
    SHOP_SECTIONS[0]
  const closeMenus = () => setOpenMenu(null)

  return (
    <nav className="border-subtle border-t lg:hidden" aria-label="Mobile main">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="overflow-x-auto">
          <ul className="flex min-w-max items-center gap-2" role="list">
            <li>
              <DisclosureButton
                aria-controls="mobile-shop-mega"
                aria-expanded={openMenu === 'shop'}
                onClick={() =>
                  setOpenMenu((current) => (current === 'shop' ? null : 'shop'))
                }
              >
                Shop
                <ChevronDown
                  className={cn(
                    'size-4 transition-transform',
                    openMenu === 'shop' && 'rotate-180',
                  )}
                  aria-hidden="true"
                  strokeWidth={1.8}
                />
              </DisclosureButton>
            </li>
            <li>
              <DisclosureButton
                aria-controls="mobile-services-mega"
                aria-expanded={openMenu === 'services'}
                onClick={() =>
                  setOpenMenu((current) =>
                    current === 'services' ? null : 'services',
                  )
                }
              >
                Services
                <ChevronDown
                  className={cn(
                    'size-4 transition-transform',
                    openMenu === 'services' && 'rotate-180',
                  )}
                  aria-hidden="true"
                  strokeWidth={1.8}
                />
              </DisclosureButton>
            </li>
            {DIRECT_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={NAV_TRIGGER_CLASS}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <MobileShopPanel
        activeShop={activeShop}
        onActiveShopChange={setActiveShopKey}
        onClose={closeMenus}
        open={openMenu === 'shop'}
      />
      <MobileServicesPanel
        onClose={closeMenus}
        open={openMenu === 'services'}
      />
    </nav>
  )
}
