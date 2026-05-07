'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { RefObject } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { DisclosureButton, ToggleButton } from '@/components/ui'
import { cn } from '@/lib/utils'

type MenuKey = 'shop' | 'services'
type ShopKey = 'tea' | 'tea-bags' | 'herbs-spices' | 'superfood-powders'

type NavLink = {
  href: string
  label: string
}

type ShopSection = {
  key: ShopKey
  name: string
  description?: string
  links: NavLink[]
  ctaHref: string
  asideDescription?: string
  imageAlt?: string
}

const NAV_TRIGGER_CLASS =
  'type-label focus-visible:ring-ring inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-default transition-colors hover:text-brand focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

const PANEL_LINK_CLASS =
  'focus-visible:ring-ring type-body-sm inline-flex min-h-11 items-center rounded-md px-2 text-default transition-colors hover:bg-surface-sunken hover:text-brand focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

const DESKTOP_MENU_ITEM_CLASS = 'flex min-h-[72px] items-center'

const SHOP_IMAGE_SRC =
  'https://cdn.shopify.com/s/files/1/0786/8339/files/6.png?v=1757506061'

const SHOP_SECTIONS = [
  {
    key: 'tea',
    name: 'Tea',
    description:
      'Explore our collection of black tea, green tea, matcha, and specialty blends, available in both bulk and wholesale packs.',
    ctaHref: '/collections/wholesale-bulk-tea',
    imageAlt: 'Tea',
    asideDescription:
      'Established in 2014, Teavision is proudly 100% Australian owned and operated, and has grown to become Au...',
    links: [
      {
        href: '/collections/tea-masters-selection-worlds-best-teas',
        label: 'Rare, Premium & Exclusive Teas',
      },
      {
        href: '/collections/australian-native-ingredients',
        label: 'Australian Native Tea',
      },
      { href: '/collections/black-tea', label: 'Black Tea' },
      { href: '/collections/green-tea', label: 'Green Tea' },
      { href: '/collections/bulk-wholesale-chai', label: 'Herbal Tea' },
      { href: '/collections/bulk-wholesale-chai', label: 'Chai' },
      {
        href: '/collections/wellness-functional-tea',
        label: 'Health and Wellness Blends',
      },
      { href: '/collections/speciality-tea', label: 'Specialty Tea' },
      { href: '/collections/matcha-tea', label: 'Matcha Tea' },
      { href: '/collections/white-tea', label: 'White Tea' },
      {
        href: '/collections/organic-tea',
        label: 'Certified Organic Tea Range',
      },
      { href: '/collections/cafe-range', label: 'Cafe Range' },
      { href: '/collections/bulk-tea-bags', label: 'Cafe Ready Tea Bags' },
      {
        href: '/collections/dessert-cocktail-inspired-blends',
        label: 'Cocktail Inspired Blends',
      },
      { href: '/pages/custom-tea-blends', label: 'Custom Tea Blends' },
    ],
  },
  {
    key: 'tea-bags',
    name: 'Tea Bags',
    description:
      'From bulk tea bags to individually wrapped wholesale tea bags, we supply solutions for cafes, restaurants, and retailers.',
    ctaHref: '/collections/bulk-tea-bags',
    imageAlt: 'Tea Bags',
    asideDescription:
      'This unique fermented tea is traditionally made in China’s Yunnan province, and is believed to have been...',
    links: [
      { href: '/collections/bulk-tea-bags', label: 'Ready Made Tea Bag Packs' },
      {
        href: '/pages/tea-bag-manufacturer',
        label: 'Custom & Private Label Tea Bags',
      },
      {
        href: 'https://cdn.shopify.com/s/files/1/0786/8339/files/Teavision_Tea_Bag_Catalogue_1.pdf?v=1640138688',
        label: 'Download Tea Bag Catalogue',
      },
    ],
  },
  {
    key: 'herbs-spices',
    name: 'Herbs & Spices',
    description:
      'Source bulk herbs and spices Australia-wide with confidence. We partner with ethical farmers to deliver wholesale herbs, botanicals, and spices that meet the highest standards.',
    ctaHref: '/collections/herbs-and-spices',
    imageAlt: 'Herbs & Spices',
    asideDescription:
      'This unique fermented tea is traditionally made in China’s Yunnan province, and is believed to have been...',
    links: [
      { href: '/collections/herbs-and-spices', label: 'All Spices & Herbs' },
    ],
  },
  {
    key: 'superfood-powders',
    name: 'Superfood Powders',
    ctaHref: '/collections/superfood-extract-powders-proteins-supplements',
    links: [
      {
        href: '/collections/superfood-extract-powders-proteins-supplements',
        label: 'All Products',
      },
    ],
  },
] satisfies ShopSection[]

