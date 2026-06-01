export type ImageAsset = {
  alt: string
  height: number
  src: string
  width: number
}

export type FeatureCard = {
  description: string
  icon: 'leaf' | 'spark' | 'blend' | 'globe'
  title: string
}

export type StoryValue = {
  description: string
  id: string
  image: ImageAsset
  title: string
}

export type TextCard = {
  description: string
  title: string
}

export type ImageCard = TextCard & {
  image: ImageAsset
}

const SHOPIFY_FILE_BASE = 'https://cdn.shopify.com/s/files/1/0786/8339/files'

// Route-local static content intentionally mirrors the current Shopify page.
// Updates to this page are deploy-driven rather than CMS-revalidated.
export const HERO_IMAGE = {
  src: `${SHOPIFY_FILE_BASE}/Story_Image.webp?v=1764317869`,
  alt: '',
  width: 1440,
  height: 600,
} satisfies ImageAsset

export const FEATURE_CARDS = [
  {
    icon: 'leaf',
    title: 'Premium Sourcing',
    description:
      'We specialize in sourcing premium loose leaf teas, bulk tea bags, and certified organic herbs and spices directly from ethical farms worldwide. Our commitment to quality ensures every ingredient meets the highest standards for wholesale tea suppliers.',
  },
  {
    icon: 'spark',
    title: 'Quality Innovation',
    description:
      'As a multi-award-winning supplier, we deliver quality and innovation to cafes, retailers, and wellness brands. Our HACCP-certified food safety program guarantees consistent quality across our teas, herbs, and spices.',
  },
  {
    icon: 'blend',
    title: 'Diverse Product Range',
    description:
      'From bulk tea online orders to custom tea blends, we serve the diverse needs of our broad customer base. Our extensive range includes everything from traditional teas to specialty wellness blends for bulk tea suppliers across Australia.',
  },
  {
    icon: 'globe',
    title: 'Global Reach',
    description:
      'Today, Teavision serves over 2,000 global businesses across Australia and beyond. Our efficient distribution network ensures reliable delivery of wholesale tea bags and bulk herbs and spices to tea manufacturers worldwide.',
  },
] satisfies FeatureCard[]

export const STORY_VALUES = [
  {
    id: 'mindfulness',
    title: 'Mindfulness',
    description:
      "Teavision is committed to making tea more than just a drink — it's a way to inspire health, mindfulness, and connection. Our five core values guide everything we do as leading wholesale tea suppliers.",
    image: {
      src: `${SHOPIFY_FILE_BASE}/TeaVision-5-_1.webp?v=1764338109`,
      alt: 'Teavision tea ingredients prepared for blending',
      width: 4032,
      height: 3024,
    },
  },
  {
    id: 'sincerity',
    title: 'Sincerity',
    description:
      'At the heart of Teavision is a diverse, multi-cultural team united by a passion for natural ingredients and wellness. We create blends that balance tradition with modern taste through authentic relationships.',
    image: {
      src: `${SHOPIFY_FILE_BASE}/TeaVision-69_1-4-3-rectangle.webp?v=1764339152`,
      alt: 'Teavision team member working with loose-leaf tea',
      width: 4672,
      height: 3504,
    },
  },
  {
    id: 'wholesomeness',
    title: 'Wholesomeness',
    description:
      'We pride ourselves on building strong relationships with partners, ensuring that every stakeholder, from farmers to retailers, is part of our growing Teavision family committed to wholesome, natural products.',
    image: {
      src: `${SHOPIFY_FILE_BASE}/TeaVision-102.jpg?v=1764339356`,
      alt: 'Loose tea and botanicals arranged in a Teavision workspace',
      width: 3504,
      height: 2336,
    },
  },
  {
    id: 'inclusivity',
    title: 'Inclusivity',
    description:
      'With backgrounds spanning generations and global cultures, our team creates inclusive blends that welcome everyone to experience the diverse world of premium tea and wellness.',
    image: {
      src: `${SHOPIFY_FILE_BASE}/TeaVision-15.jpg?v=1764339342`,
      alt: 'Teavision production and blending team at work',
      width: 3408,
      height: 2272,
    },
  },
  {
    id: 'consciousness',
    title: 'Consciousness',
    description:
      'We are dedicated to ethical trade and sustainable sourcing, ensuring all products come from trusted global partners. Our consciousness extends to environmental responsibility and community impact.',
    image: {
      src: `${SHOPIFY_FILE_BASE}/Image_827f5ba0-83e7-4a14-bd51-f46eafa65826.png?v=1764663519`,
      alt: 'Tea leaves and botanicals representing sustainable sourcing',
      width: 1328,
      height: 680,
    },
  },
] satisfies StoryValue[]

