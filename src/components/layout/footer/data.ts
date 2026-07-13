import { CANONICAL_BLOG_LISTING_PATH } from '@/lib/blog/paths'
import { getFooterLegalLinks } from '@/lib/legal/policies'

import type {
  FooterColumn,
  FooterContactLink,
  FooterImage,
  FooterLink,
  PaymentMethod,
} from './types'

export const MAIN_MENU_LINKS = [
  { href: '/collections/wholesale-bulk-tea', label: 'Tea' },
  { href: '/collections/bulk-tea-bags', label: 'Tea Bags' },
  { href: '/collections/herbs-and-spices', label: 'Herbs & Spices' },
  { href: '/pages/services', label: 'Services' },
  { href: CANONICAL_BLOG_LISTING_PATH, label: 'Tea Journal' },
  { href: '/pages/our-story', label: 'Our Story' },
] satisfies FooterLink[]

const FOOTER_LEGAL_HREFS = [
  '/pages/privacy-policy',
  '/pages/shipping-policy',
  '/pages/refund-policy',
  '/pages/terms-of-service',
  '/pages/cookie-preferences',
] as const

function getRequiredFooterLegalLinks(): FooterLink[] {
  const legalLinks = getFooterLegalLinks()

  return FOOTER_LEGAL_HREFS.map((href) => {
    const link = legalLinks.find((candidate) => candidate.href === href)

    if (!link) {
      throw new Error(`Missing legal footer policy link: ${href}`)
    }

    return link
  })
}

const LEGAL_POLICY_LINKS = getRequiredFooterLegalLinks()

export const FOOTER_LINKS = [
  { href: '/search', label: 'Search' },
  { href: '/account', label: 'Login' },
  { href: '/pages/contact', label: 'Contact us' },
  ...LEGAL_POLICY_LINKS,
] satisfies FooterLink[]

export const FOOTER_COLUMNS = [
  { title: 'Main Menu', links: MAIN_MENU_LINKS },
  { title: 'Footer', links: FOOTER_LINKS },
] satisfies FooterColumn[]

export const CONTACT_LINKS = [
  {
    kind: 'phone',
    href: 'tel:1300729617',
    label: '1300 729 617',
  },
  {
    kind: 'email',
    href: 'mailto:info@teavision.com.au',
    label: 'info@teavision.com.au',
  },
] satisfies FooterContactLink[]

export const PAYMENT_METHODS = [
  {
    label: 'American Express',
  },
  {
    label: 'Apple Pay',
  },
  {
    label: 'Google Pay',
  },
  {
    label: 'Mastercard',
  },
  {
    label: 'PayPal',
  },
  {
    label: 'Shop Pay',
  },
  {
    label: 'Union Pay',
  },
  {
    label: 'Visa',
  },
] satisfies PaymentMethod[]

export const QUALITY_IMAGE = {
  alt: '',
  src: '/images/navigation/teavision-catalogues.png',
  width: 600,
  height: 232,
} satisfies FooterImage
