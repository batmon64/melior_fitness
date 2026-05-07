import { NextResponse, type NextRequest } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * Stripe Webhook Handler
 *
 * Security:
 *   - Raw body is used for signature verification (NEVER parse as JSON first)
 *   - stripe.webhooks.constructEvent() validates the Stripe-Signature header
 *   - Uses STRIPE_WEBHOOK_SECRET from environment — set via Stripe Dashboard
 *   - Admin client used for DB writes (bypasses RLS — only safe server-side)
 *   - Idempotent: re-processing the same event produces the same result
 *
 * To get your webhook secret locally:
 *   stripe listen --forward-to localhost:3000/api/webhooks/stripe
 *   Copy the "whsec_..." secret to STRIPE_WEBHOOK_SECRET in .env.local
 *
 * Production:
 *   Stripe Dashboard → Webhooks → Add endpoint
 *   URL: https://your-domain.com/api/webhooks/stripe
 *   Events: checkout.session.completed, checkout.session.expired,
 *           payment_intent.payment_failed
 */
export async function POST(request: NextRequest) {
  // 1. Get raw body — required for signature verification
  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  // 2. Verify Stripe signature — rejects tampered or fake webhooks
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[webhook] Signature verification failed:', msg)
    return NextResponse.json({ error: `Webhook signature invalid: ${msg}` }, { status: 400 })
  }

  const admin = await createAdminClient()

  // 3. Handle events
  try {
    switch (event.type) {

      // ── Payment successful ─────────────────────────────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.payment_status !== 'paid') break  // paid async — wait for next event

        await handlePaymentSuccess(admin, session)
        break
      }

      // ── Async payment confirmation (bank transfers, UPI delayed) ──────────
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session
        await handlePaymentSuccess(admin, session)
        break
      }

      // ── Payment failed ────────────────────────────────────────────────────
      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handlePaymentFailed(admin, session.id)
        break
      }

      // ── Session expired (user abandoned checkout) ─────────────────────────
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        await handlePaymentFailed(admin, session.id)
        break
      }

      // ── Refund issued ─────────────────────────────────────────────────────
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const paymentIntentId = charge.payment_intent as string | null
        if (paymentIntentId) {
          await (admin.from('purchases') as ReturnType<typeof admin.from>)
            .update({ status: 'refunded' } as never)
            .eq('stripe_payment_intent_id', paymentIntentId)
        }
        break
      }

      default:
        // Unhandled event — acknowledge receipt so Stripe doesn't retry
        break
    }

    return NextResponse.json({ received: true }, { status: 200 })

  } catch (err) {
    console.error(`[webhook] Error handling ${event.type}:`, err)
    // Return 200 anyway — returning 5xx causes Stripe to retry, which can cause
    // issues if the DB write partially succeeded
    return NextResponse.json({ received: true, warning: 'Handler error' }, { status: 200 })
  }
}

// ── Handler helpers ────────────────────────────────────────────────────────────

async function handlePaymentSuccess(
  admin: Awaited<ReturnType<typeof createAdminClient>>,
  session: Stripe.Checkout.Session
) {
  const { user_id, plan_id } = session.metadata ?? {}

  if (!user_id || !plan_id) {
    console.error('[webhook] Missing metadata on session:', session.id)
    return
  }

  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : (session.payment_intent as Stripe.PaymentIntent | null)?.id ?? null

  // Upsert ensures idempotency — running this twice produces the same result
  const { error } = await (admin.from('purchases') as ReturnType<typeof admin.from>)
    .upsert(
      {
        user_id,
        plan_id,
        stripe_session_id:        session.id,
        stripe_payment_intent_id: paymentIntentId,
        amount:                   Math.round((session.amount_total ?? 0) / 100), // paise → rupees
        currency:                 (session.currency ?? 'inr').toUpperCase(),
        status:                   'paid',
      } as never,
      { onConflict: 'user_id,plan_id', ignoreDuplicates: false }
    )

  if (error) {
    console.error('[webhook] DB upsert failed:', error.message)
    throw error   // Re-throw so the outer catch logs it (but still returns 200)
  }

  console.log(`[webhook] Purchase confirmed: user=${user_id} plan=${plan_id}`)
}

async function handlePaymentFailed(
  admin: Awaited<ReturnType<typeof createAdminClient>>,
  sessionId: string
) {
  await (admin.from('purchases') as ReturnType<typeof admin.from>)
    .update({ status: 'failed' } as never)
    .eq('stripe_session_id', sessionId)
    .eq('status', 'pending')   // Only update pending — don't overwrite 'paid'
}

// Reject non-POST
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
