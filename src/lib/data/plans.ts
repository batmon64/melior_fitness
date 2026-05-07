/**
 * Diet Plan data helpers — server-side only.
 */
import { createClient } from '@/lib/supabase/server'
import type { DietPlanRow, DietPlanWithTrainer, PlanCategory } from '@/types/supabase'

/** Get all published diet plans, optionally filtered by category */
export async function getPublishedPlans(category?: PlanCategory): Promise<DietPlanWithTrainer[]> {
  const supabase = await createClient()

  let query = supabase
    .from('diet_plans')
    .select(`
      *,
      trainer:trainers!diet_plans_trainer_id_fkey (
        id,
        slug,
        title,
        profile:profiles!trainers_user_id_fkey (
          full_name,
          avatar_url
        )
      )
    `)
    .eq('is_published', true)
    .order('is_popular', { ascending: false })
    .order('created_at', { ascending: true })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('[getPublishedPlans]', error.message)
    return []
  }

  return (data ?? []) as DietPlanWithTrainer[]
}

/** Get a single published plan by slug */
export async function getPlanBySlug(slug: string): Promise<DietPlanWithTrainer | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('diet_plans')
    .select(`
      *,
      trainer:trainers!diet_plans_trainer_id_fkey (
        id,
        slug,
        title,
        profile:profiles!trainers_user_id_fkey (
          full_name,
          avatar_url
        )
      )
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') console.error('[getPlanBySlug]', error.message)
    return null
  }

  return data as DietPlanWithTrainer
}

/** Get a single plan by ID (used in checkout/payment flows) */
export async function getPlanById(id: string): Promise<DietPlanRow | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('diet_plans')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') console.error('[getPlanById]', error.message)
    return null
  }

  return data
}

/** Get all plans for a specific trainer (including unpublished — trainer sees own) */
export async function getTrainerPlans(trainerId: string): Promise<DietPlanRow[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('diet_plans')
    .select('*')
    .eq('trainer_id', trainerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[getTrainerPlans]', error.message)
    return []
  }

  return data ?? []
}

/** Check if the current user has already purchased a plan */
export async function hasUserPurchasedPlan(planId: string): Promise<boolean> {
  const supabase = await createClient()

  // Cast required: RPC functions not in manually-typed Database.Functions until CLI generates types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.rpc as any)('user_has_purchased', { plan_uuid: planId })

  if (error) {
    console.error('[hasUserPurchasedPlan]', error.message)
    return false
  }

  return data ?? false
}
