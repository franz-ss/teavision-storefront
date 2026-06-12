// Section 1 — Hero images
export const HERO_IMAGE_SRC =
  '/images/tea-bag-manufacturer/tea-bag-manufacturer-hero.webp'
export const HERO_GRID_IMAGE_1_SRC =
  '/images/custom-tea-blends/tea-in-jars.webp'
export const HERO_GRID_IMAGE_2_SRC =
  '/images/private-label-packing/mushroom-lions-mane-pouch.png'
export const HERO_GRID_IMAGE_3_SRC =
  '/images/tea-bag-manufacturer/ready-to-ship-tea-varieties.webp'

export const HERO_TRUST_PILLS = [
  'Trusted by 1,000+ brands',
  'Low MOQs',
  'Retail & Foodservice',
  'Export-ready docs',
] as const

// Section 2 — Certifications strip
export const CERT_SPANS = [
  'Organic • Conventional • Kosher • Halal • HACCP • GMP',
  'Pyramid & Envelope Bags • Loose Leaf • Instant Powders',
  'Compostable & Recyclable Packaging Options',
] as const

// Section 3 — Your Brand, Our Product
export const YOUR_BRAND_IMAGE_SRC =
  '/images/custom-tea-blends/tea-cartons-boxes.png'

export const YOUR_BRAND_LIST_ITEMS = [
  'Use our proven formulations or brief a custom blend',
  'Pick your format: tea bags, pouches, tins, jars, cartons',
  'Compliant labels, batch codes and barcodes included',
  'Low MOQs with export-ready documentation',
] as const

// Section 4 — Best Selling Custom Label Ideas
export type CapabilityCard = {
  src: string
  alt: string
  title: string
  tag: string
}

export const CAPABILITY_CARDS: CapabilityCard[] = [
  {
    src: '/images/private-label-packing/wellness-tea-blend.png',
    alt: 'Wellness & Specialty Teas',
    title: 'Wellness & Specialty Teas',
    tag: 'Detox • Slim • Immunity • Sleep • Gut Health • Anti-Bloat • Probiotic Support • Hormone Balance • Stress & Focus',
  },
  {
    src: '/images/custom-tea-blends/tea-in-jars.webp',
    alt: 'Herbal Blends',
    title: 'Herbal Blends',
    tag: "Digestive • Relax • Men's & Women's Health • Detox Cleanse • Calm & Sleep Support • Liver & Gut Repair • Hormone Balance • Immune Boost • Vitality Tonic",
  },
  {
    src: '/images/custom-tea-blends/chai-spice-tin.png',
    alt: 'Chai & Spice',
    title: 'Chai & Spice',
    tag: 'Sticky Chai • Turmeric • Masala • Dirty Chai • Cardamom Vanilla • Cacao Chai • Decaf Spiced',
  },
  {
    src: '/images/private-label-packing/ashwagandha-root.webp',
    alt: 'Extract Powders',
    title: 'Extract Powders',
    tag: "Matcha • Lion's Mane • Ashwagandha • Chaga • Green Vitals Blend • Ginger Powder • Turmeric Powder",
  },
]

// Section 5 — Packaging options & formats
export type PackagingCard = {
  src: string
  alt: string
  title: string
  tag: string
}

export const PACKAGING_CARDS: PackagingCard[] = [
  {
    src: '/images/private-label-packing/pouch-packaging-options.png',
    alt: 'Pouches',
    title: 'Stand-up Pouches',
    tag: 'Matte/gloss • Zip • Valve',
  },
  {
    src: '/images/private-label-packing/tea-tin-packaging.png',
    alt: 'Tins & Canisters',
    title: 'Tins & Canisters',
    tag: 'Double-lid • Emboss/deboss',
  },
  {
    src: '/images/private-label-packing/private-label-production.jpg',
    alt: 'Glass Jars',
    title: 'Glass Jars',
    tag: 'Amber/clear • Metal cap',
  },
  {
    src: '/images/custom-tea-blends/tea-cartons-boxes.png',
    alt: 'Boxes & Cartons',
    title: 'Boxes & Cartons',
    tag: 'Retail display • Inserts',
  },
]

// Section 6 — From brief to shelf in 5 steps
export type ProcessStep = {
  number: number
  title: string
  description: string
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: 1,
    title: 'Discovery',
    description: 'Goals, price points, timelines & markets.',
  },
  {
    number: 2,
    title: 'R&D & Samples',
    description: 'We develop options; you taste and iterate.',
  },
  {
    number: 3,
    title: 'Packaging',
    description: 'Choose stock or custom; dielines & artwork support.',
  },
  {
    number: 4,
    title: 'Production',
    description: 'Tea bagging, blending, filling & QC under GMP/HACCP.',
  },
  {
    number: 5,
    title: 'Dispatch',
    description: 'National delivery or export. 3PL & re-orders.',
  },
]

// Section 7 — Top 20 Private Label Products
export type ProductCard = {
  src: string
  alt: string
  name: string
  tag: string
}