const SERVICES_LINKS = [
  { href: '/collections/custom-tea-blends', label: 'Custom Tea Blending' },
  { href: '/pages/private-label-packing', label: 'Private Label Solutions' },
  { href: '/pages/tea-bag-manufacturer', label: 'Tea Bag Manufacture' },
  {
    href: '/pages/new-product-development-order-form',
    label: 'New Product Development Request',
  },
  { href: '/pages/bulk-wholesale-supply', label: 'Bulk Wholesale Supply' },
  { href: '/pages/faq', label: 'FAQ' },
] satisfies NavLink[]

const CATALOGUE_LINKS = [
  {
    href: 'https://cdn.shopify.com/s/files/1/0786/8339/files/Teavision_Tea_Cafe_Catalogue_f01248e9-e5fe-42c4-a708-f135d89fdde6.pdf?v=1633393698',
    label: 'Tea Catalogue',
  },
  {
    href: 'https://cdn.shopify.com/s/files/1/0786/8339/files/Teavision_Tea_Bag_Catalogue_1.pdf?v=1640138688',
    label: 'Tea Bag Catalogue',
  },
  {
    href: 'https://cdn.shopify.com/s/files/1/0786/8339/files/Beverage_RTD_Catalogue_Teavision.pdf?v=1633393450',
    label: 'Beverage, Natural Sweeteners, Juices',
  },
  {
    href: 'https://cdn.shopify.com/s/files/1/0786/8339/files/HERBS_SPICES_CATALOGUE_2021_1_-compressed.pdf?v=1639355955',
    label: 'Herbs & Spices Catalogue',
  },
  {
    href: 'https://cdn.shopify.com/s/files/1/0786/8339/files/BLENDS_CATALOGUE_2021_1_-compressed.pdf?v=1639356205',
    label: 'Tea Blends Catalogue',
  },
  {
    href: 'https://cdn.shopify.com/s/files/1/0786/8339/files/ACO_Certificate_221004.pdf?v=1669809178',
    label: 'ACO Organic Certificate - Full Organic Range',
  },
] satisfies NavLink[]

const DIRECT_LINKS = [
  { href: '/blogs/teavision-blogs', label: 'Tea Journal' },
  { href: '/pages/our-story', label: 'Our Story' },
  { href: '/pages/contact', label: 'Contact' },
] satisfies NavLink[]

const MOBILE_TOP_LINKS = [...DIRECT_LINKS] satisfies NavLink[]

function useOutsideClose(
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        ref.current &&
        event.target instanceof Node &&
        !ref.current.contains(event.target)
      ) {
        onClose()
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, ref])
}

