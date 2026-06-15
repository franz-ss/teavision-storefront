export type CatalogueIcon =
  | 'leaf'
  | 'teaBag'
  | 'beverage'
  | 'herbs'
  | 'blends'
  | 'certificate'

export type Catalogue = {
  id: string
  title: string
  plateLabel: string
  description: string
  href: string
  fileSize: string
  icon: CatalogueIcon
  isCertificate?: boolean
}

export const PAGE_PATH = '/pages/download-catalogues'

export const HERO = {
  eyebrow: 'Catalogues',
  title: 'Explore & Download Our Catalogues',
  copy: 'Wholesale teas, custom tea bags, herbs & spices. Download the latest catalogues or request a curated pack.',
  badges: ['HACCP Program', 'ACO Organic', 'Private Label'],
} as const

export const CATALOGUES: Catalogue[] = [
  {
    id: 'tea',
    title: 'Tea Catalogue',
    plateLabel: 'Tea',
    description: 'Loose leaf teas & botanicals with pack sizes & MOQs.',
    href: '/vendor/catalogues/tea-cafe-catalogue.pdf',
    fileSize: '4.2 MB',
    icon: 'leaf',
  },
  {
    id: 'tea-bags',
    title: 'Tea Bag Catalogue',
    plateLabel: 'Tea Bags',
    description: 'Pyramid & envelope options, MOQs & lead times.',
    href: '/vendor/catalogues/tea-bag-catalogue.pdf',
    fileSize: '12.8 MB',
    icon: 'teaBag',
  },
  {
    id: 'beverage',
    title: 'Beverage, Natural Sweeteners, Juices',
    plateLabel: 'Drinks',
    description: 'Ready-to-drink beverages, natural sweeteners, and juices.',
    href: '/vendor/catalogues/beverage-rtd-catalogue.pdf',
    fileSize: '18.5 MB',
    icon: 'beverage',
  },
  {
    id: 'herbs-spices',
    title: 'Herbs & Spices',
    plateLabel: 'Herbs',
    description: 'Bulk botanicals with pack sizes and availability.',
    href: '/vendor/catalogues/herbs-spices-catalogue.pdf',
    fileSize: '4.4 MB',
    icon: 'herbs',
  },
  {
    id: 'tea-blends',
    title: 'Tea Blends',
    plateLabel: 'Blends',
    description: 'Functional & signature blends for retail and foodservice.',
    href: '/vendor/catalogues/tea-blends-catalogue.pdf',
    fileSize: '5.2 MB',
    icon: 'blends',
  },
  {
    id: 'aco-organic',
    title: 'ACO Organic Ingredients List',
    plateLabel: 'ACO',
    description: 'Full ACO-certified product list (Teavision certification).',
    href: '/vendor/catalogues/aco-organic-certificate.pdf',
    fileSize: '245 KB',
    icon: 'certificate',
    isCertificate: true,
  },
]

export const CTA = {
  title: 'Request a curated pack',
  copy: "Tell us your channel and volume and we'll send the right catalogues plus matching samples.",
  primary: { href: '/pages/contact', label: 'Request catalogue help' },
  secondary: { href: '/collections', label: 'Browse the range' },
} as const
