import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

/**
 * Server-side Stripe instance — lazily initialised.
 * Returns null when STRIPE_SECRET_KEY is not configured
 * so the app builds cleanly without Stripe keys.
 */
let _stripe: Stripe | null = null

export function getStripeServer(): Stripe {
  if (_stripe) return _stripe

  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error(
      'STRIPE_SECRET_KEY is not set. Add it to your environment variables to enable payments.'
    )
  }

  _stripe = new Stripe(key, {
    apiVersion: '2026-04-22.dahlia',
    typescript: true,
  })

  return _stripe
}

/**
 * Legacy export — kept for backward compatibility.
 * Use getStripeServer() in new code.
 */
export const stripe = {
  get checkout()         { return getStripeServer().checkout },
  get webhooks()         { return getStripeServer().webhooks },
  get paymentIntents()   { return getStripeServer().paymentIntents },
  get customers()        { return getStripeServer().customers },
} as unknown as Stripe

/** Browser-side Stripe promise (singleton) */
let stripePromise: ReturnType<typeof loadStripe> | null = null

export function getStripe() {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!key) return null
  if (!stripePromise) stripePromise = loadStripe(key)
  return stripePromise
}
