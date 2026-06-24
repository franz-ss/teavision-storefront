import { spawn } from 'node:child_process'

const port = Number(process.env.PLAYWRIGHT_PORT ?? '4173')

if (!Number.isFinite(port)) {
  throw new Error('PLAYWRIGHT_PORT must be a number')
}

let activeChild = null
let shuttingDown = false

function spawnOptions() {
  return {
    detached: process.platform !== 'win32',
    env: process.env,
    shell: process.platform === 'win32',
    stdio: 'inherit',
  }
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, spawnOptions())
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
  const child = spawn(command, args, spawnOptions())
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
    if (!shuttingDown) {
      process.exit(code ?? 1)
    }
  })
}

function hasChildExited(child) {
  return child.exitCode !== null || child.signalCode !== null
}

function waitForChildExit(child, timeoutMs = 5000) {
  if (hasChildExited(child)) return Promise.resolve()

  return new Promise((resolve) => {
    let complete = false
    const timer = setTimeout(() => {
      signalChildTree(child, 'SIGKILL')
    }, timeoutMs)

    const finish = () => {
      if (complete) return
      complete = true
      clearTimeout(timer)
      resolve()
    }

    child.on('exit', finish)
    child.on('error', finish)
  })
}

function signalChildTree(child, signal) {
  if (process.platform !== 'win32' && child.pid) {
    try {
      process.kill(-child.pid, signal)
      return
    } catch {
      // Fall back to direct child signaling when no process group exists.
    }
  }

  child.kill(signal)
}

async function stop() {
  const child = activeChild
  if (!child || hasChildExited(child)) return

  const exitPromise = waitForChildExit(child)

  if (process.platform === 'win32') {
    await new Promise((resolve) => {
      const killer = spawn(
        'taskkill',
        ['/pid', String(child.pid), '/T', '/F'],
        { stdio: 'ignore' },
      )
      killer.on('exit', resolve)
      killer.on('error', resolve)
    })
  } else {
    signalChildTree(child, 'SIGTERM')
  }

  await exitPromise
}

async function shutdown(code) {
  shuttingDown = true
  await stop()
  process.exit(code)
}

process.on('SIGINT', () => {
  void shutdown(0)
})
process.on('SIGTERM', () => {
  void shutdown(0)
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
