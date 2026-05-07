/**
 * Coaching request data helpers — server-side only.
 *
 * NOTE: Type casts (as unknown as X) are required because the manually-crafted
 * Database type doesn't fully satisfy Supabase v2's internal generics.
 * Replace src/types/supabase.ts with CLI-generated types once the project is connected:
 *   npx supabase gen types typescript --project-id YOUR_ID > src/types/supabase.ts
 */
import { createClient } from '@/lib/supabase/server'
import type { CoachingRequestRow, CoachingRequestWithDetails, CoachingStatus } from '@/types/supabase'

/** Submit a new coaching request */
export async function submitCoachingRequest(params: {
  trainerId: string
  message: string
  goal: string
}): Promise<{ success: boolean; data?: CoachingRequestRow; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { data, error } = await supabase
    .from('coaching_requests')
    .insert({
      user_id:    user.id,
      trainer_id: params.trainerId,
      message:    params.message,
      goal:       params.goal,
    } as never)
    .select()
    .single()

  if (error) {
    console.error('[submitCoachingRequest]', error.message)
    return { success: false, error: error.message }
  }

  return { success: true, data: data as unknown as CoachingRequestRow }
}

/** Get all coaching requests for the current user */
export async function getMyCoachingRequests(): Promise<CoachingRequestWithDetails[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('coaching_requests')
    .select(`
      *,
      trainer:trainers!coaching_requests_trainer_id_fkey (
        id, slug,
        profile:profiles!trainers_user_id_fkey ( full_name, avatar_url )
      ),
      profile:profiles!coaching_requests_user_id_fkey ( full_name, avatar_url, email )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[getMyCoachingRequests]', error.message)
    return []
  }

  return (data ?? []) as unknown as CoachingRequestWithDetails[]
}

/** Get all coaching requests assigned to the current trainer */
export async function getTrainerCoachingRequests(
  status?: CoachingStatus
): Promise<CoachingRequestWithDetails[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Find the trainer record for this user
  const { data: trainerData } = await supabase
    .from('trainers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  const trainer = trainerData as { id: string } | null
  if (!trainer) return []

  let query = supabase
    .from('coaching_requests')
    .select(`
      *,
      trainer:trainers!coaching_requests_trainer_id_fkey (
        id, slug,
        profile:profiles!trainers_user_id_fkey ( full_name, avatar_url )
      ),
      profile:profiles!coaching_requests_user_id_fkey ( full_name, avatar_url, email )
    `)
    .eq('trainer_id', trainer.id)
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('[getTrainerCoachingRequests]', error.message)
    return []
  }

  return (data ?? []) as unknown as CoachingRequestWithDetails[]
}

/** Update the status of a coaching request (trainer action) */
export async function updateCoachingStatus(
  requestId: string,
  status: CoachingStatus,
  trainerNote?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('coaching_requests')
    .update({
      status,
      ...(trainerNote !== undefined && { trainer_note: trainerNote }),
    } as never)
    .eq('id', requestId)

  if (error) {
    console.error('[updateCoachingStatus]', error.message)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/** Cancel a coaching request (user action — RLS ensures only pending requests can be cancelled) */
export async function cancelCoachingRequest(
  requestId: string
): Promise<{ success: boolean; error?: string }> {
  return updateCoachingStatus(requestId, 'cancelled')
}
