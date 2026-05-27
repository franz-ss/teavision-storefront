export type MenuKey = 'shop' | 'services'
export type ShopKey = 'tea' | 'tea-bags' | 'herbs-spices' | 'superfood-powders'

export type NavLink = {
  href: string
  label: string
}

export type ShopSection = {
  key: ShopKey
  name: string
  description?: string
  links: NavLink[]
  ctaHref: string
  asideDescription?: string
  imageAlt?: string
}

export const SHOP_IMAGE_SRC =
  'https://cdn.shopify.com/s/files/1/0786/8339/files/6.png?v=1757506061'

export const SHOP_SECTIONS = [
  {
    key: 'tea',
    name: 'Tea',
    description:
      'Explore our collection of black tea, green tea, matcha, and specialty blends, available in both bulk and wholesale packs.',
    ctaHref: '/collections/wholesale-bulk-tea',
    imageAlt: 'Tea',
    asideDescription:
      'Explore bulk tea, cafe-ready formats, specialty blends, and wholesale support from an Australian owned team.',
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
      { href: '/collections/chai', label: 'Herbal Tea' },
      { href: '/collections/chai', label: 'Chai' },
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
      'Explore bulk and private-label tea bag options for cafes, hotels, restaurants, and retailers.',
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
      'Browse wholesale herbs and spices with practical support for quality, supply, and repeat ordering.',
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

export const SERVICES_LINKS = [
  { href: '/pages/custom-tea-blends', label: 'Custom Tea Blending' },
  { href: '/pages/private-label-packing', label: 'Private Label Solutions' },
  { href: '/pages/tea-bag-manufacturer', label: 'Tea Bag Manufacture' },
  {
    href: '/pages/new-product-development-order-form',
    label: 'New Product Development Request',
  },
  { href: '/pages/bulk-wholesale-supply', label: 'Bulk Wholesale Supply' },
  { href: '/pages/faq', label: 'FAQ' },
] satisfies NavLink[]

export const CATALOGUE_LINKS = [
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

export const DIRECT_LINKS = [
  { href: '/blogs/teavision-blogs', label: 'Tea Journal' },
  { href: '/pages/our-story', label: 'Our Story' },
  { href: '/pages/contact', label: 'Contact' },
] satisfies NavLink[]
