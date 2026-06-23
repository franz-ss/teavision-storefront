export type ReadinessStatus = 'ok' | 'degraded' | 'blocked'

export type OwnerGateStatus = 'approved' | 'pending' | 'owner-blocked'

export type ReadinessCheck = {
  id: string
  label: string
  status: ReadinessStatus
  detail: string
}

export type OwnerGateCheck = {
  id: string
  label: string
  status: OwnerGateStatus
  evidence: string
}

export type PublicHealthPayload = {
  status: 'ok'
  service: 'teavision-storefront'
  release: string | null
  timestamp: string
}

type PublicHealthInput = {
  release?: string | null
  now?: Date
}

const OWNER_GATE_STATUSES = [
  'approved',
  'pending',
  'owner-blocked',
] as const satisfies OwnerGateStatus[]

export function makePublicHealthPayload(
  input: PublicHealthInput = {},
): PublicHealthPayload {
  const release =
    input.release !== undefined
      ? input.release
      : process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.SENTRY_RELEASE ?? null

  return {
    status: 'ok',
    service: 'teavision-storefront',
    release: normalizeRelease(release),
    timestamp: (input.now ?? new Date()).toISOString(),
  }
}

export function summarizeReadiness(
  checks: ReadinessCheck[],
): ReadinessStatus {
  if (checks.some((check) => check.status === 'blocked')) {
    return 'blocked'
  }

  if (checks.some((check) => check.status === 'degraded')) {
    return 'degraded'
  }

  return 'ok'
}

export function isOwnerGateStatus(value: string): value is OwnerGateStatus {
  return OWNER_GATE_STATUSES.some((status) => status === value)
}

function normalizeRelease(value: string | null): string | null {
  const trimmed = value?.trim()

  return trimmed ? trimmed : null
}
