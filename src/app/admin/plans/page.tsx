import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { AdminPlansTable } from '@/components/admin/AdminPlansTable'

export const metadata: Metadata = { title: 'Diet Plans' }

export default async function AdminPlansPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('diet_plans')
    .select('id, title, slug, category, price, is_published, is_popular, duration_weeks, created_at, trainer_id')
    .order('created_at', { ascending: false })

  const plans = (data ?? []) as Parameters<typeof AdminPlansTable>[0]['plans']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[var(--font-heading)] text-2xl font-bold text-[var(--color-brand-cream)] mb-1">Diet Plans</h1>
        <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
          {plans.filter((p) => p.is_published).length} published · {plans.length} total
        </p>
      </div>
      <AdminPlansTable plans={plans} />
    </div>
  )
}
