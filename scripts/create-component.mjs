#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const arg = process.argv[2]

if (!arg || !arg.includes('/')) {
  console.error('Usage: npm run create:component -- <domain>/<component-name>')
  console.error('Example: npm run create:component -- ui/price-tag')
  process.exit(1)
}

const [domain, componentKebab] = arg.split('/')
const root = fileURLToPath(new URL('..', import.meta.url))
const domainDir = join(root, 'components', domain)

if (!existsSync(domainDir)) {
  console.error(`Domain folder does not exist: components/${domain}/`)
  console.error(`Available domains: ui, layout, product, collection, cart`)
  process.exit(1)
}

const componentName = componentKebab
  .split('-')
  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  .join('')

const componentPath = join(domainDir, `${componentKebab}.tsx`)
const storyPath = join(domainDir, `${componentKebab}.stories.tsx`)
const barrelPath = join(domainDir, 'index.ts')

if (existsSync(componentPath)) {
  console.error(`Already exists: components/${domain}/${componentKebab}.tsx`)
  process.exit(1)
}

const domainTitle = domain.charAt(0).toUpperCase() + domain.slice(1)

writeFileSync(
  componentPath,
  `type ${componentName}Props = {
  className?: string
}

export function ${componentName}({ className = '' }: ${componentName}Props) {
  return (
    <div className={className}>
      {/* ${componentName} */}
    </div>
  )
}
`,
)

writeFileSync(
  storyPath,
  `import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ${componentName} } from './${componentKebab}'

const meta: Meta<typeof ${componentName}> = {
  title: '${domainTitle}/${componentName}',
  component: ${componentName},
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ${componentName}>

export const Default: Story = {
  args: {},
}
`,
)

const exportLine = `export { ${componentName} } from './${componentKebab}'\n`

if (!existsSync(barrelPath)) {
  writeFileSync(barrelPath, exportLine)
} else {
  const existing = readFileSync(barrelPath, 'utf8')
  if (!existing.includes(`'./${componentKebab}'`)) {
    appendFileSync(barrelPath, exportLine)
  }
}

console.log(`✓ components/${domain}/${componentKebab}.tsx`)
console.log(`✓ components/${domain}/${componentKebab}.stories.tsx`)
console.log(`✓ components/${domain}/index.ts updated`)
