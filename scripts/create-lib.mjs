#!/usr/bin/env node
import { existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const arg = process.argv[2]

if (!arg || !arg.includes('/')) {
  console.error('Usage: npm run create:lib -- <domain>/<module-name>')
  console.error('Example: npm run create:lib -- blog/operations')
  process.exit(1)
}

const [domain, moduleName] = arg.split('/')
const root = fileURLToPath(new URL('..', import.meta.url))
const domainDir = join(root, 'lib', domain)

if (!existsSync(domainDir)) {
  console.error(`Domain folder does not exist: lib/${domain}/`)
  process.exit(1)
}

const filePath = join(domainDir, `${moduleName}.ts`)

if (existsSync(filePath)) {
  console.error(`Already exists: lib/${domain}/${moduleName}.ts`)
  process.exit(1)
}

writeFileSync(filePath, `export {}\n`)

console.log(`✓ lib/${domain}/${moduleName}.ts`)
