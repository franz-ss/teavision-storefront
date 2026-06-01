export type FooterLink = {
  href: string
  label: string
  title?: string
}

export type FooterContactLink = FooterLink & {
  kind: 'email' | 'phone'
}

export type FooterColumn = {
  title: string
  links: FooterLink[]
}

export type PaymentMethodLabel =
  | 'American Express'
  | 'Apple Pay'
  | 'Google Pay'
  | 'Mastercard'
  | 'PayPal'
  | 'Shop Pay'
  | 'Union Pay'
  | 'Visa'

export type PaymentMethod = {
  label: PaymentMethodLabel
}

export type FooterImage = {
  alt: string
  height: number
  src: string
  width: number
}
