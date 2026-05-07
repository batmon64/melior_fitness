import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { IndianRupee, TrendingUp, ShoppingCart, Calendar } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = { title: 'Revenue' }

export default async function TrainerRevenuePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: trainerData } = await (supabase.from('trainers') as ReturnType<typeof supabase.from>)
    .select('id').eq('user_id', user!.id).single()
  const dbTrainer = trainerData as { id: string } | null

  let purchases: { id: string; amount: number; created_at: string; plan_id: string }[] = []
  let planTitles: Record<string, string> = {}

  if (dbTrainer) {
    const { data: planData } = await supabase
      .from('diet_plans').select('id, title').eq('trainer_id', dbTrainer.id)
    const plans = (planData ?? []) as { id: string; title: string }[]
    planTitles = Object.fromEntries(plans.map((p) => [p.id, p.title]))

    if (plans.length > 0) {
      const { data: purchaseData } = await (supabase.from('purchases') as ReturnType<typeof supabase.from>)
        .select('id, amount, created_at, plan_id')
        .in('plan_id', plans.map((p) => p.id))
        .eq('status', 'paid')
        .order('created_at', { ascending: false })
      purchases = (purchaseData ?? []) as typeof purchases
    }
  }

  const totalRevenue = purchases.reduce((s, p) => s + p.amount, 0)
  const now          = new Date()

  // Monthly buckets (last 6 months)
  const months: { label: string; amount: number; count: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d     = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const label = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
    const relevant = purchases.filter((p) => {
      const pd = new Date(p.created_at)
      return pd.getMonth() === d.getMonth() && pd.getFullYear() === d.getFullYear()
    })
    months.push({ label, amount: relevant.reduce((s, p) => s + p.amount, 0), count: relevant.length })
  }

  const maxMonth   = Math.max(...months.map((m) => m.amount), 1)
  const thisMonth  = months[months.length - 1]
  const lastMonth  = months[months.length - 2]
  const growth     = lastMonth.amount > 0
    ? Math.round(((thisMonth.amount - lastMonth.amount) / lastMonth.amount) * 100)
    : 0

  // Revenue by plan
  const byPlan: Record<string, number> = {}
  for (const p of purchases) {
    byPlan[p.plan_id] = (byPlan[p.plan_id] ?? 0) + p.amount
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[var(--font-heading)] text-2xl font-bold text-[var(--color-brand-cream)] mb-1">Revenue</h1>
        <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
          Earnings from plan sales
        </p>
      </div>

      {/* Top stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: <IndianRupee className="w-5 h-5" aria-hidden="true" />, label: 'Total Revenue', value: formatPrice(totalRevenue), color: '#CA8A04' },
          { icon: <ShoppingCart className="w-5 h-5" aria-hidden="true" />, label: 'Total Sales', value: String(purchases.length), color: '#4ADE80' },
          { icon: <TrendingUp className="w-5 h-5" aria-hidden="true" />, label: 'This Month', value: formatPrice(thisMonth.amount), sub: growth !== 0 ? `${growth > 0 ? '+' : ''}${growth}% vs last month` : 'No change', color: '#A78BFA' },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${stat.color}18`, color: stat.color }}>
              {stat.icon}
            </div>
            <p className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-brand-cream)] mb-1">{stat.value}</p>
            <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">{stat.label}</p>
            {stat.sub && <p className="text-xs font-[var(--font-sans)] mt-0.5" style={{ color: stat.color }}>{stat.sub}</p>}
          </div>
        ))}
      </div>

      {/* Monthly bar chart */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-4 h-4 text-[var(--color-brand-gold)]" aria-hidden="true" />
          <h2 className="text-sm font-[var(--font-sans)] font-semibold text-[var(--color-brand-cream)]">Monthly Revenue</h2>
        </div>

        <div className="flex items-end gap-3 h-32">
          {months.map(({ label, amount, count }) => {
            const pct = Math.round((amount / maxMonth) * 100)
            return (
              <div key={label} className="flex-1 flex flex-col items-center gap-2">
                <p className="text-xs font-[var(--font-sans)] font-semibold text-[var(--color-brand-cream)]">
                  {amount > 0 ? formatPrice(amount).replace('₹', '₹') : '—'}
                </p>
                <div className="w-full relative flex items-end" style={{ height: '72px' }}>
                  <div
                    className="w-full rounded-t-lg transition-all duration-500"
                    style={{
                      height: `${Math.max(pct, amount > 0 ? 8 : 3)}%`,
                      background: amount > 0
                        ? 'linear-gradient(180deg, #CA8A04, #92400e)'
                        : 'rgba(255,255,255,0.05)',
                    }}
                    role="presentation"
                  />
                </div>
                <p className="text-[10px] text-[var(--color-brand-muted)] font-[var(--font-sans)]">{label}</p>
                {count > 0 && (
                  <p className="text-[10px] text-[var(--color-brand-gold)] font-[var(--font-sans)]">{count} sale{count !== 1 ? 's' : ''}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Revenue by plan */}
      {Object.keys(byPlan).length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h2 className="text-sm font-[var(--font-sans)] font-semibold text-[var(--color-brand-cream)] mb-5">Revenue by Plan</h2>
          <div className="space-y-4">
            {Object.entries(byPlan)
              .sort(([, a], [, b]) => b - a)
              .map(([planId, amount]) => {
                const pct = Math.round((amount / totalRevenue) * 100)
                return (
                  <div key={planId}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm text-[var(--color-brand-cream)] font-[var(--font-sans)]">
                        {planTitles[planId] ?? 'Plan'}
                      </span>
                      <span className="text-sm font-semibold text-[var(--color-brand-gold)] font-[var(--font-sans)]">
                        {formatPrice(amount)} <span className="text-[var(--color-brand-muted)] font-normal text-xs">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[rgba(255,255,255,0.05)] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #CA8A04, #EAB308)' }}
                        role="presentation"
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Recent transactions */}
      {purchases.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h2 className="text-sm font-[var(--font-sans)] font-semibold text-[var(--color-brand-cream)] mb-5">Recent Sales</h2>
          <div className="space-y-3">
            {purchases.slice(0, 10).map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.05)] last:border-0">
                <div>
                  <p className="text-sm text-[var(--color-brand-cream)] font-[var(--font-sans)]">
                    {planTitles[p.plan_id] ?? 'Plan'}
                  </p>
                  <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                    {new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <span className="font-[var(--font-heading)] font-bold text-[var(--color-brand-gold)]">
                  {formatPrice(p.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {purchases.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center">
          <IndianRupee className="w-12 h-12 text-[var(--color-brand-muted)] mx-auto mb-4" aria-hidden="true" />
          <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">No sales yet. Revenue will appear here once your plans are purchased.</p>
        </div>
      )}
    </div>
  )
}
