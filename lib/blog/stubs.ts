export type ArticleSummary = {
  id: string
  handle: string
  title: string
  publishedAt: string
  excerpt: string
  readingTimeMinutes: number
  tags: string[]
}

export type Article = ArticleSummary & {
  sections: { heading: string; body: string }[]
}

export const STUB_ARTICLES: ArticleSummary[] = [
  {
    id: '1',
    handle: 'wholesale-herbs-and-spices-the-secret-to-consistent-menu-flavour',
    title: 'Wholesale Herbs and Spices: The Secret to Consistent Menu Flavour',
    publishedAt: '2026-04-23',
    excerpt:
      'In the competitive world of restaurants, consistency in your quality is key. Diners expect their favourite dish to taste just as delicious every time they order it.',
    readingTimeMinutes: 5,
    tags: ['Tea Business'],
  },
  {
    id: '2',
    handle: 'how-to-streamline-ingredient-costs-with-bulk-spice-purchasing',
    title: 'How to Streamline Ingredient Costs with Bulk Spice Purchasing',
    publishedAt: '2026-04-23',
    excerpt:
      'For cafés, restaurants and food businesses, maintaining ingredient costs presents real challenges. The right bulk spice strategy can dramatically improve your margins.',
    readingTimeMinutes: 4,
    tags: ['Tea Business', 'Organic'],
  },
  {
    id: '3',
    handle: 'essential-spices-every-cafe-and-restaurant-should-keep-in-stock',
    title: 'Essential Spices Every Café and Restaurant Should Keep in Stock',
    publishedAt: '2026-04-16',
    excerpt:
      'Running a great establishment requires quality ingredients and the right flavour profiles. Here are the spices no professional kitchen should be without.',
    readingTimeMinutes: 4,
    tags: ['Tea Business'],
  },
  {
    id: '4',
    handle:
      'understanding-spice-grades-and-quality-standards-for-wholesale-buyers',
    title:
      'Understanding Spice Grades and Quality Standards for Wholesale Buyers',
    publishedAt: '2026-04-16',
    excerpt:
      'Sourcing high-quality products from an experienced tea company is about a lot more than price. Understanding grading standards is essential for wholesale buyers.',
    readingTimeMinutes: 6,
    tags: ['Tea Grading', 'Tea Business'],
  },
  {
    id: '5',
    handle:
      'sustainable-and-ethical-spice-sourcing-what-to-look-for-in-suppliers',
    title:
      'Sustainable and Ethical Spice Sourcing: What to Look for in Suppliers',
    publishedAt: '2025-12-18',
    excerpt:
      "Growing awareness around ingredient sourcing practices is reshaping how businesses choose their suppliers. Here's what to look for in a truly ethical partner.",
    readingTimeMinutes: 5,
    tags: ['Organic', 'Tea Trends'],
  },
  {
    id: '6',
    handle: 'how-to-choose-a-reliable-wholesale-spice-supplier-in-australia',
    title: 'How to Choose a Reliable Wholesale Spice Supplier in Australia',
    publishedAt: '2025-12-18',
    excerpt:
      "When choosing a supplier for your business's herbs and spices, you need more than competitive pricing — reliability, quality, and communication all matter.",
    readingTimeMinutes: 4,
    tags: ['Tea Business'],
  },
  {
    id: '7',
    handle: 'the-complete-guide-to-tea-bags-types-quality-and-bulk-options',
    title: 'The Complete Guide to Tea Bags: Types, Quality, and Bulk Options',
    publishedAt: '2025-11-05',
    excerpt:
      'Discover everything you need to know about tea bags, from quality indicators to bulk purchasing options for cafés and retailers across Australia.',
    readingTimeMinutes: 5,
    tags: ['Tea Bag', 'Tea Business'],
  },
  {
    id: '8',
    handle: 'where-to-find-the-best-herbal-tea-brands',
    title: 'Where to Find the Best Herbal Tea Brands',
    publishedAt: '2025-10-22',
    excerpt:
      'Navigate the Australian tea wholesale market with our comprehensive guide to finding the finest herbal tea brands for your business.',
    readingTimeMinutes: 4,
    tags: ['Health', 'Organic'],
  },
]

export const STUB_ARTICLE_DETAIL: Omit<Article, keyof ArticleSummary> & {
  handle: string
} = {
  handle: 'wholesale-herbs-and-spices-the-secret-to-consistent-menu-flavour',
  sections: [
    {
      heading: 'Why Quality Matters for Menu Consistency',
      body: 'Diners expect their favourite dish to taste just as delicious every time they order it. Batch-to-batch variation in flavour and appearance — caused by inconsistent sourcing — is one of the most common complaints in hospitality. Partnering with a reliable wholesale supplier eliminates this risk by giving you access to standardised, quality-tested stock every time you order.',
    },
    {
      heading: 'The Advantage of Buying in Bulk',
      body: 'Bulk purchasing offers two clear wins: lower per-unit cost and inventory reliability. When you source from a supplier with a deep global supply chain, you benefit from economies of scale that smaller distributors simply cannot match. Forecasting your needs three to six months in advance allows you to lock in pricing and avoid the volatility of spot buying.',
    },
    {
      heading: 'Maintaining Freshness and Flavour',
      body: 'Proper storage is the most overlooked part of the bulk buying equation. Airtight containers in cool, dark, dry conditions preserve potency and reduce waste. Most dried herbs and spices have a useful shelf life of twelve to twenty-four months when stored correctly — far longer than most kitchens assume. Labelling with receipt dates and rotating stock on a first-in, first-out basis are habits that pay dividends over time.',
    },
    {
      heading: 'Conclusion',
      body: "Consistent flavour starts with consistent sourcing. By partnering with a trusted wholesale supplier and building sound storage practices, you protect both your menu quality and your margins. Teavision works with Australia's leading cafés, restaurants, and food manufacturers to deliver the same premium ingredients — batch after batch, order after order.",
    },
  ],
}

export const BLOG_TAGS = [
  'Green Tea',
  'Health',
  'Japanese Tea',
  'Matcha Tea',
  'News',
  'Organic',
  'Tea Bag',
  'Tea Benefits',
  'Tea Business',
  'Tea Grading',
  'Tea Marketing',
  'Tea Trends',
]

export function formatArticleDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function getArticleByHandle(handle: string): Article | undefined {
  const summary = STUB_ARTICLES.find((a) => a.handle === handle)
  if (!summary) return undefined
  const detail =
    handle === STUB_ARTICLE_DETAIL.handle
      ? STUB_ARTICLE_DETAIL.sections
      : [
          {
            heading: 'About This Article',
            body: 'Full article content will be available once the Shopify Blog API is connected. This page demonstrates the article layout and structure.',
          },
        ]
  return { ...summary, sections: detail }
}