export const TOP_PRODUCTS: ProductCard[] = [
  {
    src: '/images/custom-tea-blends/matcha-powder.png',
    alt: 'Organic Ceremonial Matcha',
    name: 'Organic Ceremonial Matcha',
    tag: 'Ceremonial',
  },
  {
    src: '/images/private-label-packing/turmeric-latte.png',
    alt: 'Golden Milk Turmeric',
    name: 'Golden Milk Turmeric',
    tag: 'Curcumin + ginger + pepper',
  },
  {
    src: '/images/custom-tea-blends/sleep-tea.png',
    alt: 'Sleep—Chamomile Lavender',
    name: 'Sleep—Chamomile Lavender',
    tag: 'With lemon balm',
  },
  {
    src: '/images/private-label-packing/yerba-mate-energy-tea.png',
    alt: 'Energy—Yerba Mate',
    name: 'Energy—Yerba Mate',
    tag: 'Guarana + L-theanine',
  },
  {
    src: '/images/private-label-packing/ginger-lemon-tea.png',
    alt: 'Detox Lemon Ginger',
    name: 'Detox Lemon Ginger',
    tag: 'Dandelion + milk thistle',
  },
  {
    src: '/images/private-label-packing/collagen-blend.png',
    alt: 'Collagen Beauty Elixir',
    name: 'Collagen Beauty Elixir',
    tag: 'Vitamin C + hyaluronic',
  },
  {
    src: '/images/private-label-packing/superblend.png',
    alt: 'Greens Vital Blend',
    name: 'Greens Vital Blend – 20+ Key Ingredients & Minerals for Optimal Health',
    tag: 'Spirulina + wheatgrass',
  },
  {
    src: '/images/private-label-packing/mushroom-complex.png',
    alt: 'Organic Mushroom Blends',
    name: 'High Quality Organic Mushroom Blends 20:1',
    tag: "Reishi + lion's mane",
  },
  {
    src: '/images/custom-tea-blends/hibiscus-iced-tea.png',
    alt: 'Hibiscus Iced Tea',
    name: 'Hibiscus Iced Tea',
    tag: 'Vitamin-rich summer hit',
  },
  {
    src: '/images/private-label-packing/chocolate-sleep-drink.png',
    alt: 'Night Time Chocolate Sleep Blend',
    name: 'Night Time Chocolate Sleep Blend + Magnesium',
    tag: 'Relaxation blend with cocoa & adaptogens',
  },
  {
    src: '/images/private-label-packing/sticky-chai-latte.png',
    alt: 'Organic Chai Spice Blend',
    name: 'Organic Chai Spice Blend',
    tag: 'Sticky chai or dry spice',
  },
  {
    src: '/images/private-label-packing/l-theanine-powder-blend.png',
    alt: 'L-theanine Powder',
    name: 'L-theanine Powder',
    tag: 'Amino acid for focus & calm',
  },
  {
    src: '/images/private-label-packing/collagen-peptides-skin-glow.png',
    alt: 'Collagen Peptides (Bovine)',
    name: 'Collagen Peptides (Bovine)',
    tag: 'Hydrolysed protein for beauty & recovery',
  },
  {
    src: '/images/custom-tea-blends/blue-spirulina-powder.png',
    alt: 'Organic Blue Spirulina Antioxidant Blend',
    name: 'Organic Blue Spirulina Antioxidant Blend with Ginger, Blueberry & Acai',
    tag: 'Blue superfood blend',
  },
  {
    src: '/images/private-label-packing/ginger-powder.png',
    alt: 'Ginger Powder',
    name: 'Ginger Powder',
    tag: 'Pure powdered ginger root',
  },
  {
    src: '/images/private-label-packing/coconut-water-hydration.png',
    alt: 'Coconut Water Powder + Minerals',
    name: 'Coconut Water Powder + Minerals',
    tag: 'Coconut water powder + minerals',
  },
  {
    src: '/images/private-label-packing/ashwagandha-extract.png',
    alt: 'Organic Potent Ashwagandha Adaptogen',
    name: 'Organic Potent Ashwagandha Adaptogen (Min. 3% Withanolides)',
    tag: 'KSM-66® available',
  },
  {
    src: '/images/private-label-packing/beetroot-latte.png',
    alt: 'Organic Beetroot Latte Blend',
    name: 'Organic Beetroot Latte Blend with Cinnamon and Vanilla',
    tag: '',
  },
  {
    src: '/images/private-label-packing/ginger-lemon-shot.png',
    alt: 'Organic Ginger & Lemon Instant Shot Powder',
    name: 'Organic Ginger & Lemon Instant Shot Powder + Cayenne',
    tag: 'Instant wellness shot',
  },
  {
    src: '/images/custom-tea-blends/calm-tea-passionflower.png',
    alt: 'Calm Tea',
    name: 'Calm Tea',
    tag: 'With passionflower, lavender and chamomile',
  },
]
