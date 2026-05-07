import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { AdminTestimonialsTable } from '@/components/admin/AdminTestimonialsTable'

export const metadata: Metadata = { title: 'Testimonials' }

export default async function AdminTestimonialsPage() {
  const supabase = await createClient()

  const { data } = await (supabase.from('testimonials') as ReturnType<typeof supabase.from>)
    .select('id, display_name, location, quote, before_weight, after_weight, weight_lost, duration, rating, is_published, created_at, trainer_id')
    .order('created_at', { ascending: false })

  const testimonials = (data ?? []) as Parameters<typeof AdminTestimonialsTable>[0]['testimonials']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[var(--font-heading)] text-2xl font-bold text-[var(--color-brand-cream)] mb-1">Testimonials</h1>
        <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
          {testimonials.filter((t) => t.is_published).length} published · {testimonials.filter((t) => !t.is_published).length} pending approval
        </p>
      </div>
      <AdminTestimonialsTable testimonials={testimonials} />
    </div>
  )
}
