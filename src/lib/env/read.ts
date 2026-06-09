export function optionalEnv(name: string): string | undefined {
  const value = process.env[name]?.trim()

  return value ? value : undefined
}

export function requiredEnv(name: string): string {
  const value = optionalEnv(name)

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export function defaultedEnv(name: string, fallback: string): string {
  return optionalEnv(name) ?? fallback
}

export function truthyEnv(name: string): boolean {
  return optionalEnv(name) === 'true'
}

export function optionalUrlOriginEnv(name: string): string | undefined {
  const value = optionalEnv(name)

  return value ? new URL(value).origin : undefined
}
