/**
 * Trainer data helpers — server-side only.
 * All functions use the server Supabase client (reads cookies).
 */
import { createClient } from '@/lib/supabase/server'
import type { TrainerRow, ProfileRow } from '@/types/supabase'

export type TrainerWithProfile = TrainerRow & {
  profile: Pick<ProfileRow, 'full_name' | 'avatar_url' | 'email'>
}

/** Get all active trainers with their linked profile */
export async function getTrainers(): Promise<TrainerWithProfile[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('trainers')
    .select(`
      *,
      profile:profiles!trainers_user_id_fkey (
        full_name,
        avatar_url,
        email
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[getTrainers]', error.message)
    return []
  }

  return (data ?? []) as TrainerWithProfile[]
}

/** Get a single trainer by slug */
export async function getTrainerBySlug(slug: string): Promise<TrainerWithProfile | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('trainers')
    .select(`
      *,
      profile:profiles!trainers_user_id_fkey (
        full_name,
        avatar_url,
        email
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') console.error('[getTrainerBySlug]', error.message)
    return null
  }

  return data as TrainerWithProfile
}

/** Get trainer record for the currently authenticated user */
export async function getMyTrainerRecord(): Promise<TrainerRow | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('trainers')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') console.error('[getMyTrainerRecord]', error.message)
    return null
  }

  return data
}
