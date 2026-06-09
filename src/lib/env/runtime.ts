import { optionalEnv } from './read'

export function getNodeEnv(): string {
  return optionalEnv('NODE_ENV') ?? 'development'
}

export function isProductionRuntime(): boolean {
  return getNodeEnv() === 'production'
}

export function isTestRuntime(): boolean {
  return getNodeEnv() === 'test'
}
