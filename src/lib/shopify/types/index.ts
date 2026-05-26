import type { FilterType as ShopifyFilterType } from './generated/graphql'

export type Money = {
  amount: string
  currencyCode: string
}

export type BulkPricingTier = {
  minimumQuantity: number
  price?: Money
  discountPercent?: number
  label?: string
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
  quantityPriceBreaks: BulkPricingTier[]
  image?: ShopifyImage | null
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
  tags: string[]
  images: ShopifyImage[]
  priceRange: { minVariantPrice: Money }
  variants: ProductVariant[]
  bulkPricingTiers: BulkPricingTier[]
  options: ProductOption[]
  rating?: number
  reviewCount?: number
}

export type ProductSummary = {
  id: string
  handle: string
  title: string
  featuredImage: ShopifyImage | null
  priceRange: { minVariantPrice: Money }
  rating?: number
  reviewCount?: number
}

export type CollectionProductSummary = ProductSummary & {
  availableForSale: boolean
  productType: string
  tags: string[]
  options: ProductOption[]
  variants: ProductVariant[]
}

export type CollectionFilterValue = {
  id: string
  label: string
  count: number
  input: string
  href?: string
}

export type CollectionProductFilter = {
  id: string
  label: string
  type: ShopifyFilterType
  values: CollectionFilterValue[]
}

export type CollectionProductsResult = {
  products: CollectionProductSummary[]
  filters: CollectionProductFilter[]
}

export type Collection = {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  featuredImage: ShopifyImage | null
  updatedAt: string
  seo: {
    title: string | null
    description: string | null
  }
}

export type CollectionSummary = Omit<Collection, 'descriptionHtml'>

export type CartLine = {
  id: string
  quantity: number
  cost: {
    amountPerQuantity: Money
    subtotalAmount: Money
    totalAmount: Money
  }
  discountAllocations: CartLineDiscountAllocation[]
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

export type CartLineDiscountAllocation = {
  title: string | null
  discountedAmount: Money
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

export {
  CartCreateDocument,
  CartLinesAddDocument,
  CartLinesRemoveDocument,
  CartLinesUpdateDocument,
  FilterType,
  GetArticleDocument,
  GetBlogDocument,
  GetCartDocument,
  GetCollectionDocument,
  GetCollectionProductsDocument,
  GetCollectionSummariesDocument,
  GetCollectionsDocument,
  GetPageDocument,
  GetPagesDocument,
  GetProductDocument,
  GetProductRecommendationsDocument,
  GetProductsDocument,
  GetProductVariantsDocument,
  ProductCollectionSortKeys,
  ProductRecommendationIntent,
  SearchProductsDocument,
} from './generated/graphql'

export type {
  CartCreateMutation,
  CartLinesAddMutation,
  CartLinesRemoveMutation,
  CartLinesUpdateMutation,
  GetArticleQuery,
  GetBlogQuery,
  GetCartQuery,
  GetCollectionProductsQuery,
  GetCollectionQuery,
  GetCollectionSummariesQuery,
  GetCollectionsQuery,
  GetPageQuery,
  GetPagesQuery,
  GetProductQuery,
  GetProductRecommendationsQuery,
  GetProductsQuery,
  GetProductVariantsQuery,
  ProductFilter,
  SearchProductsQuery,
} from './generated/graphql'
