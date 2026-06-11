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
        className="focus-visible:ring-ring bg-paper text-ink type-label fixed top-2 left-2 z-100 -translate-y-16 rounded-full px-4 py-2 focus-visible:translate-y-0 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-60">
        {/* Utility bar — only shown at lg+ where content fits on a single line */}
        <div className="bg-ink text-paper hidden h-9.5 lg:block">
          <div className="max-w-wide px-gutter mx-auto flex h-full items-center justify-between overflow-hidden font-mono text-[11.5px] tracking-[0.08em] whitespace-nowrap">
            <div className="flex items-center gap-2">
              <span>EST. MELBOURNE 2014</span>
              <span className="text-paper/50" aria-hidden="true">
                ·
              </span>
              <span>ACO + USDA CERTIFIED ORGANIC</span>
              <span className="text-paper/50" aria-hidden="true">
                ·
              </span>
              <span>FREIGHT-INSURED, WORLDWIDE</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/pages/wholesale-account-request"
                className="text-paper/85 hover:text-paper focus-visible:ring-ring flex items-center gap-1 rounded-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
              >
                <Sparkles className="size-3" aria-hidden="true" />
                Apply for wholesale
              </Link>
              <span className="text-paper/50" aria-hidden="true">
                ·
              </span>
              <a
                href="tel:1300729617"
                className="text-paper/85 hover:text-paper focus-visible:ring-ring flex items-center gap-1 rounded-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
                aria-label="Call Teavision at 1300 729 617"
              >
                <Phone className="size-3" aria-hidden="true" />
                1300 729 617
              </a>
            </div>
          </div>
        </div>

        {/* Main bar — relative: mega panels anchor to its bottom via absolute top-full.
            (backdrop-blur makes this div the containing block for fixed descendants,
            so fixed+viewport-offset positioning inside it lands 38px low.) */}
        <div className="bg-paper/80 border-hairline relative h-19 border-b backdrop-blur-md">
          <div className="max-w-wide px-gutter mx-auto flex h-full items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="focus-visible:ring-ring shrink-0 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
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
            <div className="hidden flex-1 items-center justify-center lg:flex">
              <MegaNav />
            </div>

            {/* Right cluster — negative margin aligns the last icon glyph (not its
                44px hit area) with the gutter, mirroring the logo's left edge.
                Desktop ends with the solid Wholesale pill, which needs no offset. */}
            <div className="-mr-3.5 flex shrink-0 items-center gap-1 lg:mr-0">
              {/* Search icon */}
              <IconButton
                aria-label="Open search"
                variant="ghost"
                size="md"
                onClick={openSearch}
                className="hover:bg-brand-tint hover:text-brand"
              >
                <Search
                  className="size-4"
                  aria-hidden="true"
                  strokeWidth={1.8}
                />
              </IconButton>

              {/* Cart icon */}
              <Link
                href="/cart"
                className="text-ink-soft hover:bg-brand-tint hover:text-brand focus-visible:ring-ring relative inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                aria-label="Cart"
              >
                <ShoppingCart
                  className="size-4"
                  aria-hidden="true"
                  strokeWidth={1.8}
                />
                <Suspense fallback={null}>
                  <CartCount />
                </Suspense>
              </Link>

              {/* Wholesale CTA — desktop only */}
              <Button
                href="/pages/wholesale-account-request"
                variant="brand"
                size="sm"
                className="ml-2 hidden lg:inline-flex"
              >
                Wholesale Account
              </Button>

              {/* Burger — mobile only */}
              <IconButton
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-mega-nav"
                variant="ghost"
                size="md"
                onClick={() => setMobileOpen((v) => !v)}
                className="hover:bg-brand-tint hover:text-brand lg:hidden"
              >
                {mobileOpen ? (
                  <X className="size-4" aria-hidden="true" strokeWidth={1.8} />
                ) : (
                  <Menu
                    className="size-4"
                    aria-hidden="true"
                    strokeWidth={1.8}
                  />
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
