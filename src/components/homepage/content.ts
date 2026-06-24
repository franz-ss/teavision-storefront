import { SITE_URL } from '@/lib/seo/site-url'

import type { CtaProps } from './catalogues'

export type ImageAsset = {
  src: string
  alt: string
  width: number
  height: number
}

export type ProofPoint = {
  icon?: string
  image?: ImageAsset
  title: string
  description: string
}

export type HomepageHeroContent = {
  title: string
  copy: string
  cta: {
    children: string
    href: string
  }
  image: ImageAsset
  trustMarks: ImageAsset
}

export type ImageCard = {
  title: string
  href: string
  image: ImageAsset
  action: string
  badge?: ImageAsset
  body?: string
}

export type Testimonial = {
  logo: ImageAsset
  name: string
  role: string
  brand?: string
  quote: string
}

export type FaqItem = {
  question: string
  answer: string
}

export type CertificationCard = {
  eyebrow: string
  title: string
  description: string
  details: string[]
}

export const ctaCatalogueData: CtaProps = {
  tone: 'brand',
  intro: {
    variant: 'compact',
    eyebrow: 'Wholesale catalogues',
    title: 'Explore Tea and Herb Catalogues',
    copy: 'Browse our catalogues to explore hundreds of options in black tea, green tea, herbal blends, and bulk spices. Each listing includes quality details to guide your wholesale orders.',
  },
  cta: {
    children: 'Download Catalogue',
    href: '/pages/download-catalogues',
    variant: 'inverseSecondary',
    size: 'cta',
  },
}

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Teavision',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '1300-729-617',
    contactType: 'sales',
    areaServed: 'AU',
  },
}

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Teavision',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

export const HOMEPAGE_HERO = {
  title: "Australia's #1 tea company",
  copy: "Discover a world of tea mastery in every cup. Handpicked from the finest leaves, our loose leaf teas, bulk tea bags, and organic herbs deliver rich flavor and freshness. Trusted by Australia's leading cafes, retailers, and wellness brands.",
  cta: {
    children: 'Explore Our Teas',
    href: '/collections',
  },
  image: {
    src: '/images/homepage/homepage-hero-tea-harvest-lcp.avif',
    alt: '',
    width: 1440,
    height: 810,
  },
  trustMarks: {
    src: '/images/homepage/homepage-trust-marks.webp',
    alt: 'Teavision certification and trust marks',
    width: 1126,
    height: 226,
  },
} satisfies HomepageHeroContent

export const HOMEPAGE_PROOF_POINTS = [
  {
    image: {
      src: '/images/australian-flag.svg',
      alt: '',
      width: 1280,
      height: 640,
    },
    title: 'Australian',
    description: 'Owned & Operated',
  },
  {
    icon: 'Truck',
    title: '#1',
    description: 'Tea and Herb Wholesale Supplier',
  },
  {
    icon: 'FlaskConical',
    title: '1,000+',
    description: 'Ingredient options including 500+ Certified Organic',
  },
  {
    icon: 'Medal',
    title: '15+',
    description: 'Awards',
  },
] satisfies ProofPoint[]

export const PROOF_POINTS = [
  {
    icon: 'Users',
    title: '2,500+',
    description: 'Satisfied Customers',
  },
  {
    icon: 'Award',
    title: '#1',
    description: 'Rated and Most Trusted',
  },
  {
    icon: 'Globe',
    title: '40+',
    description: 'Countries Worldwide',
  },
  {
    icon: 'CheckCircle',
    title: '100%',
    description: 'Quality Satisfaction',
  },
] satisfies ProofPoint[]

