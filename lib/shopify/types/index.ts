export type Money = {
  amount: string
  currencyCode: string
}

export type ShopifyImage = {
  url: string
  altText: string | null
  width: number | null
  height: number | null
}

export type ProductVariant = {
  id: string
  title: string
  availableForSale: boolean
  price: Money
}

export type ProductOption = {
  name: string
  values: string[]
}

export type Product = {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  images: ShopifyImage[]
  priceRange: { minVariantPrice: Money }
  variants: ProductVariant[]
  options: ProductOption[]
}

export type ProductSummary = {
  id: string
  handle: string
  title: string
  featuredImage: ShopifyImage | null
  priceRange: { minVariantPrice: Money }
}

export type Collection = {
  handle: string
  title: string
  description: string
}

export type CartLine = {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    price: Money
    product: {
      handle: string
      title: string
      featuredImage: ShopifyImage | null
    }
  }
}

export type Cart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    totalAmount: Money
    subtotalAmount: Money
  }
  lines: CartLine[]
}
