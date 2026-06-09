import { afterEach, describe, expect, test, vi } from 'vitest'

import {
  defaultedEnv,
  optionalEnv,
  optionalUrlOriginEnv,
  requiredEnv,
  truthyEnv,
} from './read'

describe('env readers', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  test('treats missing and blank values as absent', () => {
    vi.stubEnv('OPTIONAL_VALUE', '   ')

    expect(optionalEnv('OPTIONAL_VALUE')).toBeUndefined()
    expect(defaultedEnv('OPTIONAL_VALUE', 'fallback')).toBe('fallback')
  })

  test('trims present values', () => {
    vi.stubEnv('REQUIRED_VALUE', '  present  ')

    expect(requiredEnv('REQUIRED_VALUE')).toBe('present')
  })

  test('throws a clear error for required values', () => {
    expect(() => requiredEnv('MISSING_VALUE')).toThrow(
      'Missing required environment variable: MISSING_VALUE',
    )
  })

  test('parses boolean flags only from the literal true string', () => {
    vi.stubEnv('ENABLED_FLAG', 'true')
    vi.stubEnv('UPPERCASE_FLAG', 'TRUE')

    expect(truthyEnv('ENABLED_FLAG')).toBe(true)
    expect(truthyEnv('UPPERCASE_FLAG')).toBe(false)
    expect(truthyEnv('MISSING_FLAG')).toBe(false)
  })

  test('normalizes URL values to origins', () => {
    vi.stubEnv('URL_VALUE', ' https://example.com/path?x=1 ')

    expect(optionalUrlOriginEnv('URL_VALUE')).toBe('https://example.com')
  })
})
