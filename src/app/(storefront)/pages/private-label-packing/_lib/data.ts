const SHOPIFY_CDN_BASE = 'https://www.teavision.com.au/cdn/shop/files'
const SHOPIFY_FILE_BASE = 'https://cdn.shopify.com/s/files/1/0786/8339/files'

// Section 1 — Hero images
export const HERO_IMAGE_SRC = `${SHOPIFY_CDN_BASE}/hero-image_1600x.webp?v=1756890900`
export const HERO_GRID_IMAGE_1_SRC = `${SHOPIFY_FILE_BASE}/tea_in_jars.webp?v=1760833507`
export const HERO_GRID_IMAGE_2_SRC = `${SHOPIFY_FILE_BASE}/Mushroom_lions_mane_pouche_image.png?v=1760833968`
export const HERO_GRID_IMAGE_3_SRC = `${SHOPIFY_CDN_BASE}/tea-varieties_59760a77-ee2e-4095-b2d7-51542865eabd_600x.webp?v=1757040802`

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
export const YOUR_BRAND_IMAGE_SRC = `${SHOPIFY_FILE_BASE}/tea_cartons_and_boxes_image.png?v=1760835585`

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
    src: `${SHOPIFY_FILE_BASE}/wellness_tea_blend.png?v=1760834495`,
    alt: 'Wellness & Specialty Teas',
    title: 'Wellness & Specialty Teas',
    tag: 'Detox • Slim • Immunity • Sleep • Gut Health • Anti-Bloat • Probiotic Support • Hormone Balance • Stress & Focus',
  },
  {
    src: `${SHOPIFY_FILE_BASE}/tea_in_jars.webp?v=1760833507`,
    alt: 'Herbal Blends',
    title: 'Herbal Blends',
    tag: "Digestive • Relax • Men's & Women's Health • Detox Cleanse • Calm & Sleep Support • Liver & Gut Repair • Hormone Balance • Immune Boost • Vitality Tonic",
  },
  {
    src: `${SHOPIFY_FILE_BASE}/Chai_Spice_Tin.png?v=1760834712`,
    alt: 'Chai & Spice',
    title: 'Chai & Spice',
    tag: 'Sticky Chai • Turmeric • Masala • Dirty Chai • Cardamom Vanilla • Cacao Chai • Decaf Spiced',
  },
  {
    src: `${SHOPIFY_FILE_BASE}/Ashwagandha-600x450-1.webp?v=1760834308`,
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
    src: `${SHOPIFY_FILE_BASE}/Pouches_packaging_options.png?v=1760835068`,
    alt: 'Pouches',
    title: 'Stand-up Pouches',
    tag: 'Matte/gloss • Zip • Valve',
  },
  {
    src: `${SHOPIFY_FILE_BASE}/tea_tins_packaging.png?v=1760835281`,
    alt: 'Tins & Canisters',
    title: 'Tins & Canisters',
    tag: 'Double-lid • Emboss/deboss',
  },
  {
    src: `${SHOPIFY_FILE_BASE}/pexels-oscar-sanchez197-19288835.jpg?v=1760833497`,
    alt: 'Glass Jars',
    title: 'Glass Jars',
    tag: 'Amber/clear • Metal cap',
  },
  {
    src: `${SHOPIFY_FILE_BASE}/tea_cartons_and_boxes_image.png?v=1760835585`,
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
    src: `${SHOPIFY_FILE_BASE}/matcha_powder.png?v=1760848523`,
    alt: 'Organic Ceremonial Matcha',
    name: 'Organic Ceremonial Matcha',
    tag: 'Ceremonial',
  },
  {
    src: `${SHOPIFY_FILE_BASE}/turmeric_latte.png?v=1760848500`,
    alt: 'Golden Milk Turmeric',
    name: 'Golden Milk Turmeric',
    tag: 'Curcumin + ginger + pepper',
  },
  {
    src: `${SHOPIFY_FILE_BASE}/sleep_tea.png?v=1760848557`,
    alt: 'Sleep—Chamomile Lavender',
    name: 'Sleep—Chamomile Lavender',
    tag: 'With lemon balm',
  },
  {
    src: `${SHOPIFY_FILE_BASE}/yerba_mate_energy_tea.png?v=1760855415`,
    alt: 'Energy—Yerba Mate',
    name: 'Energy—Yerba Mate',
    tag: 'Guarana + L-theanine',
  },
  {
    src: `${SHOPIFY_FILE_BASE}/ginger_lemon_tea.png?v=1760848484`,
    alt: 'Detox Lemon Ginger',
    name: 'Detox Lemon Ginger',
    tag: 'Dandelion + milk thistle',
  },
  {
    src: `${SHOPIFY_FILE_BASE}/Collagen_Blend.png?v=1760851736`,
    alt: 'Collagen Beauty Elixir',
    name: 'Collagen Beauty Elixir',
    tag: 'Vitamin C + hyaluronic',
  },
  {
    src: `${SHOPIFY_FILE_BASE}/superblend_2.png?v=1760852078`,
    alt: 'Greens Vital Blend',
    name: 'Greens Vital Blend – 20+ Key Ingredients & Minerals for Optimal Health',
    tag: 'Spirulina + wheatgrass',
  },
  {
    src: `${SHOPIFY_FILE_BASE}/mushroom_complex.png?v=1760852431`,
    alt: 'Organic Mushroom Blends',
    name: 'High Quality Organic Mushroom Blends 20:1',
    tag: "Reishi + lion's mane",
  },
  {
    src: `${SHOPIFY_FILE_BASE}/hibiscus_iced_tea_image.png?v=1760852863`,
    alt: 'Hibiscus Iced Tea',
    name: 'Hibiscus Iced Tea',
    tag: 'Vitamin-rich summer hit',
  },
  {
    src: `${SHOPIFY_FILE_BASE}/chocolate_sleep_drink.png?v=1760854981`,
    alt: 'Night Time Chocolate Sleep Blend',
    name: 'Night Time Chocolate Sleep Blend + Magnesium',
    tag: 'Relaxation blend with cocoa & adaptogens',
  },
  {
    src: `${SHOPIFY_FILE_BASE}/Sticky_Chai_Latte.png?v=1760853324`,
    alt: 'Organic Chai Spice Blend',
    name: 'Organic Chai Spice Blend',
    tag: 'Sticky chai or dry spice',
  },
  {
    src: `${SHOPIFY_FILE_BASE}/l-theanine_powder_blend.png?v=1760855527`,
    alt: 'L-theanine Powder',
    name: 'L-theanine Powder',
    tag: 'Amino acid for focus & calm',
  },
  {
    src: `${SHOPIFY_FILE_BASE}/collagen_peptides_skin_glow.png?v=1760855124`,
    alt: 'Collagen Peptides (Bovine)',
    name: 'Collagen Peptides (Bovine)',
    tag: 'Hydrolysed protein for beauty & recovery',
  },
  {
    src: `${SHOPIFY_FILE_BASE}/blue_spirulina_powder.png?v=1760854766`,
    alt: 'Organic Blue Spirulina Antioxidant Blend',
    name: 'Organic Blue Spirulina Antioxidant Blend with Ginger, Blueberry & Acai',
    tag: 'Blue superfood blend',
  },
  {
    src: `${SHOPIFY_FILE_BASE}/ginger_powder.png?v=1760854846`,
    alt: 'Ginger Powder',
    name: 'Ginger Powder',
    tag: 'Pure powdered ginger root',
  },
  {
    src: `${SHOPIFY_FILE_BASE}/coconut_water_hydration.png?v=1760852769`,
    alt: 'Coconut Water Powder + Minerals',
    name: 'Coconut Water Powder + Minerals',
    tag: 'Coconut water powder + minerals',
  },
  {
    src: `${SHOPIFY_FILE_BASE}/Ashwagandha_Extract.png?v=1760852637`,
    alt: 'Organic Potent Ashwagandha Adaptogen',
    name: 'Organic Potent Ashwagandha Adaptogen (Min. 3% Withanolides)',
    tag: 'KSM-66® available',
  },
  {
    src: `${SHOPIFY_FILE_BASE}/beetroot_latte.png?v=1760853091`,
    alt: 'Organic Beetroot Latte Blend',
    name: 'Organic Beetroot Latte Blend with Cinnamon and Vanilla',
    tag: '',
  },
  {
    src: `${SHOPIFY_FILE_BASE}/ginger_lemon_shot.png?v=1760853577`,
    alt: 'Organic Ginger & Lemon Instant Shot Powder',
    name: 'Organic Ginger & Lemon Instant Shot Powder + Cayenne',
    tag: 'Instant wellness shot',
  },
  {
    src: `${SHOPIFY_FILE_BASE}/calm_tea_with_passionflower.png?v=1760853980`,
    alt: 'Calm Tea',
    name: 'Calm Tea',
    tag: 'With passionflower, lavender and chamomile',
  },
]
