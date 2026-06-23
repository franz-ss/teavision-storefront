import * as Sentry from '@sentry/nextjs'

const serverDsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN

if (serverDsn) {
  Sentry.init({
    dsn: serverDsn,
    environment: process.env.SENTRY_ENVIRONMENT,
    release: process.env.SENTRY_RELEASE,
    sendDefaultPii: false,
    tracesSampleRate: 0,
    enableLogs: false,
  })
}
