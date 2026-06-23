import * as Sentry from '@sentry/nextjs'

const clientDsn = process.env.NEXT_PUBLIC_SENTRY_DSN

if (clientDsn) {
  Sentry.init({
    dsn: clientDsn,
    environment: process.env.SENTRY_ENVIRONMENT,
    release: process.env.SENTRY_RELEASE,
    sendDefaultPii: false,
    tracesSampleRate: 0,
    enableLogs: false,
  })
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
