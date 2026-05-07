import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { rateLimit, getClientIp, rateLimitExceededResponse } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

// ── Input validation ──────────────────────────────────────────────────────────
const schema = z.object({
  planSlug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
})

// ── POST /api/checkout ────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  // Rate limit: 5 checkout attempts per IP per minute
  const ip     = getClientIp(request)
  const rl     = rateLimit(`checkout:${ip}`, 5, 60_000)
  if (!rl.success) {
    logger.securityEvent('checkout_rate_limited', { ip })
    return rateLimitExceededResponse(rl.resetAt)
  }
  logger.apiRequest('POST', '/api/checkout', ip)

  try {
    // 1. Parse + validate body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid plan slug' }, { status: 400 })
    }
    const { planSlug } = parsed.data

    // 2. Verify authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // 3. Fetch plan from Supabase — NEVER trust price from client
    const { data: planData } = await (supabase
      .from('diet_plans') as ReturnType<typeof supabase.from>)
      .select('id, title, description, price, original_price, slug, is_published, thumbnail_url')
      .eq('slug', planSlug)
      .eq('is_published', true)
      .single()

    const plan = planData as {
      id: string
      title: string
      description: string
      price: number
      original_price: number | null
      slug: string
      is_published: boolean
      thumbnail_url: string | null
    } | null

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found or not available for purchase' },
        { status: 404 }
      )
    }

    // 4. Check for existing paid purchase (prevent duplicate purchases)
    const { count: existingPaid } = await supabase
      .from('purchases')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('plan_id', plan.id)
      .eq('status', 'paid')

    if (existingPaid && existingPaid > 0) {
      return NextResponse.json(
        { error: 'You have already purchased this plan', code: 'ALREADY_PURCHASED' },
        { status: 409 }
      )
    }

    // 5. Fetch user profile for prefilling checkout
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()

    const customerName = (profile as { full_name: string | null } | null)?.full_name ?? undefined

    // 6. Create Stripe Checkout Session
    //    Price: convert rupees → paise (INR smallest unit = 1 paisa = ₹0.01)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',

      customer_email: user.email,
      ...(customerName && {
        customer_creation: 'always',
      }),

      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: plan.title,
              description: plan.description,
              ...(plan.thumbnail_url && { images: [plan.thumbnail_url] }),
            },
            unit_amount: plan.price * 100,   // ₹999 → 99900 paise
          },
          quantity: 1,
        },
      ],

      // Metadata for webhook — links Stripe session back to our DB
      metadata: {
        user_id:   user.id,
        plan_id:   plan.id,
        plan_slug: plan.slug,
      },

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel?plan=${plan.slug}`,

      // Auto-expire after 30 minutes
      expires_at: Math.floor(Date.now() / 1000) + 1800,
    })

    // 7. Create pending purchase record in Supabase
    //    Uses admin client — purchases table has no INSERT policy for users
    const admin = await createAdminClient()
    await (admin.from('purchases') as ReturnType<typeof admin.from>)
      .upsert(
        {
          user_id:           user.id,
          plan_id:           plan.id,
          stripe_session_id: session.id,
          amount:            plan.price,
          currency:          'INR',
          status:            'pending',
        } as never,
        { onConflict: 'user_id,plan_id', ignoreDuplicates: false }
      )

    // 8. Return Stripe checkout URL
    return NextResponse.json({ url: session.url }, { status: 200 })

  } catch (err) {
    console.error('[POST /api/checkout]', err)
    return NextResponse.json(
      { error: 'Failed to create checkout session. Please try again.' },
      { status: 500 }
    )
  }
}

// Reject non-POST methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
