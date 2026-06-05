export type ImageAsset = {
  src: string
  alt: string
  width: number
  height: number
}

export type CapabilityCard = {
  title: string
  description: string
  image: ImageAsset
}

export type TextCard = {
  title: string
  description: string
}

export type QualityCardIcon = 'naturopath' | 'certification' | 'commercial'

export type QualityCard = TextCard & {
  icon: QualityCardIcon
}

const SHOPIFY_FILE_BASE = 'https://cdn.shopify.com/s/files/1/0786/8339/files'

export const HERO_IMAGE = {
  src: `${SHOPIFY_FILE_BASE}/rose_and_green_tea.png?v=1761280323`,
  alt: 'Green tea blended with rose petals',
  width: 1400,
  height: 900,
} satisfies ImageAsset

export const THUMBNAILS = [
  {
    src: `${SHOPIFY_FILE_BASE}/LGandG.png?v=1761280324`,
    alt: 'Lemongrass, ginger, and turmeric blend',
    width: 640,
    height: 640,
  },
  {
    src: `${SHOPIFY_FILE_BASE}/EGT.png?v=1761280324`,
    alt: 'French Earl Grey tea blend',
    width: 640,
    height: 640,
  },
  {
    src: `${SHOPIFY_FILE_BASE}/TeaVision-20.jpg?v=1761281369`,
    alt: 'Teavision product development workspace',
    width: 900,
    height: 600,
  },
  {
    src: `${SHOPIFY_FILE_BASE}/TeaVision-14_1.jpg?v=1761279097`,
    alt: 'Teavision tea blending workspace',
    width: 900,
    height: 600,
  },
  {
    src: `${SHOPIFY_FILE_BASE}/blue_spirulina_powder.png?v=1760854766`,
    alt: 'Blue spirulina powder',
    width: 900,
    height: 900,
  },
] satisfies ImageAsset[]

export const HERO_PROOF_POINTS = [
  'Low MOQ pathways',
  '100+ flavour directions',
  'Organic, Kosher, and Halal options',
]

export const VALUE_POINTS = [
  'R&D samples in 1-3 weeks',
  'Retail and foodservice formats',
  'Export documentation support',
]

export const CAPABILITY_CARDS = [
  {
    title: 'Loose-leaf teas',
    description: 'Sencha, breakfast tea, Earl Grey, oolongs, and hero blends.',
    image: {
      src: `${SHOPIFY_FILE_BASE}/tea_in_jars.webp?v=1760833507`,
      alt: 'Loose-leaf tea in jars',
      width: 900,
      height: 900,
    },
  },
  {
    title: 'Herbal and botanicals',
    description: 'Calm, sleep, digest, detox, and functional herbal blends.',
    image: {
      src: `${SHOPIFY_FILE_BASE}/calm_tea_with_passionflower.png?v=1760853980`,
      alt: 'Herbal tea blend with passionflower',
      width: 900,
      height: 900,
    },
  },
  {
    title: 'Boxes and sachets',
    description: 'Retail cartons, display formats, and single-serve packs.',
    image: {
      src: `${SHOPIFY_FILE_BASE}/tea_cartons_and_boxes_image.png?v=1760835585`,
      alt: 'Tea cartons and retail boxes',
      width: 900,
      height: 900,
    },
  },
  {
    title: 'Powders and instant',
    description: 'Matcha, iced tea powders, chai latte, and superfood blends.',
    image: {
      src: `${SHOPIFY_FILE_BASE}/matcha_powder.png?v=1760848523`,
      alt: 'Matcha powder',
      width: 900,
      height: 900,
    },
  },
  {
    title: 'Iced and cold-brew',
    description: 'Hibiscus, peach, lemon, berry, and summer-ready profiles.',
    image: {
      src: `${SHOPIFY_FILE_BASE}/hibiscus_iced_tea_image.png?v=1760852863`,
      alt: 'Iced hibiscus tea',
      width: 900,
      height: 900,
    },
  },
  {
    title: 'Wellness specials',
    description: 'Sleep, immunity, de-stress, slim, and mood-led blends.',
    image: {
      src: `${SHOPIFY_FILE_BASE}/sleep_tea.png?v=1760848557`,
      alt: 'Sleep tea blend',
      width: 900,
      height: 900,
    },
  },
  {
    title: 'Chai and spice',
    description: 'Sticky chai, turmeric, masala, and warming spice blends.',
    image: {
      src: `${SHOPIFY_FILE_BASE}/Chai_Spice_Tin.png?v=1760834712`,
      alt: 'Chai spice tea tin',
      width: 900,
      height: 900,
    },
  },
  {
    title: 'Loose leaf jars',
    description: 'Retail-ready glass jars and display formats.',
    image: {
      src: `${SHOPIFY_FILE_BASE}/tea_in_jars.webp?v=1760833507`,
      alt: 'Loose-leaf tea in retail jars',
      width: 900,
      height: 900,
    },
  },
  {
    title: 'Pyramid tea bags',
    description: 'Compostable pyramid bags with tag and string options.',
    image: {
      src: `https://www.teavision.com.au/cdn/shop/files/cainyi-paketik-s-odnoi-piramidkoi-i-pustaa-etiketka-na-belom-fone-krupnym-planom_600x.png?v=1760009247`,
      alt: 'Pyramid tea bag with a blank tag',
      width: 600,
      height: 600,
    },
  },
] satisfies CapabilityCard[]

export const QUALITY_CARDS = [
  {
    icon: 'naturopath',
    title: 'Naturopath input',
    description:
      'Option to have blends reviewed for intended use and ingredient direction.',
  },
  {
    icon: 'certification',
    title: 'Certification pathways',
    description:
      'Organic, Kosher, Halal, and HACCP conversations with full traceability.',
  },
  {
    icon: 'commercial',
    title: 'Commercial fit',
    description:
      'Product development grounded in target margins, format, and launch stage.',
  },
] satisfies QualityCard[]

export const PROCESS_STEPS = [
  {
    title: 'Discovery',
    description: 'Goals, claims, flavours, price points, and target markets.',
  },
  {
    title: 'R&D samples',
    description: 'Two to three options developed for tasting and iteration.',
  },
  {
    title: 'Packaging',
    description: 'Pouches, tins, jars, sachets, cartons, or foodservice packs.',
  },
  {
    title: 'Compliance',
    description: 'Ingredient statements, label checks, barcodes, and claims.',
  },
  {
    title: 'Production',
    description: 'Blending, tea-bagging, filling, and quality checks.',
  },
  {
    title: 'Dispatch',
    description: 'National delivery, export preparation, and 3PL support.',
  },
] satisfies TextCard[]

export const FAQS = [
  {
    title: 'What are the MOQs?',
    description:
      'Typical starting MOQs are 20kg for bulk blends or 1,000-3,000 units depending on retail format.',
  },
  {
    title: 'How long do samples take?',
    description:
      'R&D samples are usually ready in 1-3 weeks once the team has your brief.',
  },
  {
    title: 'Can you match a flavour profile we already love?',
    description:
      'Yes. Send reference products or tasting notes and Teavision can create options for review.',
  },
  {
    title: 'Do you export?',
    description:
      'Yes. The team can support export documentation and global dispatch planning.',
  },
] satisfies TextCard[]
