import { spawn } from 'node:child_process'

const port = Number(process.env.PLAYWRIGHT_PORT ?? '4173')

if (!Number.isFinite(port)) {
  throw new Error('PLAYWRIGHT_PORT must be a number')
}

let activeChild = null

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      env: process.env,
      shell: process.platform === 'win32',
      stdio: 'inherit',
    })
    activeChild = child

    child.on('error', reject)
    child.on('exit', (code, signal) => {
      activeChild = null

      if (code === 0) {
        resolve()
        return
      }

      reject(
        new Error(
          `${command} ${args.join(' ')} exited with ${signal ?? `code ${code}`}`,
        ),
      )
    })
  })
}

function start(command, args) {
  const child = spawn(command, args, {
    env: process.env,
    shell: process.platform === 'win32',
    stdio: 'inherit',
  })
  activeChild = child

  child.on('error', (error) => {
    console.error(error)
    process.exit(1)
  })
  child.on('exit', (code, signal) => {
    activeChild = null
    console.error(
      `${command} ${args.join(' ')} exited with ${signal ?? `code ${code}`}`,
    )
    process.exit(code ?? 1)
  })
}

function stop() {
  if (activeChild) {
    activeChild.kill()
  }
}

process.on('SIGINT', () => {
  stop()
  process.exit(0)
})
process.on('SIGTERM', () => {
  stop()
  process.exit(0)
})

try {
  console.log('Running next build for production e2e')
  await run('corepack', ['pnpm', 'exec', 'next', 'build'])
  console.log(`Starting next start for production e2e on port ${port}`)
  start('corepack', ['pnpm', 'exec', 'next', 'start', '-p', String(port)])
} catch (error) {
  console.error(error)
  process.exit(1)
}
