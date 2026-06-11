const SHOPIFY_CDN_BASE = 'https://www.teavision.com.au/cdn/shop/files'
const SHOPIFY_FILE_BASE = 'https://cdn.shopify.com/s/files/1/0786/8339/files'

// Section 1 — Hero
export const HERO_IMAGE_SRC = `${SHOPIFY_CDN_BASE}/hero-image_1600x.webp?v=1756890900`

export const HERO_FEATURES = [
  'Custom Blends Available',
  'Global Shipping',
  'Private Label Packaging',
  'MOQ from 8,000 bags',
] as const

export type CertLogo = {
  src: string
  alt: string
}

export const HERO_CERT_LOGOS: CertLogo[] = [
  {
    src: `${SHOPIFY_CDN_BASE}/Australian_Certified_Organic_200x.svg?v=1756888023`,
    alt: 'Australian Certified Organic',
  },
  {
    src: `${SHOPIFY_CDN_BASE}/Frame_200x.svg?v=1756890473`,
    alt: 'Halal certified',
  },
  {
    src: `${SHOPIFY_CDN_BASE}/OK_Kosher_logo_1_200x.svg?v=1756890527`,
    alt: 'OK Kosher certified',
  },
  {
    src: `${SHOPIFY_CDN_BASE}/USDA_organic_seal_2_200x.svg?v=1756890554`,
    alt: 'USDA Organic',
  },
  {
    src: `${SHOPIFY_CDN_BASE}/Mask_group_200x.svg?v=1756890625`,
    alt: 'Made in Australia',
  },
  {
    src: `${SHOPIFY_CDN_BASE}/Organic-Logo_2_200x.svg?v=1756890667`,
    alt: 'Organic certification',
  },
  {
    src: `${SHOPIFY_CDN_BASE}/haccp-australia-vector-logo_2_200x.svg?v=1756890683`,
    alt: 'HACCP Australia',
  },
]

// Section 2 — Statistics band
export type Stat = {
  highlight: string
  label: string
}

export const STATS: Stat[] = [
  { highlight: '10M+', label: 'Tea Bags Sold Annually' },
  { highlight: '#1', label: 'in Australia and New Zealand' },
  { highlight: '50+', label: 'Countries Served' },
  { highlight: '100+', label: 'Tea Varieties' },
]

// Section 3 — Manufacturing solutions
export type SolutionCard = {
  src: string
  alt: string
  title: string
  copy: string
  points: string[]
}

export const SOLUTION_CARDS: SolutionCard[] = [
  {
    src: `${SHOPIFY_CDN_BASE}/Rectangle_4133633.webp?v=1756948727&width=400`,
    alt: 'Custom tea blends',
    title: 'Custom Tea Blends',
    copy: 'Create your unique tea blend or let us develop one for you. Over 100 tea varieties and flavors available.',
    points: [
      'Your own recipe or our expertise',
      'Organic and conventional options',
      'Natural flavoring available',
      'MOQ: 8,000 tea bags for custom blends',
    ],
  },
  {
    src: `${SHOPIFY_CDN_BASE}/Rectangle_4133645.webp?v=1756948753&width=400`,
    alt: 'Private label packaging',
    title: 'Private Label Packaging',
    copy: 'Complete packaging solutions including pouches, cylinders, tins, and individual sachets.',
    points: [
      'Custom artwork and branding',
      'Multiple packaging formats',
      'Premium finishing options',
      'Heat seal pouches and solo bags',
    ],
  },
  {
    src: `${SHOPIFY_CDN_BASE}/Rectangle_4133646.webp?v=1756948861&width=400`,
    alt: 'International shipping',
    title: 'International Shipping',
    copy: 'Reliable worldwide shipping from Australia to any country with full logistics support.',
    points: [
      'Ship to any country globally',
      'Competitive international rates',
      'Full tracking and insurance',
      'Export documentation handled',
    ],
  },
]

// Section 5 — Tea bag & packaging options
export const TEA_BAG_STYLES_IMAGE_SRC = `${SHOPIFY_CDN_BASE}/tea-bag_600x.webp?v=1756953539`

