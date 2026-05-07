export type ImageAsset = {
  src: string
  alt: string
  width: number
  height: number
}

export type ProofPoint = {
  icon: ImageAsset
  title: string
  description: string
}

export type ImageCard = {
  title: string
  href: string
  image: ImageAsset
  action: string
  badge?: ImageAsset
}

export type Testimonial = {
  logo: ImageAsset
  name: string
  role: string
  quote: string
}

export type JournalArticle = {
  image: ImageAsset
  date: string
  title: string
  excerpt: string
  href: string
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

const SHOPIFY_FILE_BASE = 'https://cdn.shopify.com/s/files/1/0786/8339/files'
const SHOPIFY_ARTICLE_BASE =
  'https://cdn.shopify.com/s/files/1/0786/8339/articles'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://teavision.com.au'

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Teavision',
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.ico`,
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
  url: BASE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

export const PROOF_POINTS = [
  {
    icon: {
      src: `${SHOPIFY_FILE_BASE}/Australian_Flag.svg?v=1760002446&width=80`,
      alt: '',
      width: 80,
      height: 80,
    },
    title: 'Australian',
    description: 'Owned & Operated',
  },
  {
    icon: {
      src: `${SHOPIFY_FILE_BASE}/Truck.svg?v=1760002333&width=80`,
      alt: '',
      width: 80,
      height: 80,
    },
    title: '#1',
    description: 'Tea and Herb Wholesale Supplier',
  },
  {
    icon: {
      src: `${SHOPIFY_FILE_BASE}/Flask.svg?v=1760002405&width=80`,
      alt: '',
      width: 80,
      height: 80,
    },
    title: '1,000+',
    description: 'Ingredient options including 500+ Certified Organic',
  },
  {
    icon: {
      src: `${SHOPIFY_FILE_BASE}/Medal.svg?v=1760002426&width=80`,
      alt: '',
      width: 80,
      height: 80,
    },
    title: '15+',
    description: 'Awards',
  },
] satisfies ProofPoint[]

export const PRODUCT_RANGE = [
  {
    title: 'Wholesale Bulk Tea',
    href: '/collections/wholesale-bulk-tea',
    image: {
      src: `${SHOPIFY_FILE_BASE}/bulk_wholesale.jpg?v=1776400758&width=800`,
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
      src: `${SHOPIFY_FILE_BASE}/herbs_and_spices_1c9b15ca-6833-460f-817a-32013fd18e41.jpg?v=1776400817&width=800`,
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
      src: `${SHOPIFY_FILE_BASE}/speciality_blends.jpg?v=1776400871&width=800`,
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
      src: `${SHOPIFY_FILE_BASE}/functional_wellness.jpg?v=1776400996&width=800`,
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
      src: `${SHOPIFY_FILE_BASE}/cafe_range.jpg?v=1776400996&width=800`,
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
      src: `${SHOPIFY_FILE_BASE}/australian_native.jpg?v=1776400996&width=800`,
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
      src: `${SHOPIFY_FILE_BASE}/bulk_tea_bags.jpg?v=1776400996&width=800`,
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
      src: `${SHOPIFY_FILE_BASE}/organic_range.jpg?v=1776401243&width=800`,
      alt: 'Organic tea collection',
      width: 800,
      height: 533,
    },
    action: 'Shop Now',
    badge: {
      src: `${SHOPIFY_FILE_BASE}/australian-organic.webp?v=1760701558&width=200`,
      alt: 'Australian organic certification',
      width: 200,
      height: 200,
    },
  },
  {
    title: 'Cocktail & Iced Tea Collection',
    href: '/collections/dessert-cocktail-inspired-blends',
    image: {
      src: `${SHOPIFY_FILE_BASE}/iced_tea.jpg?v=1776400996&width=800`,
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
      src: `${SHOPIFY_FILE_BASE}/photo-1597884324477-ca524e6e882e.jpg?v=1776399378&width=800`,
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
      src: `${SHOPIFY_FILE_BASE}/photo-1732901379182-46b0cbc13b15.jpg?v=1776399462&width=800`,
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
      src: `${SHOPIFY_FILE_BASE}/tea_blending_aff55624-3ee5-41da-ae02-235d3dcc917c.jpg?v=1776403654&width=800`,
      alt: 'Custom tea blending',
      width: 800,
      height: 1200,
    },
    action: 'Explore',
  },
  {
    title: 'Tea Bag Manufacturing',
    href: '/collections/tea-bag-manufacturer',
    image: {
      src: `${SHOPIFY_FILE_BASE}/Tea_bag_manufacturing_machine_close-up.png?v=1776404052&width=800`,
      alt: 'Tea bag manufacturing machine',
      width: 800,
      height: 1200,
    },
    action: 'Explore',
  },
  {
    title: 'Private Label',
    href: '/pages/private-label-packing',
    image: {
      src: `${SHOPIFY_FILE_BASE}/plabel2.jpg?v=1776404355&width=800`,
      alt: 'Private label tea packaging',
      width: 800,
      height: 533,
    },
    action: 'Explore',
  },
] satisfies ImageCard[]

export const HERBS_IMAGE = {
  src: `${SHOPIFY_FILE_BASE}/c5a075ef4595339b60bb1672bb1d67e168a564a5.png?v=1757589972&width=1500`,
  alt: 'Organic herbs and spices',
  width: 1500,
  height: 1000,
} satisfies ImageAsset

export const HOMEPAGE_HERO_IMAGE = {
  src: `${SHOPIFY_FILE_BASE}/bulk_wholesale.jpg?v=1776400758&width=1600`,
  alt: 'Wholesale loose leaf tea and botanicals prepared for bulk supply',
  width: 1600,
  height: 1068,
} satisfies ImageAsset

export const ORGANIC_CERTIFICATION_IMAGE = {
  src: `${SHOPIFY_FILE_BASE}/australian-organic.webp?v=1760701558&width=200`,
  alt: 'Australian Certified Organic mark',
  width: 200,
  height: 200,
} satisfies ImageAsset

export const NEWSLETTER_LEFT_IMAGE = {
  src: `${SHOPIFY_FILE_BASE}/Frame_1000005882.png?v=1758816679&width=250`,
  alt: '',
  width: 250,
  height: 250,
} satisfies ImageAsset

export const NEWSLETTER_RIGHT_IMAGE = {
  src: `${SHOPIFY_FILE_BASE}/label.png?v=1758816715&width=250`,
  alt: '',
  width: 250,
  height: 250,
} satisfies ImageAsset

export const EXPERTS_LEFT_IMAGE = {
  src: `${SHOPIFY_FILE_BASE}/Group_1000005879_4d4f59df-0596-49a5-b6f6-6d99fe567e3e.png?v=1758533086&width=250`,
  alt: '',
  width: 250,
  height: 250,
} satisfies ImageAsset

export const EXPERTS_RIGHT_IMAGE = {
  src: `${SHOPIFY_FILE_BASE}/Group_1000005865_ce5f113f-ca0c-485b-a89d-bfece6b4fb1d.png?v=1758533036&width=250`,
  alt: '',
  width: 250,
  height: 250,
} satisfies ImageAsset

export const CATALOGUE_IMAGE = {
  src: `${SHOPIFY_FILE_BASE}/3.png?v=1757328068&width=600`,
  alt: 'Teavision catalogues',
  width: 600,
  height: 400,
} satisfies ImageAsset

export const SUPPLY_CHAIN_IMAGES = [
  {
    src: `${SHOPIFY_FILE_BASE}/Group_39481.png?v=1758534766&width=400`,
    alt: 'Supply chain quality mark',
    width: 400,
    height: 258,
  },
  {
    src: `${SHOPIFY_FILE_BASE}/Group_288.png?v=1758534491&width=400`,
    alt: 'Supply chain quality mark',
    width: 400,
    height: 259,
  },
  {
    src: `${SHOPIFY_FILE_BASE}/Group_289_25b41dd4-5382-4951-9de5-e212c2f9832f.png?v=1758534710&width=400`,
    alt: 'Supply chain quality mark',
    width: 400,
    height: 258,
  },
  {
    src: `${SHOPIFY_FILE_BASE}/Group_290_7dbc3c9c-245b-45c9-aaef-85151b2be561.png?v=1758534616&width=400`,
    alt: 'Supply chain quality mark',
    width: 400,
    height: 258,
  },
  {
    src: `${SHOPIFY_FILE_BASE}/Group_60_dbe0534f-6bee-4cba-8731-39ec49e605f9.png?v=1758534880&width=400`,
    alt: 'Supply chain quality mark',
    width: 400,
    height: 258,
  },
  {
    src: `${SHOPIFY_FILE_BASE}/australian_organic_matched_size_borderless.png?v=1760590976&width=400`,
    alt: 'Australian organic certification mark',
    width: 400,
    height: 258,
  },
  {
    src: `${SHOPIFY_FILE_BASE}/Group_293_13de32ff-b1e8-4307-92b6-267425fb79c5.png?v=1758534817&width=400`,
    alt: 'Supply chain quality mark',
    width: 400,
    height: 258,
  },
] satisfies ImageAsset[]

export const TESTIMONIALS = [
  {
    logo: {
      src: `${SHOPIFY_FILE_BASE}/Mood_Logo_1.png?crop=center&height=400&v=1760347291&width=325`,
      alt: 'MOOD Tea logo',
      width: 325,
      height: 400,
    },
    name: 'Ashley McGrath',
    role: 'GM Social Enterprise',
    quote:
      "Teavision has been an exceptional partner to MOOD Tea from day one. Their team consistently delivers outstanding service and support, always responsive, proactive, and genuinely invested in our success. As a purpose-led brand, it’s crucial we work with suppliers who share our values and commitment to quality, and Teavision has never let us down.Their reliable supply and streamlined process have saved us both time and cost, allowing us to focus on growing our impact. Thanks to their support, we've been able to channel more resources into our social mission, supporting youth mental health programs.We truly see Teavision not just as a supplier, but as a contributor to the positive impact we’re creating. We’re grateful for their partnership.",
  },
  {
    logo: {
      src: `${SHOPIFY_FILE_BASE}/Ali_Logo_1.png?crop=center&height=400&v=1760347120&width=325`,
      alt: 'St. Ali logo',
      width: 325,
      height: 400,
    },
    name: 'St. Ali',
    role: 'Lucy Ward',
    quote:
      'Tea Vision has been an outstanding supplier and trusted partner in bringing our products to life. Over our long-standing relationship across multiple product lines, they have consistently delivered excellent service and reliable, prompt shipments. Their professionalism, attention to detail, and responsiveness have made our collaboration seamless and productive. We highly recommend Tea Vision to any business seeking a dependable supplier who truly understands the value of partnership.',
  },
  {
    logo: {
      src: `${SHOPIFY_FILE_BASE}/Buy_Organics_Logo_1.png?crop=center&height=400&v=1760347231&width=325`,
      alt: 'Buy Organics Online logo',
      width: 325,
      height: 400,
    },
    name: 'Buy Organics Online',
    role: 'Owner',
    quote:
      'We’ve been working with Teavision since early 2025, and their support has been invaluable in navigating the complexities of sourcing quality products. Having them close by gives us confidence, reduces risk, and opens the door to their extensive network for new product opportunities.Their professionalism and commitment make the process seamless and worry-free.I highly recommend their services — Lucas, in particular, has been fantastic to work with.',
  },
  {
    logo: {
      src: `${SHOPIFY_FILE_BASE}/remedy-logo.png?crop=center&height=400&v=1760700368&width=325`,
      alt: 'Remedy Drinks logo',
      width: 325,
      height: 400,
    },
    name: 'Julia Blair',
    role: 'Global Head of Manufacturing',
    quote:
      'Brewing Better Together with Teavision As Australia’s leading “better-for-you” beverage manufacturer, here at Remedy Drinks we consider quality, consistency, and trusted partnerships to be at the heart of everything we do.Our long-standing relationship with Teavision has been vital in supporting our growth and upholding the high standards our consumers expect. Teavision reliably provides us with high-quality ingredients which are key to our product range. Their exceptional service and support is always responsive, proactive, and collaborative, making them a true partner in our success. Thanks to their efficient sourcing strategies and deep understanding of our supply chain, we’ve achieved significant cost savings without compromising quality.Their consistent, on-time, and in-full deliveries ensure uninterrupted production and guarantee our amazing drinks reach consumers exactly as intended. Teavision has made a powerful and positive impact on Remedy Drinks, helping us scale sustainably, control costs, and strengthen our supply chain.We value this partnership and look forward to many more years of successful collaboration.',
  },
] satisfies Testimonial[]

export const JOURNAL_ARTICLES = [
  {
    image: {
      src: `${SHOPIFY_ARTICLE_BASE}/woman_mixing_tea_ingredients.jpg?v=1776324634&width=440`,
      alt: 'Woman mixing tea ingredients',
      width: 440,
      height: 293,
    },
    date: 'April 30, 2026',
    title:
      'How Cafés and Restaurants can Create Signature Blends Using Bulk Spices',
    excerpt:
      'The right combination of spices can transform any meal into an unforgettable experience, and a carefully crafted spice blend unique to your cafe or...',
    href: '/blogs/teavision-blogs/how-cafes-and-restaurants-can-create-signature-blends-using-bulk-spices',
  },
  {
    image: {
      src: `${SHOPIFY_ARTICLE_BASE}/piles_of_spice.jpg?v=1776324548&width=440`,
      alt: 'Piles of spice',
      width: 440,
      height: 293,
    },
    date: 'April 30, 2026',
    title:
      'Why Buying Spices in Bulk Helps Reduce Waste and Boost Profit Margins',
    excerpt:
      'Waste reduction and managing expenses are always at the forefront of any food business, just as much as maintaining quality. From restaurants to sp...',
    href: '/blogs/teavision-blogs/why-buying-spices-in-bulk-helps-reduce-waste-and-boost-profit-margins',
  },
  {
    image: {
      src: `${SHOPIFY_ARTICLE_BASE}/spices_and_herbs_in_bowls.jpg?v=1776324467&width=440`,
      alt: 'Spices and herbs in bowls',
      width: 440,
      height: 293,
    },
    date: 'April 23, 2026',
    title: 'Wholesale Herbs and Spices: The Secret to Consistent Menu Flavour',
    excerpt:
      'In the competitive world of restaurants, consistency in your quality is key and diners expect their favourite dish to taste just as delicious every...',
    href: '/blogs/teavision-blogs/wholesale-herbs-and-spices-the-secret-to-consistent-menu-flavour',
  },
  {
    image: {
      src: `${SHOPIFY_ARTICLE_BASE}/assortment_of_spices.jpg?v=1776324360&width=440`,
      alt: 'Assortment of spices',
      width: 440,
      height: 293,
    },
    date: 'April 23, 2026',
    title: 'How to Streamline Ingredient Costs with Bulk Spice Purchasing',
    excerpt:
      'For cafés, restaurants and food businesses, maintaining ingredient costs can be a challenge. Spices may seem like a small element of the budget, bu...',
    href: '/blogs/teavision-blogs/how-to-streamline-ingredient-costs-with-bulk-spice-purchasing',
  },
  {
    image: {
      src: `${SHOPIFY_ARTICLE_BASE}/bottled_spices_in_jars_on_shelf.jpg?v=1776324381&width=440`,
      alt: 'Bottled spices in jars on shelf',
      width: 440,
      height: 294,
    },
    date: 'April 16, 2026',
    title: 'Essential Spices Every Café and Restaurant Should Keep in Stock',
    excerpt:
      'Running a café or restaurant isn’t just about great customer service and quality ingredients, it’s also about flavour and taste, and working with t...',
    href: '/blogs/teavision-blogs/essential-spices-every-cafe-and-restaurant-should-keep-in-stock',
  },
  {
    image: {
      src: `${SHOPIFY_ARTICLE_BASE}/large_piles_of_spice_d7fdd254-e77d-4c21-b542-f5d46dc7b393.jpg?v=1776323431&width=440`,
      alt: 'Large piles of spice',
      width: 440,
      height: 293,
    },
    date: 'April 16, 2026',
    title:
      'Understanding Spice Grades and Quality Standards for Wholesale Buyers',
    excerpt:
      'For wholesale buyers of spices in Australia, sourcing high-quality products from an experienced tea company is about a lot more than simply finding...',
    href: '/blogs/teavision-blogs/understanding-spice-grades-and-quality-standards-for-wholesale-buyers',
  },
] satisfies JournalArticle[]

export const FAQS = [
  {
    question: 'What types of tea do you offer?',
    answer:
      "We offer a huge range of tradition and premium teas and botanical herbs along with custom tea blends. Reach out to our sales team if you're interested in developing your own blend.",
  },
  {
    question: 'What are the terms for wholesale purchases?',
    answer:
      'We are pleased to offer wholesale pricing direct on our website or if your volumes are larger than 100kg you can apply for a bulk wholesale account and receive further discounts. Please contact our sales team for further information or apply for a bulk wholesale account.',
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

export const CERTIFICATION_COVERAGE = [
  {
    eyebrow: 'Organic',
    title: 'Certified organic supply',
    description:
      'ACO organic ingredients and documentation for buyers building compliant retail or wholesale ranges.',
    details: [
      'Certified organic options across tea, herbs, and botanicals',
      'Supplier documentation for account and procurement teams',
      'Range guidance for bulk and private label programs',
    ],
  },
  {
    eyebrow: 'Safety',
    title: 'Food safety systems',
    description:
      'Quality controls support repeatable purchasing, production planning, and scaled fulfilment.',
    details: [
      'Batch consistency checks before dispatch',
      'Process controls for tea bag and packing services',
      'Clear escalation path through the sales team',
    ],
  },
  {
    eyebrow: 'Sourcing',
    title: 'Traceable global network',
    description:
      'A broad sourcing base gives wholesale teams range depth without losing ingredient accountability.',
    details: [
      'Ingredients sourced from more than 15 countries',
      'Origin and category guidance for wholesale buyers',
      'Freight and import handling across supply journeys',
    ],
  },
  {
    eyebrow: 'Scale',
    title: 'Wholesale programs',
    description:
      'Account support covers custom blends, private label, cafe ranges, and 100kg+ purchasing paths.',
    details: [
      'Bulk account application for larger volumes',
      'Custom blend and private label support',
      'Catalogue-led discovery for procurement reviews',
    ],
  },
] satisfies CertificationCard[]
