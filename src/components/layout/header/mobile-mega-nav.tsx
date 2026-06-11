'use client'

import Link from 'next/link'
import { ChevronDown, ChevronRight, Phone } from 'lucide-react'
import { useState } from 'react'

import { Button, DisclosureButton } from '@/components/ui'
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
    <div className="bg-paper fixed inset-x-0 top-19 bottom-0 z-55 overflow-y-auto lg:hidden">
      {/* Body — the burger/X in the main bar above is the single close control */}
      <div className="flex flex-col">
        {/* Shop accordion */}
        <div className="border-hairline border-b">
          <DisclosureButton
            aria-controls="mobile-shop-mega"
            aria-expanded={openMenu === 'shop'}
            onClick={() =>
              setOpenMenu((current) => (current === 'shop' ? null : 'shop'))
            }
            className="px-gutter font-display text-ink flex min-h-0 w-full items-center justify-between rounded-none py-5 text-2xl"
          >
            Shop
            <ChevronDown
              className={cn(
                'text-ink-faint size-5 transition-transform',
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
        <div className="border-hairline border-b">
          <DisclosureButton
            aria-controls="mobile-services-mega"
            aria-expanded={openMenu === 'services'}
            onClick={() =>
              setOpenMenu((current) =>
                current === 'services' ? null : 'services',
              )
            }
            className="px-gutter font-display text-ink flex min-h-0 w-full items-center justify-between rounded-none py-5 text-2xl"
          >
            Services
            <ChevronDown
              className={cn(
                'text-ink-faint size-5 transition-transform',
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
          <div key={link.href} className="border-hairline border-b">
            <Link
              href={link.href}
              onClick={closeAll}
              className="px-gutter font-display text-ink hover:text-brand flex w-full items-center justify-between py-5 text-2xl transition-colors"
            >
              {link.label}
              <ChevronRight
                className="text-ink-faint size-5"
                aria-hidden="true"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        ))}

        {/* Footer CTA row */}
        <div className="px-gutter flex flex-col gap-3 py-8">
          <Button
            href="/pages/wholesale"
            variant="brand"
            size="lg"
            onClick={closeAll}
          >
            Apply for Wholesale
          </Button>
          <Button
            href="tel:1300729617"
            variant="secondary"
            size="lg"
            onClick={closeAll}
          >
            <Phone className="size-4" aria-hidden="true" />
            1300 729 617
          </Button>
        </div>
      </div>
    </div>
  )
}
