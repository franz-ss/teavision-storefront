import { defaultedNumberEnv } from '../../src/lib/env/tooling'
import { createFakeCustomerAccountApiServer } from './customer-account-api-server'

const port = defaultedNumberEnv('FAKE_CUSTOMER_ACCOUNT_PORT', 4518)

async function main() {
  const server = await createFakeCustomerAccountApiServer({ port })

  console.log(`Fake Customer Account API server listening at ${server.url}`)

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