export type PackagingItem = {
  title: string
  description: string
}

export const TEA_BAG_STYLES: PackagingItem[] = [
  { title: 'Square Tea Bags', description: 'Standard tea bags' },
  { title: 'Pyramid Tea Bags', description: 'Premium pyramid style' },
  { title: 'Custom Tagged', description: 'Your artwork on tags' },
  { title: 'Individual Sachets', description: 'Premium sachets' },
]

export const PACKAGING_SOLUTIONS: PackagingItem[] = [
  {
    title: 'Pouches & Cylinders',
    description: 'Custom branded packaging options',
  },
  {
    title: 'Tins & Containers',
    description: 'Premium metal and plastic containers',
  },
  {
    title: 'Heat Seal Pouches',
    description: 'Professional retail-ready packaging',
  },
]

export type PackagingImage = {
  src: string
  alt: string
}

export const PACKAGING_IMAGES: PackagingImage[] = [
  {
    src: `${SHOPIFY_CDN_BASE}/Rectangle_4133652_600x.webp?v=1756955444`,
    alt: 'Branded tea pouch packaging',
  },
  {
    src: `${SHOPIFY_CDN_BASE}/cainyi-paketik-s-odnoi-piramidkoi-i-pustaa-etiketka-na-belom-fone-krupnym-planom_600x.png?v=1760009247`,
    alt: 'Pyramid tea bag with blank tag',
  },
  {
    src: `${SHOPIFY_CDN_BASE}/Rectangle_4133650_600x.webp?v=1756955466`,
    alt: 'Custom tea tin packaging',
  },
  {
    src: `${SHOPIFY_CDN_BASE}/Rectangle_4133651_600x.webp?v=1756955470`,
    alt: 'Retail-ready tea cartons',
  },
  {
    src: `${SHOPIFY_CDN_BASE}/Green_Roots_Sachet_High_Res_600x.webp?v=1762867570`,
    alt: 'Green Roots individual sachet',
  },
  {
    src: `${SHOPIFY_CDN_BASE}/green_roots_tea_bags_high_res_600x.webp?v=1762867582`,
    alt: 'Green Roots tea bags',
  },
  {
    src: `${SHOPIFY_CDN_BASE}/pavillion_hgih_res_600x.webp?v=1762867582`,
    alt: 'Pavilion branded tea packaging',
  },
  {
    src: `${SHOPIFY_CDN_BASE}/sachet_1_high_res_600x.webp?v=1762867581`,
    alt: 'Heat seal tea sachet',
  },
  {
    src: `${SHOPIFY_CDN_BASE}/st_jennis_high_resolution_600x.webp?v=1762867581`,
    alt: 'St Jennis branded tea packaging',
  },
]

// Section 6 — Simple 3-step process
export type ProcessStep = {
  number: number
  title: string
  description: string
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: 1,
    title: 'Choose Your Blend',
    description:
      "Select from our 100+ tea varieties or create a custom blend. We'll help you find the perfect taste profile.",
  },
  {
    number: 2,
    title: 'Design & Package',
    description:
      "Choose your tea bag style and packaging. We'll create custom artwork and branding for your products.",
  },
  {
    number: 3,
    title: 'Manufacture & Ship',
    description:
      'We manufacture your tea bags and ship them worldwide. Lead times average between 2-6 weeks.',
  },
]

// Section 8 — Ready-to-ship tea bags
export const READY_TO_SHIP_IMAGE_SRC = `${SHOPIFY_CDN_BASE}/tea-varieties_59760a77-ee2e-4095-b2d7-51542865eabd_600x.webp?v=1757040802`

export const READY_TO_SHIP_VARIETIES: PackagingItem[] = [
  { title: 'English Breakfast', description: 'Traditional morning blend' },
  { title: 'Green Tea', description: 'Premium Sencha variety' },
  { title: 'Earl Grey', description: 'Classic Bergamot blend' },
]

export const TEA_LIST_PDF_URL = `${SHOPIFY_FILE_BASE}/Teavision_Tea_Bag_Catalogue_1.pdf?v=1640138688`
