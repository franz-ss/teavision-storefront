export type TrustPoint = {
  description: string
  icon: 'shield' | 'users' | 'trophy'
  title: string
}

export const TRUST_POINTS = [
  {
    icon: 'shield',
    title: 'Quality Assurance',
    description:
      'Every batch tested to ensure consistent quality and safety standards',
  },
  {
    icon: 'users',
    title: 'Trusted by 2,500+ Businesses',
    description:
      'Wholesale partner for cafes, hotels, and retailers across Australia',
  },
  {
    icon: 'trophy',
    title: 'Award-Winning Products',
    description: 'Multiple international awards for our premium tea blends',
  },
] satisfies TrustPoint[]

export const AWARD_EXCELLENCE = {
  title: 'Award-Winning Excellence',
  copy: 'Our commitment to quality has been recognized with prestigious awards from around the world',
  stat: '17+',
  label: 'Industry Awards',
  detailPrefix: 'Including',
  detailHighlight: '7 Gold Medals',
  detailSuffix: 'for various tea blends and industry recognition',
}

export const CTA = {
  title: 'Partner with a Certified Leader',
  copy: 'Experience the difference that comprehensive certification and award-winning quality makes. Our team is ready to discuss your private label tea requirements.',
  href: 'mailto:info@teavision.com.au',
  action: 'Request Certifications',
}
