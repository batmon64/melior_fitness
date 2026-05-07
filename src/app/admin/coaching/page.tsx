import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { MessageSquare } from 'lucide-react'

export const metadata: Metadata = { title: 'Coaching Requests' }

export default async function AdminCoachingPage() {
  const supabase = await createClient()

  const { data } = await (supabase.from('coaching_requests') as ReturnType<typeof supabase.from>)
    .select(`
      id, goal, status, service_type, trainer_slug, timeline,
      preferred_contact, created_at, updated_at,
      profile:profiles!coaching_requests_user_id_fkey ( full_name, email, phone )
    `)
    .order('created_at', { ascending: false })

  const requests = (data ?? []) as {
    id: string; goal: string; status: string; service_type: string | null
    trainer_slug: string | null; timeline: string | null
    preferred_contact: string | null; created_at: string
    profile: { full_name: string | null; email: string; phone: string | null } | null
  }[]

  const STATUS_COLOR: Record<string, string> = {
    pending: '#FBBF24', active: '#34D399', completed: '#A78BFA', cancelled: '#F87171',
  }

  const SERVICE_LABEL: Record<string, string> = {
    personal_training: 'Personal', diet_plan: 'Diet Plan', consultation_call: 'Call',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[var(--font-heading)] text-2xl font-bold text-[var(--color-brand-cream)] mb-1">Coaching Requests</h1>
        <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
          {requests.filter((r) => r.status === 'pending').length} pending · {requests.length} total
        </p>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.06)]">
          {[['Client', '3'], ['Goal', '3'], ['Service', '2'], ['Trainer', '2'], ['Status', '1'], ['Date', '1']].map(([h, span]) => (
            <p key={h} className={`col-span-${span} text-[10px] font-[var(--font-sans)] font-semibold uppercase tracking-wider text-[var(--color-brand-muted)]`}>{h}</p>
          ))}
        </div>

        {requests.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <MessageSquare className="w-10 h-10 text-[var(--color-brand-muted)] mx-auto mb-3" aria-hidden="true" />
            <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">No coaching requests yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-[rgba(255,255,255,0.04)]">
            {requests.map((req) => {
              const statusColor = STATUS_COLOR[req.status] ?? '#CA8A04'
              return (
                <div key={req.id} className="grid grid-cols-12 gap-4 px-5 py-3.5 items-center hover:bg-[rgba(255,255,255,0.02)]">
                  <div className="col-span-3 min-w-0">
                    <p className="text-sm text-[var(--color-brand-cream)] font-[var(--font-sans)] truncate">
                      {req.profile?.full_name ?? '—'}
                    </p>
                    <p className="text-[10px] text-[var(--color-brand-muted)] font-[var(--font-sans)] truncate">{req.profile?.email}</p>
                  </div>
                  <p className="col-span-3 text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] truncate">{req.goal || '—'}</p>
                  <p className="col-span-2 text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                    {req.service_type ? SERVICE_LABEL[req.service_type] ?? req.service_type : '—'}
                  </p>
                  <p className="col-span-2 text-xs font-[var(--font-sans)] text-[var(--color-brand-gold)] capitalize">
                    {req.trainer_slug ?? '—'}
                  </p>
                  <div className="col-span-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-[var(--font-sans)] capitalize"
                      style={{ background: `${statusColor}18`, color: statusColor }}>
                      {req.status}
                    </span>
                  </div>
                  <p className="col-span-1 text-[10px] text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                    {new Date(req.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
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
