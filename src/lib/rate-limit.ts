/**
 * In-memory rate limiter.
 *
 * Works per serverless instance — good for basic abuse prevention.
 * For production with multiple instances, upgrade to Upstash Redis:
 *   npm install @upstash/ratelimit @upstash/redis
 *   https://upstash.com/docs/ratelimit/overview
 */

interface RateLimitEntry {
  count:   number
  resetAt: number
}

// One Map per window — resets naturally as instances recycle
const store = new Map<string, RateLimitEntry>()

export interface RateLimitResult {
  success:   boolean
  remaining: number
  resetAt:   number
}

/**
 * Check if identifier (IP + route) is within the allowed rate limit.
 *
 * @param identifier  Unique key — typically `${ip}:${route}`
 * @param limit       Max requests per window (default 20)
 * @param windowMs    Window duration in ms (default 60s)
 */
export function rateLimit(
  identifier: string,
  limit   = 20,
  windowMs = 60_000
): RateLimitResult {
  const now   = Date.now()
  const entry = store.get(identifier)

  // New or expired window
  if (!entry || entry.resetAt < now) {
    const resetAt = now + windowMs
    store.set(identifier, { count: 1, resetAt })
    // Cleanup expired entries periodically to prevent memory growth
    if (Math.random() < 0.01) cleanExpired()
    return { success: true, remaining: limit - 1, resetAt }
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt }
}

function cleanExpired() {
  const now = Date.now()
  for (const [key, val] of store) {
    if (val.resetAt < now) store.delete(key)
  }
}

/**
 * Get client IP from request headers (works on Vercel).
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  )
}

/**
 * Convenience: return a 429 Response with Retry-After header.
 */
export function rateLimitExceededResponse(resetAt: number): Response {
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000)
  return new Response(
    JSON.stringify({ error: 'Too many requests. Please try again later.' }),
    {
      status: 429,
      headers: {
        'Content-Type':  'application/json',
        'Retry-After':   String(retryAfter),
        'X-RateLimit-Reset': String(Math.floor(resetAt / 1000)),
      },
    }
  )
}
