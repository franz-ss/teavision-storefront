import type { Metadata } from 'next'

type RobotsMetadata = NonNullable<Metadata['robots']>
type RobotsObject = Exclude<RobotsMetadata, string>

const NOINDEX_ROBOTS = {
  index: false,
  follow: false,
  noarchive: true,
} satisfies RobotsObject

export function isNoindexModeEnabled(): boolean {
  return process.env.DISABLE_INDEXING === 'true'
}

export function withNoindexRobots(metadata: Metadata): Metadata {
  if (!isNoindexModeEnabled()) {
    return metadata
  }

  return {
    ...metadata,
    robots: mergeNoindexRobots(metadata.robots),
  }
}

function mergeNoindexRobots(robots: Metadata['robots']): RobotsObject {
  if (typeof robots !== 'object' || robots === null) {
    return NOINDEX_ROBOTS
  }

  const googleBot =
    typeof robots.googleBot === 'object' && robots.googleBot !== null
      ? {
          ...robots.googleBot,
          ...NOINDEX_ROBOTS,
        }
      : undefined

  return {
    ...robots,
    ...NOINDEX_ROBOTS,
    ...(googleBot ? { googleBot } : {}),
  }
}