export const PRODUCT_RANGE = [
  {
    title: 'Wholesale Bulk Tea',
    href: '/collections/wholesale-bulk-tea',
    image: {
      src: '/images/homepage/bulk-wholesale.jpg',
      alt: 'Wholesale bulk loose leaf tea',
      width: 800,
      height: 534,
    },
    action: 'Shop Now',
  },
  {
    title: 'Herbs, Spices & Botanicals',
    href: '/collections/herbs-and-spices',
    image: {
      src: '/images/homepage/herbs-and-spices-1c9b15ca-6833-460f-817a-32013fd18e41.jpg',
      alt: 'Bulk herbs, spices, and botanicals',
      width: 800,
      height: 533,
    },
    action: 'Shop Now',
  },
  {
    title: 'Speciality Blends',
    href: '/collections/speciality-tea',
    image: {
      src: '/images/homepage/speciality-blends.jpg',
      alt: 'Speciality tea blends',
      width: 800,
      height: 1200,
    },
    action: 'Shop Now',
  },
  {
    title: 'Functional Wellness Tea',
    href: '/collections/wellness-functional-tea',
    image: {
      src: '/images/homepage/functional-wellness.jpg',
      alt: 'Functional wellness tea ingredients',
      width: 800,
      height: 571,
    },
    action: 'Shop Now',
  },
  {
    title: 'Cafe Range',
    href: '/collections/cafe-range',
    image: {
      src: '/images/homepage/cafe-range.jpg',
      alt: 'Cafe range teas',
      width: 800,
      height: 1000,
    },
    action: 'Shop Now',
  },
  {
    title: 'Australian Native Tea',
    href: '/collections/australian-native-ingredients',
    image: {
      src: '/images/homepage/australian-native.jpg',
      alt: 'Australian native tea ingredients',
      width: 800,
      height: 450,
    },
    action: 'Shop Now',
  },
  {
    title: 'Bulk Tea Bag Packs',
    href: '/collections/bulk-tea-bags',
    image: {
      src: '/images/homepage/bulk-tea-bags.jpg',
      alt: 'Bulk tea bag packs',
      width: 800,
      height: 533,
    },
    action: 'Shop Now',
  },
  {
    title: 'Organic Tea Collection',
    href: '/collections/australian-certified-organic-tea',
    image: {
      src: '/images/homepage/organic-range.jpg',
      alt: 'Organic tea collection',
      width: 800,
      height: 533,
    },
    action: 'Shop Now',
    badge: {
      src: '/images/homepage/australian-organic.webp',
      alt: 'Australian organic certification',
      width: 200,
      height: 200,
    },
  },
  {
    title: 'Cocktail & Iced Tea Collection',
    href: '/collections/dessert-cocktail-inspired-blends',
    image: {
      src: '/images/homepage/iced-tea.jpg',
      alt: 'Cocktail and iced tea collection',
      width: 800,
      height: 533,
    },
    action: 'Shop Now',
  },
  {
    title: 'Tea Masters Selection',
    href: '/collections/tea-masters-selection-worlds-best-teas',
    image: {
      src: '/images/homepage/tea-masters-selection.jpg',
      alt: 'Premium tea masters selection',
      width: 800,
      height: 533,
    },
    action: 'Shop Now',
  },
  {
    title: 'Superfood & Supplements',
    href: '/collections/superfood-extract-powders-proteins-supplements',
    image: {
      src: '/images/homepage/superfood-supplements.jpg',
      alt: 'Superfood powders and supplement ingredients',
      width: 800,
      height: 533,
    },
    action: 'Shop Now',
  },
] satisfies ImageCard[]

export const SERVICE_CARDS = [
  {
    title: 'Custom Tea Blends',
    href: '/pages/custom-tea-blends',
    image: {
      src: '/images/homepage/tea-blending-aff55624-3ee5-41da-ae02-235d3dcc917c.jpg',
      alt: 'Custom tea blending',
      width: 800,
      height: 1200,
    },
    action: 'Explore',
    body: 'Work with our expert blenders to develop signature tea blends tailored to your brand identity and customer preferences.',
  },
  {
    title: 'Tea Bag Manufacturing',
    href: '/collections/tea-bag-manufacturer',
    image: {
      src: '/images/homepage/tea-bag-manufacturing-machine.png',
      alt: 'Tea bag manufacturing machine',
      width: 800,
      height: 1200,
    },
    action: 'Explore',
    body: 'From 20kg minimum orders, we manufacture pyramid, flat, and round tea bags with full packaging options to suit your volume.',
  },
  {
    title: 'Private Label',
    href: '/pages/private-label-packing',
    image: {
      src: '/images/homepage/private-label-packaging.jpg',
      alt: 'Private label tea packaging',
      width: 800,
      height: 533,
    },
    action: 'Explore',
    body: 'Launch your own branded tea range with our end-to-end private label service — from blend development through to shelf-ready packaging.',
  },
] satisfies ImageCard[]

