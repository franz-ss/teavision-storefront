import type { CodegenConfig } from '@graphql-codegen/cli'

function readRequiredEnv(name: string): string {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(
      `Missing ${name}. Add it to .env.local before running pnpm codegen.`,
    )
  }

  return value
}

const shopifyStoreDomain = readRequiredEnv('SHOPIFY_STORE_DOMAIN')
const shopifyStorefrontAccessToken = readRequiredEnv(
  'SHOPIFY_STOREFRONT_ACCESS_TOKEN',
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
