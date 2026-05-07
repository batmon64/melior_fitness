import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { RequestCard } from '@/components/trainer-dashboard/RequestCard'

export const metadata: Metadata = { title: 'Coaching Requests' }

export default async function TrainerRequestsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profileData } = await supabase.from('profiles').select('full_name').eq('id', user!.id).single()
  const profile = profileData as { full_name: string | null } | null
  const name = profile?.full_name?.toLowerCase() ?? ''
  const trainerSlug = name.includes('sharon') ? 'sharon' : 'vishal'

  const { data: trainerData } = await (supabase.from('trainers') as ReturnType<typeof supabase.from>)
    .select('id').eq('user_id', user!.id).single()
  const dbTrainer = trainerData as { id: string } | null

  // Fetch requests with user profile info
  const { data: rawRequests } = dbTrainer
    ? await (supabase.from('coaching_requests') as ReturnType<typeof supabase.from>)
        .select(`
          id, goal, message, status, trainer_note, service_type,
          preferred_contact, timeline, challenges, created_at, updated_at,
          profile:profiles!coaching_requests_user_id_fkey (
            full_name, email, phone, age, weight_kg, fitness_goal, avatar_url
          )
        `)
        .eq('trainer_id', dbTrainer.id)
        .order('created_at', { ascending: false })
    : await (supabase.from('coaching_requests') as ReturnType<typeof supabase.from>)
        .select(`
          id, goal, message, status, trainer_note, service_type,
          preferred_contact, timeline, challenges, created_at, updated_at,
          profile:profiles!coaching_requests_user_id_fkey (
            full_name, email, phone, age, weight_kg, fitness_goal, avatar_url
          )
        `)
        .eq('trainer_slug', trainerSlug)
        .order('created_at', { ascending: false })

  const requests = (rawRequests ?? []) as {
    id: string
    goal: string
    message: string
    status: string
    trainer_note: string | null
    service_type: string | null
    preferred_contact: string | null
    timeline: string | null
    challenges: string | null
    created_at: string
    updated_at: string
    profile: {
      full_name: string | null
      email: string
      phone: string | null
      age: number | null
      weight_kg: number | null
      fitness_goal: string | null
    } | null
  }[]

  const pending   = requests.filter((r) => r.status === 'pending')
  const active    = requests.filter((r) => r.status === 'active')
  const completed = requests.filter((r) => r.status === 'completed' || r.status === 'cancelled')

  const groups = [
    { label: 'Pending',   color: '#FBBF24', items: pending,   badge: pending.length },
    { label: 'Active',    color: '#34D399', items: active,    badge: 0 },
    { label: 'Completed', color: '#A78BFA', items: completed, badge: 0 },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[var(--font-heading)] text-2xl font-bold text-[var(--color-brand-cream)] mb-1">
          Coaching Requests
        </h1>
        <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
          {requests.length} total · {pending.length} pending your response
        </p>
      </div>

      {requests.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="font-[var(--font-heading)] text-xl text-[var(--color-brand-cream)] mb-2">No requests yet</p>
          <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
            Share your coaching page to start receiving requests.
          </p>
        </div>
      )}

      {groups.map(({ label, color, items, badge }) =>
        items.length > 0 ? (
          <section key={label} aria-labelledby={`section-${label}`}>
            <div className="flex items-center gap-3 mb-4">
              <h2
                id={`section-${label}`}
                className="text-sm font-[var(--font-sans)] font-semibold uppercase tracking-wider"
                style={{ color }}
              >
                {label}
              </h2>
              {badge > 0 && (
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold font-[var(--font-sans)]"
                  style={{ background: `${color}20`, color }}
                >
                  {badge}
                </span>
              )}
            </div>
            <div className="space-y-4">
              {items.map((req) => (
                <RequestCard key={req.id} request={req} accentColor={color} />
              ))}
            </div>
          </section>
        ) : null
      )}
    </div>
  )
}