export const HERBS_IMAGE = {
  src: '/images/homepage/organic-herbs-and-spices.png',
  alt: 'Organic herbs and spices',
  width: 1500,
  height: 1000,
} satisfies ImageAsset

export const CATALOGUE_IMAGE = {
  src: '/images/navigation/teavision-catalogues.png',
  alt: 'Teavision catalogues',
  width: 600,
  height: 400,
} satisfies ImageAsset

export const SUPPLY_CHAIN_IMAGES = [
  {
    src: '/images/supply-chain/supply-chain-mark-1.png',
    alt: 'Supply chain quality mark',
    width: 400,
    height: 258,
  },
  {
    src: '/images/supply-chain/supply-chain-mark-2.png',
    alt: 'Supply chain quality mark',
    width: 400,
    height: 259,
  },
  {
    src: '/images/supply-chain/supply-chain-mark-3.png',
    alt: 'Supply chain quality mark',
    width: 400,
    height: 258,
  },
  {
    src: '/images/supply-chain/supply-chain-mark-4.png',
    alt: 'Supply chain quality mark',
    width: 400,
    height: 258,
  },
  {
    src: '/images/supply-chain/supply-chain-mark-5.png',
    alt: 'Supply chain quality mark',
    width: 400,
    height: 258,
  },
  {
    src: '/images/supply-chain/supply-chain-australian-organic-mark.png',
    alt: 'Australian organic certification mark',
    width: 400,
    height: 258,
  },
  {
    src: '/images/supply-chain/supply-chain-mark-7.png',
    alt: 'Supply chain quality mark',
    width: 400,
    height: 258,
  },
] satisfies ImageAsset[]

export const TESTIMONIALS = [
  {
    logo: {
      src: '/images/testimonials/mood-tea-logo.png',
      alt: 'MOOD Tea logo',
      width: 325,
      height: 400,
    },
    name: 'Ashley McGrath',
    role: 'GM Social Enterprise',
    brand: 'MOOD Tea',
    quote:
      "Teavision has been an exceptional partner to MOOD Tea from day one. Their team consistently delivers outstanding service and support, always responsive, proactive, and genuinely invested in our success. As a purpose-led brand, it's crucial we work with suppliers who share our values and commitment to quality, and Teavision has never let us down. Their reliable supply and streamlined process have saved us both time and cost, allowing us to focus on growing our impact. Thanks to their support, we've been able to channel more resources into our social mission, supporting youth mental health programs. We truly see Teavision not just as a supplier, but as a contributor to the positive impact we're creating. We're grateful for their partnership.",
  },
  {
    logo: {
      src: '/images/testimonials/st-ali-logo.png',
      alt: 'St. Ali logo',
      width: 325,
      height: 400,
    },
    name: 'Lucy Ward',
    role: '',
    brand: 'St. Ali',
    quote:
      'Tea Vision has been an outstanding supplier and trusted partner in bringing our products to life. Over our long-standing relationship across multiple product lines, they have consistently delivered excellent service and reliable, prompt shipments. Their professionalism, attention to detail, and responsiveness have made our collaboration seamless and productive. We highly recommend Tea Vision to any business seeking a dependable supplier who truly understands the value of partnership.',
  },
  {
    logo: {
      src: '/images/testimonials/buy-organics-online-logo.png',
      alt: 'Buy Organics Online logo',
      width: 325,
      height: 400,
    },
    name: 'Owner',
    role: '',
    brand: 'Buy Organics Online',
    quote:
      "We've been working with Teavision since early 2025, and their support has been invaluable in navigating the complexities of sourcing quality products. Having them close by gives us confidence, reduces risk, and opens the door to their extensive network for new product opportunities. Their professionalism and commitment make the process seamless and worry-free. I highly recommend their services — Lucas, in particular, has been fantastic to work with.",
  },
  {
    logo: {
      src: '/images/testimonials/remedy-drinks-logo.png',
      alt: 'Remedy Drinks logo',
      width: 325,
      height: 400,
    },
    name: 'Julia Blair',
    role: 'Global Head of Manufacturing',
    brand: 'Remedy Drinks',
    quote:
      "Brewing Better Together with Teavision. As Australia's leading “better-for-you” beverage manufacturer, here at Remedy Drinks we consider quality, consistency, and trusted partnerships to be at the heart of everything we do. Our long-standing relationship with Teavision has been vital in supporting our growth and upholding the high standards our consumers expect. Teavision reliably provides us with high-quality ingredients which are key to our product range. Their exceptional service and support is always responsive, proactive, and collaborative, making them a true partner in our success. Thanks to their efficient sourcing strategies and deep understanding of our supply chain, we've achieved significant cost savings without compromising quality. Their consistent, on-time, and in-full deliveries ensure uninterrupted production and guarantee our amazing drinks reach consumers exactly as intended. Teavision has made a powerful and positive impact on Remedy Drinks, helping us scale sustainably, control costs, and strengthen our supply chain. We value this partnership and look forward to many more years of successful collaboration.",
  },
] satisfies Testimonial[]

