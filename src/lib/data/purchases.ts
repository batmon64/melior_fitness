/**
 * Purchase data helpers.
 * READ helpers use the server client (user-facing).
 * WRITE helpers use the admin client (service role — called from API routes/webhooks only).
 */
import { createClient, createAdminClient } from '@/lib/supabase/server'
import type { PurchaseRow, PurchaseWithPlan, PaymentStatus } from '@/types/supabase'

/** Get all purchases for the current authenticated user */
export async function getMyPurchases(): Promise<PurchaseWithPlan[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('purchases')
    .select(`
      *,
      diet_plan:diet_plans!purchases_plan_id_fkey (
        id,
        title,
        slug,
        thumbnail_url,
        category
      )
    `)
    .eq('user_id', user.id)
    .eq('status', 'paid')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[getMyPurchases]', error.message)
    return []
  }

  return (data ?? []) as PurchaseWithPlan[]
}

/** Check if the current user owns a specific plan */
export async function hasUserPurchased(planId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { count, error } = await supabase
    .from('purchases')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('plan_id', planId)
    .eq('status', 'paid')

  if (error) {
    console.error('[hasUserPurchased]', error.message)
    return false
  }

  return (count ?? 0) > 0
}

/**
 * Create a pending purchase record.
 * Called from the checkout API route BEFORE Stripe session creation.
 * Uses admin client to bypass RLS (purchases are write-protected from client).
 */
export async function createPurchaseRecord(params: {
  userId: string
  planId: string
  amount: number
  stripeSessionId?: string
}): Promise<PurchaseRow | null> {
  const admin = await createAdminClient()

  const { data, error } = await admin
    .from('purchases')
    .upsert(
      {
        user_id:           params.userId,
        plan_id:           params.planId,
        amount:            params.amount,
        currency:          'INR',
        status:            'pending',
        stripe_session_id: params.stripeSessionId ?? null,
      } as never,
      { onConflict: 'user_id,plan_id', ignoreDuplicates: false }
    )
    .select()
    .single()

  if (error) {
    console.error('[createPurchaseRecord]', error.message)
    return null
  }

  return data
}

/**
 * Update purchase status — called from Stripe webhook handler.
 * Uses admin client (service role) — NEVER call from client-side code.
 */
export async function updatePurchaseStatus(params: {
  stripeSessionId?: string
  stripePaymentIntentId?: string
  status: PaymentStatus
}): Promise<{ success: boolean; error?: string }> {
  const admin = await createAdminClient()

  // Build match criteria (session ID takes priority)
  const match = params.stripeSessionId
    ? { stripe_session_id: params.stripeSessionId }
    : { stripe_payment_intent_id: params.stripePaymentIntentId }

  const { error } = await admin
    .from('purchases')
    .update({
      status: params.status,
      ...(params.stripePaymentIntentId && { stripe_payment_intent_id: params.stripePaymentIntentId }),
    } as never)
    .match(match as never)

  if (error) {
    console.error('[updatePurchaseStatus]', error.message)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/** Get all purchases for a trainer's plans (trainer dashboard) */
export async function getTrainerPlanSales(trainerId: string): Promise<PurchaseRow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('purchases')
    .select(`
      *,
      diet_plan:diet_plans!purchases_plan_id_fkey (
        id, title, trainer_id
      )
    `)
    .eq('status', 'paid')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[getTrainerPlanSales]', error.message)
    return []
  }

  // RLS handles filtering — only returns purchases for this trainer's plans
  return (data ?? []) as PurchaseRow[]
}
