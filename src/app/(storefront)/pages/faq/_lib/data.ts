export const FAQ_PAGE_PATH = '/pages/faq'
export const FAQ_PAGE_TITLE = 'Wholesale Tea Supplier FAQ'
export const FAQ_PAGE_DESCRIPTION =
  "As Australia's trusted wholesale tea supplier, we answer the most common questions about buying wholesale tea, herbs, and functional powders with Teavision — from bulk ordering to supply options."

export const FAQ_HERO_SUBHEADING =
  "As Australia's trusted wholesale tea supplier, we know our customers - from cafés to retailers and manufacturers - often have questions about our products, bulk ordering, and supply options. Below, you'll find answers to the most common queries about buying wholesale tea, herbs, and functional powders with Teavision."

export type FaqEntry = {
  id: string
  question: string
  answer: string
}

export type FaqGroup = {
  id: string
  title: string
  items: FaqEntry[]
}

const TERMS_PLACEHOLDER_ANSWER =
  'By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.\n\nYou may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).\n\nYou must not transmit any worms or viruses or any code of a destructive nature. A breach or violation of any of the Terms will result in an immediate termination of your Services.'

const WHOLESALE_PRICING_ANSWER =
  'We are pleased to offer wholesale pricing direct on our website, with volume discounts available across eligible bulk quantities. Please contact our sales team if you need guidance on large repeat orders.'

const RETAIL_ORDERS_ANSWER =
  'You can place retail orders directly through our website by adding products to your cart and proceeding to checkout. We accept all major credit cards and PayPal.'

const CUSTOM_BLENDS_ANSWER =
  "Yes, we offer custom tea blending services for both retail and wholesale customers. Contact our team to discuss your specific requirements and we'll create a unique blend just for you."

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: 'general',
    title: 'General Wholesale Tea Questions',
    items: [
      {
        id: 'leading-supplier',
        question:
          'What makes Teavision a leading wholesale tea supplier in Australia?',
        answer: TERMS_PLACEHOLDER_ANSWER,
      },
      {
        id: 'supply-across-australia',
        question: 'Do you supply tea wholesale across Australia?',
        answer: WHOLESALE_PRICING_ANSWER,
      },
      {
        id: 'bulk-organic-tea',
        question: 'Can I order bulk organic tea from Teavision?',
        answer: RETAIL_ORDERS_ANSWER,
      },
      {
        id: 'get-started',
        question: 'How do I get started with a wholesale tea order?',
        answer: CUSTOM_BLENDS_ANSWER,
      },
    ],
  },
  {
    id: 'products',
    title: 'Popular Wholesale Products',
    items: [
      {
        id: 'matcha-wholesale',
        question: 'Do you supply matcha tea wholesale?',
        answer: TERMS_PLACEHOLDER_ANSWER,
      },
      {
        id: 'chamomile-wholesale',
        question: 'Can I buy chamomile tea wholesale?',
        answer: WHOLESALE_PRICING_ANSWER,
      },
      {
        id: 'mushroom-powder',
        question: 'Do you supply bulk mushroom powder?',
        answer: RETAIL_ORDERS_ANSWER,
      },
      {
        id: 'wholesale-spices',
        question: 'Can I order wholesale spices along with tea?',
        answer: CUSTOM_BLENDS_ANSWER,
      },
      {
        id: 'turmeric-powder',
        question: 'Do you stock turmeric powder wholesale?',
        answer: CUSTOM_BLENDS_ANSWER,
      },
    ],
  },
  {
    id: 'business-support',
    title: 'Business & Support Questions',
    items: [
      {
        id: 'business-types',
        question: 'What types of businesses do you work with?',
        answer: TERMS_PLACEHOLDER_ANSWER,
      },
      {
        id: 'chamomile-wholesale-support',
        question: 'Can I buy chamomile tea wholesale?',
        answer: WHOLESALE_PRICING_ANSWER,
      },
      {
        id: 'private-label-custom-blends',
        question: 'Do you offer private-label or custom blends?',
        answer: RETAIL_ORDERS_ANSWER,
      },
      {
        id: 'wholesale-support',
        question: 'What support can wholesale buyers expect?',
        answer: CUSTOM_BLENDS_ANSWER,
      },
    ],
  },
]
