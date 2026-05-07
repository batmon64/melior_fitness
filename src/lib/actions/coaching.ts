'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitCoachingRequestAction(params: {
  trainerId: string
  goal: string
  message: string
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('coaching_requests')
    .insert({
      user_id:    user.id,
      trainer_id: params.trainerId,
      message:    params.message,
      goal:       params.goal,
    } as never)

  if (error) {
    console.error('[submitCoachingRequest]', error.message)
    return { success: false, error: error.message }
  }

  return { success: true }
}
