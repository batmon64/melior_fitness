import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { UserCheck, ExternalLink, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Trainers' }

export default async function AdminTrainersPage() {
  const supabase = await createClient()

  const { data } = await (supabase.from('trainers') as ReturnType<typeof supabase.from>)
    .select(`
      id, slug, title, specialization, experience_years, clients_helped,
      is_active, whatsapp, created_at,
      profile:profiles!trainers_user_id_fkey ( full_name, email, phone )
    `)
    .order('created_at', { ascending: false })

  const trainers = (data ?? []) as {
    id: string; slug: string; title: string; specialization: string
    experience_years: number; clients_helped: number; is_active: boolean
    whatsapp: string | null; created_at: string
    profile: { full_name: string | null; email: string; phone: string | null } | null
  }[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[var(--font-heading)] text-2xl font-bold text-[var(--color-brand-cream)] mb-1">Trainers</h1>
        <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
          {trainers.length} trainer record{trainers.length !== 1 ? 's' : ''} in the database
        </p>
      </div>

      {trainers.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <UserCheck className="w-12 h-12 text-[var(--color-brand-muted)] mx-auto mb-4" aria-hidden="true" />
          <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
            No trainer records yet. Use the SQL seed guide to create trainer profiles.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {trainers.map((trainer) => (
            <article key={trainer.id} className="glass rounded-2xl p-5 flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-[rgba(202,138,4,0.2)] flex items-center justify-center shrink-0">
                <span className="font-[var(--font-heading)] text-xl font-bold text-[var(--color-brand-gold)]">
                  {(trainer.profile?.full_name ?? trainer.slug)[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-[var(--font-heading)] text-lg font-semibold text-[var(--color-brand-cream)]">
                        {trainer.profile?.full_name ?? trainer.slug}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-[var(--font-sans)] ${trainer.is_active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-[rgba(255,255,255,0.06)] text-[var(--color-brand-muted)]'}`}>
                        {trainer.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-brand-gold)] font-[var(--font-sans)]">{trainer.title}</p>
                  </div>
                  <Link href={`/trainers/${trainer.slug}`} target="_blank"
                    className="flex items-center gap-1 text-xs text-[var(--color-brand-muted)] hover:text-[var(--color-brand-gold)] transition-colors cursor-pointer shrink-0">
                    View page <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </Link>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                  <span>{trainer.specialization}</span>
                  <span>{trainer.experience_years} yrs exp</span>
                  <span>{trainer.clients_helped} clients helped</span>
                  {trainer.profile?.email && <span>{trainer.profile.email}</span>}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
