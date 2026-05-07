import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BookOpen, ExternalLink, Users, IndianRupee, Eye, EyeOff } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = { title: 'My Plans' }

export default async function TrainerPlansPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: trainerData } = await (supabase.from('trainers') as ReturnType<typeof supabase.from>)
    .select('id').eq('user_id', user!.id).single()
  const dbTrainer = trainerData as { id: string } | null

  if (!dbTrainer) {
    return (
      <div className="space-y-6">
        <h1 className="font-[var(--font-heading)] text-2xl font-bold text-[var(--color-brand-cream)]">My Plans</h1>
        <div className="glass rounded-2xl p-8 text-center">
          <BookOpen className="w-12 h-12 text-[var(--color-brand-muted)] mx-auto mb-4" aria-hidden="true" />
          <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
            Plans will appear here once your trainer profile is linked in the database.
            Contact the admin to set this up.
          </p>
        </div>
      </div>
    )
  }

  // Fetch plans with purchase counts
  const { data: planData } = await supabase
    .from('diet_plans')
    .select('id, title, description, category, price, original_price, is_published, is_popular, duration_weeks, created_at')
    .eq('trainer_id', dbTrainer.id)
    .order('created_at', { ascending: false })

  const plans = (planData ?? []) as {
    id: string; title: string; description: string; category: string
    price: number; original_price: number | null; is_published: boolean
    is_popular: boolean; duration_weeks: number; created_at: string
  }[]

  // Fetch purchase counts per plan
  const purchaseCounts: Record<string, number> = {}
  const revenueByPlan: Record<string, number> = {}

  if (plans.length > 0) {
    const { data: purchases } = await (supabase.from('purchases') as ReturnType<typeof supabase.from>)
      .select('plan_id, amount')
      .in('plan_id', plans.map((p) => p.id))
      .eq('status', 'paid')

    for (const p of (purchases ?? []) as { plan_id: string; amount: number }[]) {
      purchaseCounts[p.plan_id]  = (purchaseCounts[p.plan_id] ?? 0) + 1
      revenueByPlan[p.plan_id]   = (revenueByPlan[p.plan_id]  ?? 0) + p.amount
    }
  }

  const CATEGORY_COLORS: Record<string, string> = {
    fat_loss: '#F97316', muscle_gain: '#A78BFA', vegetarian: '#4ADE80',
    keto: '#FBBF24', beginner: '#34D399', advanced: '#F43F5E',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[var(--font-heading)] text-2xl font-bold text-[var(--color-brand-cream)] mb-1">My Plans</h1>
          <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
            {plans.filter((p) => p.is_published).length} published · {plans.length} total
          </p>
        </div>
        <Button variant="secondary" size="sm" asChild>
          <Link href="/plans">View Marketplace <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /></Link>
        </Button>
      </div>

      {plans.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <BookOpen className="w-12 h-12 text-[var(--color-brand-muted)] mx-auto mb-4" aria-hidden="true" />
          <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">No plans created yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {plans.map((plan) => {
            const color   = CATEGORY_COLORS[plan.category] ?? '#CA8A04'
            const sales   = purchaseCounts[plan.id] ?? 0
            const revenue = revenueByPlan[plan.id] ?? 0

            return (
              <article key={plan.id} className="glass rounded-2xl p-5 flex items-start gap-5">
                {/* Category colour bar */}
                <div className="w-1 self-stretch rounded-full shrink-0" style={{ background: color }} aria-hidden="true" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-[var(--font-heading)] text-lg font-semibold text-[var(--color-brand-cream)]">
                          {plan.title}
                        </h3>
                        {plan.is_popular && <Badge variant="gold" className="text-[10px]">Popular</Badge>}
                      </div>
                      <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                        {plan.category.replace('_', ' ')} · {plan.duration_weeks} weeks
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-[var(--font-heading)] text-lg font-bold text-[var(--color-brand-cream)]">
                        {formatPrice(plan.price)}
                      </p>
                      {plan.original_price && (
                        <p className="text-xs text-[var(--color-brand-muted)] line-through font-[var(--font-sans)]">
                          {formatPrice(plan.original_price)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                      <Users className="w-3.5 h-3.5" aria-hidden="true" />
                      {sales} sale{sales !== 1 ? 's' : ''}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-[var(--font-sans)]" style={{ color }}>
                      <IndianRupee className="w-3.5 h-3.5" aria-hidden="true" />
                      {formatPrice(revenue)} earned
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                      {plan.is_published
                        ? <><Eye className="w-3.5 h-3.5" aria-hidden="true" /> Published</>
                        : <><EyeOff className="w-3.5 h-3.5" aria-hidden="true" /> Draft</>
                      }
                    </div>
                  </div>

                  <Link
                    href={`/plans/${plan.id}`}
                    className="inline-flex items-center gap-1.5 text-xs text-[var(--color-brand-gold)] hover:underline font-[var(--font-sans)] cursor-pointer"
                  >
                    View plan page <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
