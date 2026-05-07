'use server'

import { createClient } from '@/lib/supabase/server'
import { COACHING_SERVICES, buildWhatsAppMessage } from '@/constants/coaching'
import { TRAINER_DATA, getTrainerWhatsAppUrl } from '@/constants/trainers'
import { COACHING_GOALS } from '@/constants/coaching'

// ── Existing dashboard form action ────────────────────────────────────────────

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

// ── Full coaching request form action ─────────────────────────────────────────

export interface FullCoachingRequestParams {
  trainerSlug:       string
  serviceId:         string
  goal:              string
  currentSituation:  string
  challenges:        string
  timeline:          string
  phone:             string
  preferredContact:  string
  medicalConditions: string
  userName:          string
}

export async function submitCoachingRequestFull(
  params: FullCoachingRequestParams
): Promise<{ success: boolean; whatsappUrl?: string; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  // Validate required fields
  if (!params.trainerSlug) return { success: false, error: 'Please select a trainer' }
  if (!params.serviceId)   return { success: false, error: 'Please select a service' }
  if (!params.goal)        return { success: false, error: 'Please select your goal' }
  if (!params.currentSituation.trim())
    return { success: false, error: 'Please describe your current situation' }

  // Look up trainer in Supabase (optional — trainer_id is now nullable)
  const { data: trainerData } = await (supabase
    .from('trainers') as ReturnType<typeof supabase.from>)
    .select('id, slug')
    .eq('slug', params.trainerSlug)
    .single()

  const dbTrainer = trainerData as { id: string; slug: string } | null

  // Build the combined message
  const service     = COACHING_SERVICES.find((s) => s.id === params.serviceId)
  const goalObj     = COACHING_GOALS.find((g) => g.value === params.goal)
  const combinedMsg = `SERVICE: ${service?.name ?? params.serviceId}
GOAL: ${goalObj?.label ?? params.goal}
TIMELINE: ${params.timeline}

SITUATION:
${params.currentSituation.trim()}

CHALLENGES:
${params.challenges.trim()}

CONTACT: ${params.phone} (${params.preferredContact})
${params.medicalConditions ? `MEDICAL: ${params.medicalConditions}` : ''}`

  // Always save to coaching_requests — trainer_id is nullable now
  const { error: dbError } = await supabase
    .from('coaching_requests')
    .insert({
      user_id:           user.id,
      trainer_id:        dbTrainer?.id ?? null,    // null if trainer not in DB yet
      goal:              goalObj?.label ?? params.goal,
      message:           combinedMsg,
      service_type:      params.serviceId,
      preferred_contact: params.preferredContact,
      timeline:          params.timeline,
      challenges:        params.challenges.trim(),
      trainer_slug:      params.trainerSlug,       // always stored for reference
    } as never)

  if (dbError) {
    console.error('[submitCoachingRequestFull]', dbError.message)
    return { success: false, error: 'Failed to save request. Please try again.' }
  }

  // Update user phone if provided
  if (params.phone) {
    await supabase
      .from('profiles')
      .update({ phone: params.phone } as never)
      .eq('id', user.id)
  }

  // Build WhatsApp URL for trainer notification
  const trainerStatic = TRAINER_DATA[params.trainerSlug]
  let whatsappUrl: string | undefined

  if (trainerStatic) {
    const message = buildWhatsAppMessage({
      trainerName:      trainerStatic.name,
      serviceName:      service?.name ?? params.serviceId,
      goal:             goalObj?.label ?? params.goal,
      currentSituation: params.currentSituation.trim(),
      challenges:       params.challenges.trim(),
      timeline:         params.timeline,
      userName:         params.userName || 'A new client',
      userPhone:        params.phone,
    })
    whatsappUrl = getTrainerWhatsAppUrl(trainerStatic, message)
  }

  return { success: true, whatsappUrl }
}
