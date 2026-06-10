'use client'

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

import { DisclosureButton } from '@/components/ui'
import { cn } from '@/lib/utils'

import {
  DIRECT_LINKS,
  SHOP_SECTIONS,
  type MenuKey,
  type ShopKey,
} from './mega-nav-data'
import {
  DESKTOP_MENU_ITEM_CLASS,
  NAV_TRIGGER_CLASS,
} from './mega-nav-styles'
import { ServicesMegaPanel } from './services-mega-panel'
import { ShopMegaPanel } from './shop-mega-panel'
import { useOutsideClose } from './use-outside-close'

export { MobileMegaNav } from './mobile-mega-nav'

export function MegaNav() {
  const navRef = useRef<HTMLElement | null>(null)
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null)
  const [activeShopKey, setActiveShopKey] = useState<ShopKey>('tea')
  const closeMenus = useCallback(() => setOpenMenu(null), [])
  const activeShop =
    SHOP_SECTIONS.find((section) => section.key === activeShopKey) ??
    SHOP_SECTIONS[0]!

  useOutsideClose(navRef, closeMenus)

  return (
    <>
      <nav ref={navRef} aria-label="Main">
        <ul className="flex items-center gap-1" role="list">
          <li
            className={DESKTOP_MENU_ITEM_CLASS}
            onMouseEnter={() => setOpenMenu('shop')}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <DisclosureButton
              aria-controls="shop-mega"
              aria-expanded={openMenu === 'shop'}
              onClick={() =>
                setOpenMenu((current) => (current === 'shop' ? null : 'shop'))
              }
              className={NAV_TRIGGER_CLASS}
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

          <li
            className={DESKTOP_MENU_ITEM_CLASS}
            onMouseEnter={() => setOpenMenu('services')}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <DisclosureButton
              aria-controls="services-menu"
              aria-expanded={openMenu === 'services'}
              onClick={() =>
                setOpenMenu((current) =>
                  current === 'services' ? null : 'services',
                )
              }
              className={NAV_TRIGGER_CLASS}
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
            <li key={link.href} className={DESKTOP_MENU_ITEM_CLASS}>
              <Link href={link.href} className={NAV_TRIGGER_CLASS}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mega panels — rendered at fixed position below the header (utility 38px + main 76px = 114px) */}
      <div
        onMouseEnter={() => openMenu && setOpenMenu(openMenu)}
        onMouseLeave={() => setOpenMenu(null)}
      >
        <ShopMegaPanel
          activeShop={activeShop}
          onActiveShopChange={setActiveShopKey}
          onClose={closeMenus}
          open={openMenu === 'shop'}
        />
        <ServicesMegaPanel
          onClose={closeMenus}
          open={openMenu === 'services'}
        />
      </div>

      {/* Page scrim */}
      {openMenu && (
        <div
          className="fixed inset-0 top-28.5 z-40 bg-ink/35 backdrop-blur-[2px]"
          aria-hidden="true"
          onClick={closeMenus}
        />
      )}
    </>
  )
}
