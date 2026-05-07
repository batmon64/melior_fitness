'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import type { FitnessGoal, ActivityLevel, DietPreference } from '@/types/supabase'

// Phone accepts either bare 10 digits OR full +91 format — normalised before save
const schema = z.object({
  full_name:       z.string().min(2).max(100),
  phone:           z.string()
    .transform((v) => v.replace(/\D/g, ''))      // strip non-digits
    .refine((v) => v === '' || (v.length === 10 && /^[6-9]/.test(v)), {
      message: 'Please enter a valid 10-digit Indian mobile number',
    })
    .optional()
    .or(z.literal('')),
  age:             z.coerce.number().min(10).max(100),
  height_cm:       z.coerce.number().min(100).max(250),
  weight_kg:       z.coerce.number().min(25).max(300),
  fitness_goal:    z.enum(['fat_loss', 'muscle_gain', 'body_recomposition', 'general_fitness', 'athletic_performance']),
  activity_level:  z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'super_active']),
  diet_preference: z.enum(['non_vegetarian', 'vegetarian', 'vegan', 'keto', 'no_preference']),
})

export async function updateProfile(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const raw = Object.fromEntries(formData)
  const result = schema.safeParse(raw)

  if (!result.success) {
    const first = result.error.issues[0]
    return { success: false, error: `${String(first.path[0])}: ${first.message}` }
  }

  const data = result.data

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name:       data.full_name,
      // Store as +91XXXXXXXXXX if provided, null if empty
      phone:           data.phone ? `+91${data.phone}` : null,
      age:             data.age,
      height_cm:       data.height_cm,
      weight_kg:       data.weight_kg,
      fitness_goal:    data.fitness_goal as FitnessGoal,
      activity_level:  data.activity_level as ActivityLevel,
      diet_preference: data.diet_preference as DietPreference,
    } as never)
    .eq('id', user.id)

  if (error) return { success: false, error: error.message }
  return { success: true }
}