export function HeaderMegaNav() {
  const navRef = useRef<HTMLElement | null>(null)
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null)
  const [activeShopKey, setActiveShopKey] = useState<ShopKey>('tea')
  const closeMenus = useCallback(() => setOpenMenu(null), [])
  const activeShop =
    SHOP_SECTIONS.find((section) => section.key === activeShopKey) ??
    SHOP_SECTIONS[0]

  useOutsideClose(navRef, closeMenus)

  return (
    <nav ref={navRef} aria-label="Main">
      <ul className="flex items-center gap-4" role="list">
        <li
          className={DESKTOP_MENU_ITEM_CLASS}
          onMouseEnter={() => setOpenMenu('shop')}
          onMouseLeave={() => setOpenMenu(null)}
        >
          <DisclosureButton
            aria-controls="header-shop-mega"
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

          <div
            id="header-shop-mega"
            className="absolute top-full left-1/2 z-50 w-[min(calc(100vw-2rem),72rem)] -translate-x-1/2"
            hidden={openMenu !== 'shop'}
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
                          onClick={() => setActiveShopKey(section.key)}
                          onFocus={() => setActiveShopKey(section.key)}
                          onMouseEnter={() => setActiveShopKey(section.key)}
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
                  id={`header-shop-panel-${activeShop.key}`}
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
                          onClick={closeMenus}
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
                        className="aspect-[4/3] w-full rounded-md object-cover"
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
                      onClick={closeMenus}
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
        </li>

        <li
          className={cn('relative', DESKTOP_MENU_ITEM_CLASS)}
          onMouseEnter={() => setOpenMenu('services')}
          onMouseLeave={() => setOpenMenu(null)}
        >
          <DisclosureButton
            aria-controls="header-services-menu"
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

          <div
            id="header-services-menu"
            className="absolute top-full left-0 z-50 w-[34rem]"
            hidden={openMenu !== 'services'}
          >
            <div className="border-subtle bg-surface-raised max-h-[min(34rem,calc(100vh-8rem))] overflow-y-auto rounded-lg border p-4 shadow-xl">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="type-caption text-muted mb-2">Services</p>
                  <ul className="space-y-1" role="list">
                    {SERVICES_LINKS.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={PANEL_LINK_CLASS}
                          onClick={closeMenus}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="type-caption text-muted mb-2">Catalogues</p>
                  <ul className="space-y-1" role="list">
                    {CATALOGUE_LINKS.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          className={PANEL_LINK_CLASS}
                          onClick={closeMenus}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                    <li>
                      <Link
                        href="/pages/certifications"
                        className={PANEL_LINK_CLASS}
                        onClick={closeMenus}
                      >
                        Organic | Food Safety | Certs and Awards
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </li>

        {DIRECT_LINKS.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={NAV_TRIGGER_CLASS}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function HeaderMobileMegaNav() {
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null)
  const [activeShopKey, setActiveShopKey] = useState<ShopKey>('tea')
  const activeShop =
    SHOP_SECTIONS.find((section) => section.key === activeShopKey) ??
    SHOP_SECTIONS[0]

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
            {MOBILE_TOP_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={NAV_TRIGGER_CLASS}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        id="mobile-shop-mega"
        className="border-subtle bg-surface-raised border-t"
        hidden={openMenu !== 'shop'}
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
                    onClick={() => setActiveShopKey(section.key)}
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
                    onClick={() => setOpenMenu(null)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href={activeShop.ctaHref}
              className="focus-visible:ring-ring type-label text-brand hover:bg-brand-subtle inline-flex min-h-11 items-center gap-2 rounded-md px-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              onClick={() => setOpenMenu(null)}
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

      <div
        id="mobile-services-mega"
        className="border-subtle bg-surface-raised border-t"
        hidden={openMenu !== 'services'}
      >
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-4 sm:px-6 md:grid-cols-2">
          <div>
            <p className="type-caption text-muted mb-2">Services</p>
            <ul className="grid gap-1" role="list">
              {SERVICES_LINKS.map((link) => (
                <li key={`mobile-${link.href}`}>
                  <Link
                    href={link.href}
                    className={PANEL_LINK_CLASS}
                    onClick={() => setOpenMenu(null)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="type-caption text-muted mb-2">Catalogues</p>
            <ul className="grid gap-1" role="list">
              {CATALOGUE_LINKS.map((link) => (
                <li key={`mobile-${link.href}`}>
                  <a
                    href={link.href}
                    className={PANEL_LINK_CLASS}
                    onClick={() => setOpenMenu(null)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/pages/certifications"
                  className={PANEL_LINK_CLASS}
                  onClick={() => setOpenMenu(null)}
                >
                  Organic | Food Safety | Certs and Awards
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}
