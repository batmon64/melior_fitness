'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle, Clock, ChevronDown, ChevronUp, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

const SERVICE_LABELS: Record<string, string> = {
  personal_training: 'Personal Coaching',
  diet_plan:         'Custom Diet Plan',
  consultation_call: 'Consultation Call',
}

const GOAL_MAP: Record<string, string> = {
  fat_loss: 'Lose Body Fat', muscle_gain: 'Build Muscle',
  body_recomposition: 'Body Recomposition', athletic: 'Athletic Performance',
  general_fitness: 'General Fitness', postpartum: 'Postpartum Recovery',
  plateau: 'Break a Plateau', wedding: 'Wedding / Event Prep',
}

type ReqStatus = 'pending' | 'active' | 'completed' | 'cancelled'

interface Request {
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
  profile: {
    full_name: string | null
    email: string
    phone: string | null
    age: number | null
    weight_kg: number | null
    fitness_goal: string | null
  } | null
}

interface RequestCardProps {
  request: Request
  accentColor: string
}

export function RequestCard({ request, accentColor }: RequestCardProps) {
  const router   = useRouter()
  const [expanded, setExpanded] = useState(request.status === 'pending')
  const [note, setNote]         = useState(request.trainer_note ?? '')
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)

  async function updateStatus(status: ReqStatus) {
    setSaving(true)
    try {
      await fetch('/api/trainer/update-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: request.id, status, trainerNote: note }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  async function saveNote() {
    setSaving(true)
    try {
      await fetch('/api/trainer/update-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: request.id, status: request.status, trainerNote: note }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  const client     = request.profile
  const clientName = client?.full_name ?? client?.email ?? 'Unknown client'
  const waContact  = client?.phone
    ? `https://wa.me/${client.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${clientName?.split(' ')[0]}! I've reviewed your coaching request. Let's get started!`)}`
    : null

  return (
    <article className="glass rounded-2xl overflow-hidden">
      {/* Header row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 p-5 cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-colors text-left"
        aria-expanded={expanded}
      >
        {/* Client avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-[var(--font-heading)] font-bold"
          style={{ background: `${accentColor}20`, color: accentColor }}
          aria-hidden="true"
        >
          {clientName[0]}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)] truncate">
            {clientName}
          </p>
          <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
            {GOAL_MAP[request.goal] ?? request.goal}
            {request.service_type && ` · ${SERVICE_LABELS[request.service_type] ?? request.service_type}`}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] hidden sm:block">
            {new Date(request.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-bold font-[var(--font-sans)] capitalize"
            style={{ background: `${accentColor}18`, color: accentColor }}
          >
            {request.status}
          </span>
          {expanded
            ? <ChevronUp className="w-4 h-4 text-[var(--color-brand-muted)]" aria-hidden="true" />
            : <ChevronDown className="w-4 h-4 text-[var(--color-brand-muted)]" aria-hidden="true" />
          }
        </div>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="px-5 pb-5 space-y-5">
          <div className="h-px bg-[rgba(255,255,255,0.06)]" aria-hidden="true" />

          {/* Client info */}
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { label: 'Email',   value: client?.email ?? '—' },
              { label: 'Phone',   value: client?.phone ?? '—' },
              { label: 'Contact', value: request.preferred_contact ?? 'WhatsApp' },
              { label: 'Age',     value: client?.age ? `${client.age} yrs` : '—' },
              { label: 'Weight',  value: client?.weight_kg ? `${client.weight_kg} kg` : '—' },
              { label: 'Timeline', value: request.timeline ?? '—' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[rgba(255,255,255,0.03)] rounded-xl p-3">
                <p className="text-[10px] text-[var(--color-brand-muted)] font-[var(--font-sans)] uppercase tracking-wider mb-1">{label}</p>
                <p className="text-xs font-medium text-[var(--color-brand-cream)] font-[var(--font-sans)]">{value}</p>
              </div>
            ))}
          </div>

          {/* Message */}
          <div>
            <p className="text-[10px] text-[var(--color-brand-muted)] font-[var(--font-sans)] uppercase tracking-wider mb-2">Client's Message</p>
            <div className="bg-[rgba(255,255,255,0.03)] rounded-xl p-4">
              <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed whitespace-pre-wrap">
                {request.message}
              </p>
            </div>
          </div>

          {/* Trainer note */}
          <div>
            <p className="text-[10px] text-[var(--color-brand-muted)] font-[var(--font-sans)] uppercase tracking-wider mb-2">Your Note (visible to client)</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note for the client — e.g. next steps, what you'll prepare, when you'll be in touch…"
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[var(--color-brand-cream)] text-sm font-[var(--font-sans)] placeholder:text-[var(--color-brand-muted)] focus:outline-none focus:border-[var(--color-brand-gold)] transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {request.status === 'pending' && (
              <>
                <Button
                  variant="primary" size="sm"
                  isLoading={saving}
                  onClick={() => updateStatus('active')}
                >
                  {!saving && <><Check className="w-4 h-4" aria-hidden="true" /> Accept</>}
                </Button>
                <Button
                  variant="ghost" size="sm"
                  onClick={() => updateStatus('cancelled')}
                  disabled={saving}
                  className="text-red-400 hover:text-red-300"
                >
                  Decline
                </Button>
              </>
            )}
            {request.status === 'active' && (
              <Button
                variant="secondary" size="sm"
                isLoading={saving}
                onClick={() => updateStatus('completed')}
              >
                {!saving && 'Mark Completed'}
              </Button>
            )}
            <Button variant="glass" size="sm" onClick={saveNote} isLoading={saving && !saved}>
              {saved
                ? <><Check className="w-4 h-4 text-emerald-400" aria-hidden="true" /> Saved</>
                : 'Save Note'
              }
            </Button>

            {/* WhatsApp contact */}
            {waContact && (
              <a
                href={waContact}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg glass text-xs font-[var(--font-sans)] font-medium text-[var(--color-brand-cream)] hover:border-[rgba(37,211,102,0.4)] transition-all cursor-pointer ml-auto"
              >
                <MessageCircle className="w-4 h-4" style={{ color: '#25D366' }} aria-hidden="true" />
                WhatsApp Client
              </a>
            )}
          </div>
        </div>
      )}
    </article>
  )
}
