'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Menu, Phone, Search, ShoppingCart, Sparkles, X } from 'lucide-react'
import { Suspense, useCallback, useState } from 'react'

import { Button, IconButton } from '@/components/ui'

import { CartCount } from './cart-count'
import { MegaNav, MobileMegaNav } from './mega-nav'
import { SearchOverlay } from './search-overlay'

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const openSearch = useCallback(() => setSearchOpen(true), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])

  return (
    <>
      <a
        href="#main-content"
        className="focus-visible:ring-ring bg-paper text-ink fixed left-2 top-2 z-100 -translate-y-16 rounded-full px-4 py-2 type-label focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none focus-visible:translate-y-0"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-60">
        {/* Utility bar */}
        <div className="bg-ink text-paper h-9.5 hidden sm:block">
          <div className="max-w-wide mx-auto flex h-full items-center justify-between px-gutter font-mono text-[11.5px] tracking-[0.08em]">
            <div className="flex items-center gap-2">
              <span>EST. MELBOURNE 2014</span>
              <span className="text-paper/50" aria-hidden="true">·</span>
              <span>ACO + USDA CERTIFIED ORGANIC</span>
              <span className="text-paper/50" aria-hidden="true">·</span>
              <span>FREIGHT-INSURED, WORLDWIDE</span>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/pages/wholesale"
                className="flex items-center gap-1 text-paper/85 hover:text-paper transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm"
              >
                <Sparkles className="size-3" aria-hidden="true" />
                Apply for wholesale
              </Link>
              <span className="text-paper/50" aria-hidden="true">·</span>
              <a
                href="tel:1300729617"
                className="flex items-center gap-1 text-paper/85 hover:text-paper transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm"
                aria-label="Call Teavision at 1300 729 617"
              >
                <Phone className="size-3" aria-hidden="true" />
                1300 729 617
              </a>
            </div>
          </div>
        </div>

        {/* Main bar */}
        <div className="h-19 bg-paper/80 backdrop-blur-md border-b border-hairline">
          <div className="max-w-wide mx-auto flex h-full items-center justify-between gap-4 px-gutter">
            {/* Logo */}
            <Link
              href="/"
              className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
              aria-label="Teavision home"
            >
              <Image
                src="/teavision.svg"
                alt="Teavision"
                width={188}
                height={44}
                className="h-7 w-auto sm:h-8"
              />
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center flex-1 justify-center">
              <MegaNav />
            </div>

            {/* Right cluster */}
            <div className="flex shrink-0 items-center gap-1">
              {/* Search icon */}
              <IconButton
                aria-label="Open search"
                variant="ghost"
                size="md"
                onClick={openSearch}
                className="hover:bg-brand-tint hover:text-brand"
              >
                <Search className="size-4" aria-hidden="true" strokeWidth={1.8} />
              </IconButton>

              {/* Cart icon */}
              <Link
                href="/cart"
                className="relative inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-brand-tint hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Cart"
              >
                <ShoppingCart className="size-4" aria-hidden="true" strokeWidth={1.8} />
                <Suspense fallback={null}>
                  <CartCount />
                </Suspense>
              </Link>

              {/* Wholesale CTA — desktop only */}
              <Button
                href="/pages/wholesale"
                variant="brand"
                size="sm"
                className="hidden lg:inline-flex ml-2"
              >
                Wholesale Account
              </Button>

              {/* Burger — mobile only */}
              <IconButton
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                variant="ghost"
                size="md"
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden hover:bg-brand-tint hover:text-brand"
              >
                {mobileOpen ? (
                  <X className="size-4" aria-hidden="true" strokeWidth={1.8} />
                ) : (
                  <Menu className="size-4" aria-hidden="true" strokeWidth={1.8} />
                )}
              </IconButton>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <MobileMegaNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      </header>

      {/* Search overlay — portal outside header to avoid stacking context issues */}
      <SearchOverlay open={searchOpen} onClose={closeSearch} />
    </>
  )
}
