import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Users, MessageCircle, BookOpen } from 'lucide-react'
import { whatsappUrl } from '@/lib/utils'

export const metadata: Metadata = { title: 'Clients' }

export default async function TrainerClientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get trainer DB record
  const { data: trainerData } = await (supabase.from('trainers') as ReturnType<typeof supabase.from>)
    .select('id').eq('user_id', user!.id).single()
  const dbTrainer = trainerData as { id: string } | null

  // Fetch clients from purchases
  let clients: {
    user_id: string
    plan_title: string
    amount: number
    created_at: string
    profile: { full_name: string | null; email: string; phone: string | null; fitness_goal: string | null; age: number | null; weight_kg: number | null } | null
  }[] = []

  if (dbTrainer) {
    const { data: planData } = await supabase
      .from('diet_plans')
      .select('id, title')
      .eq('trainer_id', dbTrainer.id)

    const plans = (planData ?? []) as { id: string; title: string }[]

    if (plans.length > 0) {
      const { data: purchaseData } = await (supabase
        .from('purchases') as ReturnType<typeof supabase.from>)
        .select(`
          user_id, amount, created_at, plan_id,
          profile:profiles!purchases_user_id_fkey (
            full_name, email, phone, fitness_goal, age, weight_kg
          )
        `)
        .in('plan_id', plans.map((p) => p.id))
        .eq('status', 'paid')
        .order('created_at', { ascending: false })

      clients = ((purchaseData ?? []) as any[]).map((p) => ({
        user_id:     p.user_id,
        plan_title:  plans.find((pl) => pl.id === p.plan_id)?.title ?? 'Plan',
        amount:      p.amount,
        created_at:  p.created_at,
        profile:     p.profile,
      }))
    }
  }

  const GOAL_LABELS: Record<string, string> = {
    fat_loss: 'Fat Loss', muscle_gain: 'Muscle Gain', body_recomposition: 'Recomp',
    general_fitness: 'Fitness', athletic_performance: 'Athletic',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[var(--font-heading)] text-2xl font-bold text-[var(--color-brand-cream)] mb-1">
          Clients
        </h1>
        <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
          {clients.length} client{clients.length !== 1 ? 's' : ''} who purchased your plans
        </p>
      </div>

      {clients.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <Users className="w-12 h-12 text-[var(--color-brand-muted)] mx-auto mb-4" aria-hidden="true" />
          <p className="font-[var(--font-heading)] text-xl text-[var(--color-brand-cream)] mb-2">No clients yet</p>
          <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
            Clients who purchase your plans will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {clients.map((client, i) => {
            const name = client.profile?.full_name ?? client.profile?.email ?? 'Client'
            const phone = client.profile?.phone
            const waLink = phone
              ? whatsappUrl(phone, `Hi ${name.split(' ')[0]}! How are you getting on with the ${client.plan_title}?`)
              : null

            return (
              <article key={`${client.user_id}-${i}`} className="glass rounded-2xl p-5 flex items-start gap-5">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-xl bg-[rgba(202,138,4,0.2)] flex items-center justify-center shrink-0">
                  <span className="font-[var(--font-heading)] text-lg font-bold text-[var(--color-brand-gold)]">
                    {name[0]}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">{name}</p>
                      <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">{client.profile?.email}</p>
                    </div>
                    <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] shrink-0">
                      {new Date(client.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="flex flex-wrap gap-3 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[rgba(202,138,4,0.1)] text-[10px] font-[var(--font-sans)] font-semibold text-[var(--color-brand-gold)]">
                      <BookOpen className="w-3 h-3" aria-hidden="true" /> {client.plan_title}
                    </span>
                    {client.profile?.fitness_goal && (
                      <span className="px-2.5 py-1 rounded-lg bg-[rgba(255,255,255,0.05)] text-[10px] font-[var(--font-sans)] text-[var(--color-brand-muted)]">
                        Goal: {GOAL_LABELS[client.profile.fitness_goal] ?? client.profile.fitness_goal}
                      </span>
                    )}
                    {client.profile?.age && (
                      <span className="px-2.5 py-1 rounded-lg bg-[rgba(255,255,255,0.05)] text-[10px] font-[var(--font-sans)] text-[var(--color-brand-muted)]">
                        {client.profile.age} yrs
                      </span>
                    )}
                    {client.profile?.weight_kg && (
                      <span className="px-2.5 py-1 rounded-lg bg-[rgba(255,255,255,0.05)] text-[10px] font-[var(--font-sans)] text-[var(--color-brand-muted)]">
                        {client.profile.weight_kg} kg
                      </span>
                    )}
                  </div>

                  {waLink && (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-[var(--font-sans)] font-medium text-[var(--color-brand-muted)] hover:text-[#25D366] transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      WhatsApp {name.split(' ')[0]}
                    </a>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
