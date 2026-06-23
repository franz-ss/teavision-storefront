import * as Sentry from '@sentry/nextjs'

const edgeDsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN

if (edgeDsn) {
  Sentry.init({
    dsn: edgeDsn,
    environment: process.env.SENTRY_ENVIRONMENT,
    release: process.env.SENTRY_RELEASE,
    sendDefaultPii: false,
    tracesSampleRate: 0,
    enableLogs: false,
  })
}
