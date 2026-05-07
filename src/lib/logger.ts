/**
 * Structured logger for Melior Fitness.
 *
 * - Development: coloured console output
 * - Production: JSON format (Vercel captures stdout as logs)
 *
 * Future: swap emit() with Axiom, Logtail, or Sentry transport.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogPayload {
  message: string
  [key: string]: unknown
}

const IS_PROD = process.env.NODE_ENV === 'production'

function emit(level: LogLevel, payload: LogPayload) {
  if (IS_PROD) {
    // Structured JSON — parse-friendly in Vercel/Datadog
    const output = JSON.stringify({
      level,
      ts: new Date().toISOString(),
      ...payload,
    })
    if (level === 'error' || level === 'warn') {
      console.error(output)
    } else {
      console.log(output)
    }
  } else {
    const COLORS: Record<LogLevel, string> = {
      debug: '\x1b[90m',   // grey
      info:  '\x1b[36m',   // cyan
      warn:  '\x1b[33m',   // yellow
      error: '\x1b[31m',   // red
    }
    const RESET = '\x1b[0m'
    const { message, ...rest } = payload
    const extra = Object.keys(rest).length ? ' ' + JSON.stringify(rest) : ''
    console.log(`${COLORS[level]}[${level.toUpperCase()}]${RESET} ${message}${extra}`)
  }
}

export const logger = {
  debug: (message: string, ctx?: Record<string, unknown>) => emit('debug', { message, ...ctx }),
  info:  (message: string, ctx?: Record<string, unknown>) => emit('info',  { message, ...ctx }),
  warn:  (message: string, ctx?: Record<string, unknown>) => emit('warn',  { message, ...ctx }),
  error: (message: string, ctx?: Record<string, unknown>) => emit('error', { message, ...ctx }),

  /** Log an API request (call at start of each API handler) */
  apiRequest: (method: string, path: string, ip: string) =>
    emit('info', { message: 'API request', method, path, ip }),

  /** Log a security event (failed auth, rate limit, forbidden) */
  securityEvent: (event: string, details: Record<string, unknown>) =>
    emit('warn', { message: `Security: ${event}`, ...details }),
}
