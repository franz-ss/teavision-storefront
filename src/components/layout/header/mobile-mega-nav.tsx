'use client'

import Link from 'next/link'
import { ChevronDown, ChevronRight, Phone, X } from 'lucide-react'
import { useState } from 'react'

import { Button, DisclosureButton, IconButton } from '@/components/ui'
import { cn } from '@/lib/utils'

import {
  DIRECT_LINKS,
  SHOP_SECTIONS,
  type MenuKey,
  type ShopKey,
} from './mega-nav-data'
import { MobileServicesPanel } from './mobile-services-panel'
import { MobileShopPanel } from './mobile-shop-panel'

type MobileMegaNavProps = {
  open: boolean
  onClose: () => void
}

export function MobileMegaNav({ open, onClose }: MobileMegaNavProps) {
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null)
  const [activeShopKey, setActiveShopKey] = useState<ShopKey>('tea')
  const activeShop =
    SHOP_SECTIONS.find((section) => section.key === activeShopKey) ??
    SHOP_SECTIONS[0]!

  const closeAll = () => {
    setOpenMenu(null)
    onClose()
  }

  if (!open) return null

  return (
    // Overlay starts below the sticky header main bar (top-19 = 76px) so the
    // burger/X button in the main bar remains visible and tappable above it.
    <div className="fixed inset-x-0 bottom-0 top-19 z-55 overflow-y-auto bg-paper lg:hidden">
      {/* Body */}
      <div className="flex flex-col">
        {/* Explicit close row at the top of the overlay for clarity */}
        <div className="flex justify-end px-gutter py-3 border-b border-hairline">
          <IconButton
            aria-label="Close menu"
            variant="ghost"
            size="md"
            onClick={closeAll}
            className="hover:bg-brand-tint hover:text-brand"
          >
            <X className="size-4" aria-hidden="true" strokeWidth={1.8} />
          </IconButton>
        </div>
        {/* Shop accordion */}
        <div className="border-b border-hairline">
          <DisclosureButton
            aria-controls="mobile-shop-mega"
            aria-expanded={openMenu === 'shop'}
            onClick={() =>
              setOpenMenu((current) => (current === 'shop' ? null : 'shop'))
            }
            className="flex w-full items-center justify-between px-gutter py-5 font-display text-2xl text-ink rounded-none min-h-0"
          >
            Shop
            <ChevronDown
              className={cn(
                'size-5 transition-transform text-ink-faint',
                openMenu === 'shop' && 'rotate-180',
              )}
              aria-hidden="true"
              strokeWidth={1.5}
            />
          </DisclosureButton>
          <MobileShopPanel
            activeShop={activeShop}
            onActiveShopChange={setActiveShopKey}
            onClose={closeAll}
            open={openMenu === 'shop'}
          />
        </div>

        {/* Services accordion */}
        <div className="border-b border-hairline">
          <DisclosureButton
            aria-controls="mobile-services-mega"
            aria-expanded={openMenu === 'services'}
            onClick={() =>
              setOpenMenu((current) =>
                current === 'services' ? null : 'services',
              )
            }
            className="flex w-full items-center justify-between px-gutter py-5 font-display text-2xl text-ink rounded-none min-h-0"
          >
            Services
            <ChevronDown
              className={cn(
                'size-5 transition-transform text-ink-faint',
                openMenu === 'services' && 'rotate-180',
              )}
              aria-hidden="true"
              strokeWidth={1.5}
            />
          </DisclosureButton>
          <MobileServicesPanel
            onClose={closeAll}
            open={openMenu === 'services'}
          />
        </div>

        {/* Direct links */}
        {DIRECT_LINKS.map((link) => (
          <div key={link.href} className="border-b border-hairline">
            <Link
              href={link.href}
              onClick={closeAll}
              className="flex w-full items-center justify-between px-gutter py-5 font-display text-2xl text-ink hover:text-brand transition-colors"
            >
              {link.label}
              <ChevronRight
                className="size-5 text-ink-faint"
                aria-hidden="true"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        ))}

        {/* Footer CTA row */}
        <div className="flex flex-col gap-3 px-gutter py-8">
          <Button href="/pages/wholesale" variant="brand" size="lg">
            Apply for Wholesale
          </Button>
          <Button href="tel:1300729617" variant="secondary" size="lg">
            <Phone className="size-4" aria-hidden="true" />
            1300 729 617
          </Button>
        </div>
      </div>
    </div>
  )
}
