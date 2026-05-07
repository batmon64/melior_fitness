import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { CoachingRequestsList } from '@/components/dashboard/CoachingRequestsList'
import { NewCoachingForm } from '@/components/dashboard/NewCoachingForm'
import { TRAINERS } from '@/constants/data'

export const metadata: Metadata = { title: 'Coaching' }

export default async function DashboardCoachingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch existing coaching requests
  const { data: rawRequests } = await (supabase
    .from('coaching_requests') as ReturnType<typeof supabase.from>)
    .select(`
      id, message, goal, status, trainer_note, created_at, updated_at,
      trainer:trainers!coaching_requests_trainer_id_fkey (
        id, slug,
        profile:profiles!trainers_user_id_fkey ( full_name )
      )
    `)
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const requests = (rawRequests ?? []) as {
    id: string
    message: string
    goal: string
    status: string
    trainer_note: string | null
    created_at: string
    updated_at: string
    trainer: { id: string; slug: string; profile: { full_name: string | null } | null } | null
  }[]

  // Fetch trainer IDs from Supabase for the form
  const { data: dbTrainers } = await (supabase
    .from('trainers') as ReturnType<typeof supabase.from>)
    .select('id, slug')
    .eq('is_active', true)

  const trainerOptions = (dbTrainers ?? []) as { id: string; slug: string }[]

  return (
    <div className="space-y-8">
      {/* New request form */}
      <NewCoachingForm
        staticTrainers={TRAINERS}
        dbTrainers={trainerOptions}
      />

      {/* Existing requests */}
      <CoachingRequestsList requests={requests} />
    </div>
  )
}
