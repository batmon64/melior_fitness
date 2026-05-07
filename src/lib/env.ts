/**
 * Environment variable validation.
 * Throws at startup if required vars are missing in production.
 * Call this from instrumentation.ts or a server layout.
 */

const REQUIRED_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_APP_URL',
] as const

const STRIPE_VARS = [
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
] as const

export function validateEnv() {
  if (process.env.NODE_ENV !== 'production') return

  const missing: string[] = []

  for (const key of REQUIRED_VARS) {
    if (!process.env[key]) missing.push(key)
  }

  // Only warn about Stripe (not required until payment features activated)
  const missingStripe = STRIPE_VARS.filter((k) => !process.env[k])
  if (missingStripe.length > 0) {
    console.warn(`[env] Stripe vars missing — payment features disabled: ${missingStripe.join(', ')}`)
  }

  if (missing.length > 0) {
    throw new Error(
      `[env] Missing required environment variables:\n${missing.map((k) => `  • ${k}`).join('\n')}\n\nSee .env.local.example for reference.`
    )
  }
}

/** Type-safe env accessor — throws in dev if var is missing */
export function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[env] Missing: ${key}`)
      return ''
    }
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}
