'use server'

import { createClient } from '@/lib/supabase/server'
import type { FitnessGoal, ActivityLevel, DietPreference } from '@/types/supabase'

export interface OnboardingPayload {
  phone: string
  age: number
  height_cm: number
  weight_kg: number
  fitness_goal: FitnessGoal
  activity_level: ActivityLevel
  diet_preference: DietPreference
  medical_conditions: string
  experience_level: string
}

export async function saveOnboardingData(
  payload: OnboardingPayload
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated' }

  // Input validation — belt-and-suspenders on top of client validation
  if (payload.age < 10 || payload.age > 100)
    return { success: false, error: 'Invalid age' }
  if (payload.height_cm < 100 || payload.height_cm > 250)
    return { success: false, error: 'Invalid height' }
  if (payload.weight_kg < 25 || payload.weight_kg > 300)
    return { success: false, error: 'Invalid weight' }

  const { error } = await supabase
    .from('profiles')
    .update({
      phone:                payload.phone,
      age:                  payload.age,
      height_cm:            payload.height_cm,
      weight_kg:            payload.weight_kg,
      fitness_goal:         payload.fitness_goal,
      activity_level:       payload.activity_level,
      diet_preference:      payload.diet_preference,
      onboarding_completed: true,
    } as never)
    .eq('id', user.id)

  if (error) {
    console.error('[saveOnboardingData]', error.message)
    return { success: false, error: error.message }
  }

  // Separately update the new columns (avoids TS conflict with typed schema)
  await (supabase.from('profiles') as ReturnType<typeof supabase.from>)
    .update({
      medical_conditions: payload.medical_conditions || null,
      experience_level:   payload.experience_level,
    } as never)
    .eq('id', user.id)

  return { success: true }
}
