export type PageAction = {
  href: string
  label: string
}

export type Factor = {
  index: string
  label: string
  body: string
}

export const PAGE_PATH = '/pages/how-long-does-bulk-tea-last'

export const META_DESCRIPTION =
  'How long does bulk tea last? Stored in optimal conditions, a bulk tea order lasts between twelve and thirty-six months. Learn the factors that protect shelf life and how to prepare for your order.'

export const HERO = {
  eyebrow: 'Buyer guide',
  title: 'How Long Does Bulk Tea Last?',
  lede: [
    'Casual tea drinkers are probably a little better placed to note the difference between nice tea and tea that’s gone off. Why, well, because they only have a cup now and again, so the chances of their stock passing its expiration date are higher.',
    'For those that love tea and want to make sure that they benefit from the wonderful unique flavours that they invest in, the inevitable question that is asked is how long does bulk tea last? There are differences to consider - such as if the buyer opted for bags or loose-leaf tea. But, even after that, the answer is not exactly a straightforward one.',
  ],
  badges: ['ACO Organic', 'HACCP Program', 'Ships from Australia'],
} as const

export const LONGEVITY = {
  eyebrow: 'Why your order lasts',
  title: 'Why Our Bulk Tea Order Lasts for Long Time',
  body: [
    'At Teavision, we have a vast range of different teas ready to ship from Australia today. We cater to the tastes of customers from a variety of different backgrounds and needs. As such, we have undertaken considerable research into how best we can protect our products so that they are in peak condition when they arrive at your door.',
    'Our tea experts have earned our business an excellent reputation by adhering to one thing above all others – quality. We understand that for tea to last as long as it can there are many other factors to take into consideration.',
    'Storage is the main concern for anyone that invests in an order that they hope to see a good return from. In optimal conditions, your tea order can last anywhere between twelve and thirty-six months.',
  ],
  statValue: '12–36',
  statUnit: 'months',
  statLabel: 'Typical shelf life',
  statNote: 'stored in optimal conditions',
} as const

export const FACTORS = {
  eyebrow: 'Factors to consider',
  title: 'Factors That Must Be Taken into Consideration',
  intro: [
    'Different blends achieve different life spans but you can protect your blend by being mindful of certain factors. In the absence of proper storage, the reality is that your tea can become compromised quickly.',
    'This is especially true for those that order loose-leaf tea blends. While tea that is packaged in sealed containers can deliver the same quality up to thirty-six months in some cases, loose leaves are much more sensitive to the environment around them.',
  ],
  bridge:
    'So, how long does bulk tea last in challenging conditions? Well, challenging conditions include several different things.',
  items: [
    {
      index: '01',
      label: 'Light',
      body: 'If light can reach the tealeaves then this will harm their quality and how long they last.',
    },
    {
      index: '02',
      label: 'Humidity',
      body: 'Similarly, if the content of moisture in the air is high, that is, if the buyer lives in a humid climate then the leaves can be expected to absorb and become compromised. Another issue that stems from high humidity climates are microorganisms, which can have a highly detrimental effect on the entire order and spoil it completely.',
    },
    {
      index: '03',
      label: 'Odours',
      body: 'Any spices, herbs or other strong odours that are present in the storage space can be expected to change the overall flavour of your tea blend. Therefore, it is essential to store loose-leaf tea in isolation from such scents, and in a climate-controlled environment that promotes longer life.',
    },
  ] satisfies Factor[],
} as const

export const PREPARE = {
  eyebrow: 'How to prepare',
  title: 'How to Prepare for Your Bulk Tea Order',
  body: [
    'Here at Teavision, we encourage our customers to take measures to protect the tea that they source from us. Creating a space that is adequate for the orders that you make is a smart way to not only ensure that you have a dedicated, optimal place to keep it, but it is also an effective solution to knowing when it is time to reorder. You will never have more than you need at any given time and what you have will be protected from the elements and last as long as it can.',
    'Each order that we ship will likely be made up of different tea varieties or blends that have been custom made by our clients. As such, the question of how long does bulk tea last, is not a simple one to answer, but our expert team will be able to help you prepare properly and get the most from your order.',
  ],
} as const

export const CTA = {
  tagline: 'Think tea, think TeaVision – catering to all your tea needs.',
  body: 'Order your bulk tea today from Teavision, Australia’s leading online supplier of high-quality tea. Remember, our range extends far beyond loose tea. We specialise in supplying a wide range of bulk loose tea, earl grey tea, hibiscus tea, black assam tea, probiotic tea and white tea, japanese matcha tea, herbal tea, green tea, oolong tea.',
  primary: { href: '/collections', label: 'Browse the range' },
  secondary: { href: '/pages/contact', label: 'Talk to our experts' },
} as const

export const FAQ = {
  question: 'How long does bulk tea last?',
  answer:
    'In optimal conditions, your tea order can last anywhere between twelve and thirty-six months. Tea packaged in sealed containers can deliver the same quality up to thirty-six months in some cases, while loose leaves are much more sensitive to the environment around them.',
} as const
