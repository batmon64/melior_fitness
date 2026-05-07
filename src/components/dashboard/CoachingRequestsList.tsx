'use client'

import { MessageSquare, Clock, CheckCircle, XCircle, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

type CoachingStatus = 'pending' | 'active' | 'completed' | 'cancelled'

interface Request {
  id: string
  message: string
  goal: string
  status: string
  trainer_note: string | null
  created_at: string
  trainer: { id: string; slug: string; profile: { full_name: string | null } | null } | null
}

const STATUS_CONFIG: Record<CoachingStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending:   { label: 'Pending',   color: '#FBBF24', icon: <Clock className="w-3.5 h-3.5" aria-hidden="true" /> },
  active:    { label: 'Active',    color: '#34D399', icon: <Zap className="w-3.5 h-3.5" aria-hidden="true" /> },
  completed: { label: 'Completed', color: '#A78BFA', icon: <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" /> },
  cancelled: { label: 'Cancelled', color: '#F87171', icon: <XCircle className="w-3.5 h-3.5" aria-hidden="true" /> },
}

export function CoachingRequestsList({ requests }: { requests: Request[] }) {
  if (requests.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-6 h-6 text-[var(--color-brand-muted)]" aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)] mb-2">
          No coaching requests yet
        </p>
        <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
          Submit your first request above to get personalised coaching.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-[var(--font-sans)] font-semibold text-[var(--color-brand-muted)] uppercase tracking-wider">
        Your Requests ({requests.length})
      </h3>

      {requests.map((req) => {
        const status   = req.status as CoachingStatus
        const cfg      = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending
        const trainerName = req.trainer?.profile?.full_name ?? 'Trainer'

        return (
          <article key={req.id} className="glass rounded-2xl p-5 space-y-4">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[rgba(202,138,4,0.2)] flex items-center justify-center shrink-0">
                  <span className="font-[var(--font-heading)] font-bold text-[var(--color-brand-gold)] text-sm">
                    {trainerName[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">
                    Coach {trainerName}
                  </p>
                  <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                    {new Date(req.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Status badge */}
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-[var(--font-sans)] font-semibold"
                style={{ background: `${cfg.color}18`, color: cfg.color }}
              >
                {cfg.icon}
                {cfg.label}
              </div>
            </div>

            {/* Goal */}
            <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
              <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] mb-1">Goal</p>
              <p className="text-sm font-medium text-[var(--color-brand-cream)] font-[var(--font-sans)]">{req.goal}</p>
            </div>

            {/* Message preview */}
            <div>
              <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] mb-1">Your message</p>
              <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed line-clamp-3">
                {req.message}
              </p>
            </div>

            {/* Trainer note */}
            {req.trainer_note && (
              <div className="p-3 rounded-xl bg-[rgba(167,139,250,0.08)] border border-[rgba(167,139,250,0.2)]">
                <p className="text-xs font-[var(--font-sans)] font-semibold text-[#A78BFA] mb-1">
                  Trainer&apos;s Note
                </p>
                <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed">
                  {req.trainer_note}
                </p>
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}
