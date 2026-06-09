import type { CodegenConfig } from '@graphql-codegen/cli'

import { requiredToolEnv } from './src/lib/env/tooling'

const shopifyStoreDomain = requiredToolEnv(
  'SHOPIFY_STORE_DOMAIN',
  'pnpm codegen',
)
const shopifyStorefrontAccessToken = requiredToolEnv(
  'SHOPIFY_STOREFRONT_ACCESS_TOKEN',
  'pnpm codegen',
)

const config: CodegenConfig = {
  schema: {
    [`https://${shopifyStoreDomain}/api/2026-04/graphql.json`]: {
      headers: {
        'X-Shopify-Storefront-Access-Token': shopifyStorefrontAccessToken,
      },
    },
  },
  documents: ['src/lib/shopify/queries/**/*.graphql'],
  generates: {
    'src/lib/shopify/types/generated/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
      },
    },
  },
}

export default config
