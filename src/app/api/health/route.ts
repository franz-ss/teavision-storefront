import { makePublicHealthPayload } from '@/lib/readiness/status'

export function GET(): Response {
  return Response.json(makePublicHealthPayload(), {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}
