import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { IndianRupee } from 'lucide-react'

export const metadata: Metadata = { title: 'Purchases' }

export default async function AdminPurchasesPage() {
  const supabase = await createClient()

  const { data } = await (supabase.from('purchases') as ReturnType<typeof supabase.from>)
    .select(`
      id, amount, currency, status, created_at,
      stripe_session_id, stripe_payment_intent_id,
      profile:profiles!purchases_user_id_fkey ( full_name, email ),
      diet_plan:diet_plans!purchases_plan_id_fkey ( title, slug )
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  const purchases = (data ?? []) as {
    id: string; amount: number; currency: string; status: string
    created_at: string; stripe_session_id: string | null
    profile: { full_name: string | null; email: string } | null
    diet_plan: { title: string; slug: string } | null
  }[]

  const totalRevenue = purchases.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0)

  const STATUS_COLOR: Record<string, string> = {
    paid: '#34D399', pending: '#FBBF24', failed: '#F87171', refunded: '#A78BFA',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-heading)] text-2xl font-bold text-[var(--color-brand-cream)] mb-1">Purchases</h1>
          <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
            {purchases.filter((p) => p.status === 'paid').length} paid · {purchases.length} total
          </p>
        </div>
        <div className="glass rounded-xl px-4 py-3 text-right">
          <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] mb-0.5">Total Revenue</p>
          <p className="font-[var(--font-heading)] text-xl font-bold text-[var(--color-brand-gold)]">
            {formatPrice(totalRevenue)}
          </p>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.06)]">
          {[['Customer', '3'], ['Plan', '3'], ['Amount', '2'], ['Status', '2'], ['Date', '2']].map(([h, span]) => (
            <p key={h} className={`col-span-${span} text-[10px] font-[var(--font-sans)] font-semibold uppercase tracking-wider text-[var(--color-brand-muted)]`}>{h}</p>
          ))}
        </div>

        {purchases.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <IndianRupee className="w-10 h-10 text-[var(--color-brand-muted)] mx-auto mb-3" aria-hidden="true" />
            <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">No purchases yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-[rgba(255,255,255,0.04)]">
            {purchases.map((p) => {
              const color = STATUS_COLOR[p.status] ?? '#CA8A04'
              return (
                <div key={p.id} className="grid grid-cols-12 gap-4 px-5 py-3.5 items-center hover:bg-[rgba(255,255,255,0.02)]">
                  <div className="col-span-3 min-w-0">
                    <p className="text-sm text-[var(--color-brand-cream)] font-[var(--font-sans)] truncate">
                      {p.profile?.full_name ?? '—'}
                    </p>
                    <p className="text-[10px] text-[var(--color-brand-muted)] font-[var(--font-sans)] truncate">{p.profile?.email}</p>
                  </div>
                  <p className="col-span-3 text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] truncate">
                    {p.diet_plan?.title ?? 'Unknown plan'}
                  </p>
                  <p className="col-span-2 text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">
                    {formatPrice(p.amount)}
                  </p>
                  <div className="col-span-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-[var(--font-sans)] capitalize"
                      style={{ background: `${color}18`, color }}>
                      {p.status}
                    </span>
                  </div>
                  <p className="col-span-2 text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                    {new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