export const FAQS = [
  {
    question: 'What types of tea do you offer?',
    answer:
      "We offer a huge range of traditional and premium teas and botanical herbs along with custom tea blends. Reach out to our sales team if you're interested in developing your own blend.",
  },
  {
    question: 'What are the terms for wholesale purchases?',
    answer:
      'We are pleased to offer wholesale pricing direct on our website, with volume discounts available across eligible bulk quantities. Please contact our sales team if you need guidance on large repeat orders.',
  },
  {
    question: 'How do I place an order for retail purchases?',
    answer:
      'You can place retail orders directly through our website by adding products to your cart and proceeding to checkout. We accept all major credit cards and PayPal.',
  },
  {
    question: 'Do you provide custom tea blending services?',
    answer:
      "Yes, we offer custom tea blending services for both retail and wholesale customers. Contact our team to discuss your specific requirements and we'll create a unique blend just for you.",
  },
] satisfies FaqItem[]

export const CERTIFICATION_COVERAGE: CertificationCard[] = [
  {
    eyebrow: 'USDA NOP, EU & ACO Certified',
    title: 'Certified organic supply',
    description:
      'Our organic certification ensures all organic products meet strict international standards from farm to cup across multiple regulatory frameworks.',
    details: [
      'USDA NOP (National Organic Program)',
      'EU Organic Regulation compliance',
      'ACO (Australian Certified Organic)',
      'Full supply chain traceability',
    ],
  },
  {
    eyebrow: 'Food Safety Management',
    title: 'HACCP Certification',
    description:
      'Hazard Analysis Critical Control Points system ensuring food safety at every production stage.',
    details: [
      'Comprehensive hazard analysis',
      'Critical control point monitoring',
      'Documented processes',
      'Staff training programs',
    ],
  },
  {
    eyebrow: 'Kosher Australia',
    title: 'Kosher Certification',
    description:
      'Products certified to meet strict kosher dietary requirements and standards.',
    details: [
      'Rabbinical supervision',
      'Ingredient verification',
      'Production oversight',
      'Dedicated certification',
    ],
  },
  {
    eyebrow: 'Halal Certified',
    title: 'Halal Certification',
    description:
      'Certification ensuring products meet Islamic dietary laws and requirements.',
    details: [
      'Islamic dietary compliance',
      'Ingredient screening',
      'Process verification',
      'Regular auditing',
    ],
  },
]
