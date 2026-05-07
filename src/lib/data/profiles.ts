/**
 * Profile data helpers — server-side only.
 */
import { createClient } from '@/lib/supabase/server'
import type { ProfileRow, UserRole } from '@/types/supabase'

/** Get the current authenticated user's profile */
export async function getMyProfile(): Promise<ProfileRow | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') console.error('[getMyProfile]', error.message)
    return null
  }

  return data
}

/** Update the current user's profile fields */
export async function updateMyProfile(
  updates: Partial<Omit<ProfileRow, 'id' | 'email' | 'role' | 'created_at' | 'updated_at'>>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('profiles')
    .update(updates as never)
    .eq('id', user.id)

  if (error) {
    console.error('[updateMyProfile]', error.message)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/** Mark onboarding as completed */
export async function completeOnboarding(): Promise<{ success: boolean; error?: string }> {
  return updateMyProfile({ onboarding_completed: true })
}

/** Get a profile by ID (for admin/trainer views) */
export async function getProfileById(id: string): Promise<ProfileRow | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') console.error('[getProfileById]', error.message)
    return null
  }

  return data
}

/** Get the current user's role — returns null if not authenticated */
export async function getMyRole(): Promise<UserRole | null> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.rpc as any)('current_user_role')
  if (error) return null
  return data
}

/** Check if the current user has completed onboarding */
export async function hasCompletedOnboarding(): Promise<boolean> {
  const profile = await getMyProfile()
  return profile?.onboarding_completed ?? false
}
