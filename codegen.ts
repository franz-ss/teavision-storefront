import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: {
    [`https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2025-01/graphql.json`]: {
      headers: {
        'X-Shopify-Storefront-Access-Token':
          process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? '',
      },
    },
  },
  documents: ['lib/shopify/queries/**/*.graphql'],
  generates: {
    'lib/shopify/types/generated/': {
      preset: 'client',
    },
  },
}

export default config
