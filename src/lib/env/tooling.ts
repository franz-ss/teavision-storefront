import { optionalEnv, requiredEnv, truthyEnv } from './read'

export function requiredToolEnv(name: string, command: string): string {
  try {
    return requiredEnv(name)
  } catch {
    throw new Error(
      `Missing ${name}. Add it to .env.local before running ${command}.`,
    )
  }
}

export function defaultedNumberEnv(name: string, fallback: number): number {
  const value = optionalEnv(name)

  if (!value) return fallback

  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid numeric environment variable: ${name}`)
  }

  return parsed
}

export function isContinuousIntegration(): boolean {
  return truthyEnv('CI')
}
