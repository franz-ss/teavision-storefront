import { createFakeShopifyServer } from './shopify-graphql-server'
import { defaultedNumberEnv } from '../../src/lib/env/tooling'

const port = defaultedNumberEnv('FAKE_SHOPIFY_PORT', 4517)

async function main() {
  const server = await createFakeShopifyServer({ port })

  console.log(`Fake Shopify server listening at ${server.url}`)

  async function close() {
    await server.close()
  }

  process.on('SIGINT', () => {
    void close().then(() => process.exit(0))
  })
  process.on('SIGTERM', () => {
    void close().then(() => process.exit(0))
  })
}

void main()