export const TEAM_IMAGE = {
  src: `${SHOPIFY_FILE_BASE}/Team_Image.webp?v=1764342010`,
  alt: 'The Teavision team standing together',
  width: 2688,
  height: 1200,
} satisfies ImageAsset

export const TEAM_POINTS = [
  {
    title: 'Diverse Backgrounds',
    description:
      'With backgrounds spanning generations and global cultures, our team brings unique perspectives to every blend we create.',
  },
  {
    title: 'Global Perspective',
    description:
      "We create blends that balance tradition with modern taste, drawing from our team's multicultural heritage and expertise.",
  },
  {
    title: 'Shared Passion',
    description:
      "United by our passion for natural ingredients and wellness, we're committed to building strong relationships with all our partners.",
  },
] satisfies TextCard[]

export const RESPONSIBILITY_CARDS = [
  {
    title: 'Ethical Sourcing',
    description:
      'We are dedicated to ethical trade and sustainable sourcing, ensuring all products come from trusted global partners. Our HACCP-certified food safety program guarantees consistent quality across our teas, herbs, and spices.',
    image: {
      src: `${SHOPIFY_FILE_BASE}/Ethical_Sourcing.webp?v=1764577472`,
      alt: 'Sourced tea ingredients arranged for quality review',
      width: 874,
      height: 480,
    },
  },
  {
    title: 'Environmental Responsibility',
    description:
      'Teavision actively drives positive environmental change throughout our supply chain, with a focus on eco-friendly production, responsible packaging, and reducing our ecological footprint.',
    image: {
      src: `${SHOPIFY_FILE_BASE}/Environmental_Responsibility.webp?v=1764577509`,
      alt: 'Botanical ingredients representing environmental responsibility',
      width: 874,
      height: 480,
    },
  },
  {
    title: 'Community Impact',
    description:
      'Beyond business, we contribute to projects that promote health and wellbeing in local communities. Our partnerships support long-term initiatives that give back and encourage healthy lifestyles.',
    image: {
      src: `${SHOPIFY_FILE_BASE}/Community_Impact.webp?v=1764577529`,
      alt: 'Tea service representing community wellbeing',
      width: 874,
      height: 480,
    },
  },
] satisfies ImageCard[]

export const AWARD_IMAGES = [
  {
    src: `${SHOPIFY_FILE_BASE}/Group_39481.png?v=1758534766&width=400`,
    alt: '',
    width: 400,
    height: 258,
  },
  {
    src: `${SHOPIFY_FILE_BASE}/Group_288.png?v=1758534491&width=400`,
    alt: '',
    width: 400,
    height: 259,
  },
  {
    src: `${SHOPIFY_FILE_BASE}/Group_289_25b41dd4-5382-4951-9de5-e212c2f9832f.png?v=1758534710&width=400`,
    alt: '',
    width: 400,
    height: 258,
  },
  {
    src: `${SHOPIFY_FILE_BASE}/Group_290_7dbc3c9c-245b-45c9-aaef-85151b2be561.png?v=1758534616&width=400`,
    alt: '',
    width: 400,
    height: 258,
  },
  {
    src: `${SHOPIFY_FILE_BASE}/Group_60_dbe0534f-6bee-4cba-8731-39ec49e605f9.png?v=1758534880&width=400`,
    alt: '',
    width: 400,
    height: 258,
  },
  {
    src: `${SHOPIFY_FILE_BASE}/australian_organic_matched_size_borderless.png?v=1760590976&width=400`,
    alt: '',
    width: 400,
    height: 258,
  },
  {
    src: `${SHOPIFY_FILE_BASE}/Group_293_13de32ff-b1e8-4307-92b6-267425fb79c5.png?v=1758534817&width=400`,
    alt: '',
    width: 400,
    height: 258,
  },
] satisfies ImageAsset[]
