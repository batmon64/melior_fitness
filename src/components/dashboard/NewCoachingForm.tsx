'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, MessageCircle, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { submitCoachingRequestAction } from '@/lib/actions/coaching'
import { getTrainerWhatsAppUrl } from '@/constants/trainers'
import { TRAINER_DATA } from '@/constants/trainers'
import type { Trainer } from '@/types'

interface NewCoachingFormProps {
  staticTrainers: Trainer[]
  /** Trainers that exist in the Supabase DB (have real UUIDs) */
  dbTrainers: { id: string; slug: string }[]
}

const GOALS = [
  'Lose 5–10 kg',
  'Lose 10+ kg',
  'Build lean muscle',
  'Body recomposition',
  'Improve athletic performance',
  'General health & fitness',
  'Postpartum recovery',
  'Plateau breakthrough',
]

export function NewCoachingForm({ staticTrainers, dbTrainers }: NewCoachingFormProps) {
  const router  = useRouter()
  const [open, setOpen]     = useState(false)
  const [loading, setLoad]  = useState(false)
  const [error, setError]   = useState('')
  const [success, setOk]    = useState(false)

  const [form, setForm] = useState({
    trainerSlug: '',
    goal:    '',
    message: '',
  })

  function change(k: keyof typeof form, v: string) {
    setForm((p) => ({ ...p, [k]: v }))
    setError('')
  }

  function validate() {
    if (!form.trainerSlug) return 'Please select a trainer'
    if (!form.goal)        return 'Please select your primary goal'
    if (form.message.trim().length < 20) return 'Please describe your situation in at least 20 characters'
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }

    // Find trainer UUID in DB
    const dbTrainer = dbTrainers.find((t) => t.slug === form.trainerSlug)
    if (!dbTrainer) {
      // Trainer not in Supabase yet — redirect to WhatsApp
      const trainerData = TRAINER_DATA[form.trainerSlug]
      if (trainerData) {
        const msg = `Hi ${trainerData.name}! I'd like to request coaching. My goal: ${form.goal}. ${form.message}`
        window.open(getTrainerWhatsAppUrl(trainerData, msg), '_blank', 'noopener,noreferrer')
      }
      return
    }

    setLoad(true)
    const result = await submitCoachingRequestAction({
      trainerId: dbTrainer.id,
      goal:    form.goal,
      message: form.message.trim(),
    })
    setLoad(false)

    if (!result.success) {
      setError(result.error ?? 'Failed to submit. Please try again.')
      return
    }

    setOk(true)
    setForm({ trainerSlug: '', goal: '', message: '' })
    setOpen(false)
    router.refresh()
    setTimeout(() => setOk(false), 4000)
  }

  const selectedTrainer = staticTrainers.find((t) => t.slug === form.trainerSlug)
  const trainerInDb     = dbTrainers.some((t) => t.slug === form.trainerSlug)

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-5 cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[rgba(167,139,250,0.12)] flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-[#A78BFA]" aria-hidden="true" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">
              Request Personal Coaching
            </p>
            <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
              Get 1-on-1 support from Vishal or Sharon
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn('w-4 h-4 text-[var(--color-brand-muted)] transition-transform duration-200', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {/* Success banner */}
      {success && (
        <div className="mx-5 mb-4 p-3 rounded-xl bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)] text-sm text-emerald-400 font-[var(--font-sans)]">
          ✓ Coaching request sent! Your trainer will respond within 24 hours.
        </div>
      )}

      {/* Form */}
      {open && (
        <form onSubmit={handleSubmit} className="px-5 pb-5 space-y-4" noValidate>
          <div className="h-px bg-[rgba(255,255,255,0.06)]" aria-hidden="true" />

          {/* Trainer selection */}
          <div className="space-y-2">
            <label className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.12em] uppercase text-[var(--color-brand-muted)]">
              Choose Trainer
            </label>
            <div className="grid sm:grid-cols-2 gap-3">
              {staticTrainers.map((trainer) => (
                <button
                  key={trainer.slug}
                  type="button"
                  onClick={() => change('trainerSlug', trainer.slug)}
                  className={cn(
                    'flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer',
                    form.trainerSlug === trainer.slug
                      ? 'border-[var(--color-brand-gold)] bg-[rgba(202,138,4,0.08)]'
                      : 'border-[rgba(255,255,255,0.07)] hover:border-[rgba(202,138,4,0.3)]'
                  )}
                  aria-pressed={form.trainerSlug === trainer.slug}
                >
                  <div className="w-9 h-9 rounded-full bg-[rgba(202,138,4,0.2)] flex items-center justify-center shrink-0">
                    <span className="font-[var(--font-heading)] font-bold text-[var(--color-brand-gold)] text-sm">
                      {trainer.name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">{trainer.name}</p>
                    <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">{trainer.specialization}</p>
                  </div>
                </button>
              ))}
            </div>
            {/* WhatsApp fallback note */}
            {selectedTrainer && !trainerInDb && (
              <p className="text-xs text-amber-400 font-[var(--font-sans)]">
                ⚡ Submitting will open WhatsApp — online coaching form coming soon.
              </p>
            )}
          </div>

          {/* Goal */}
          <div className="space-y-2">
            <label className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.12em] uppercase text-[var(--color-brand-muted)]">
              Primary Goal
            </label>
            <div className="flex flex-wrap gap-2">
              {GOALS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => change('goal', g)}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-[var(--font-sans)] font-medium border transition-all duration-150 cursor-pointer',
                    form.goal === g
                      ? 'bg-[rgba(202,138,4,0.15)] border-[rgba(202,138,4,0.5)] text-[var(--color-brand-gold)]'
                      : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-[var(--color-brand-muted)] hover:border-[rgba(202,138,4,0.3)]'
                  )}
                  aria-pressed={form.goal === g}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label htmlFor="coaching-message" className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.12em] uppercase text-[var(--color-brand-muted)]">
              Tell your trainer about yourself
            </label>
            <textarea
              id="coaching-message"
              value={form.message}
              onChange={(e) => change('message', e.target.value)}
              placeholder="Describe your current situation, diet history, schedule, any medical conditions, and what you're hoping to achieve…"
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[var(--color-brand-cream)] text-sm font-[var(--font-sans)] placeholder:text-[var(--color-brand-muted)] focus:outline-none focus:border-[var(--color-brand-gold)] transition-all resize-none"
              aria-describedby="message-hint"
            />
            <div className="flex items-center justify-between">
              <p id="message-hint" className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                Minimum 20 characters
              </p>
              <p className={cn(
                'text-xs font-[var(--font-sans)]',
                form.message.length >= 20 ? 'text-emerald-400' : 'text-[var(--color-brand-muted)]'
              )}>
                {form.message.length} chars
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-400 font-[var(--font-sans)]" role="alert">{error}</p>
          )}

          <Button type="submit" variant="primary" size="md" isLoading={loading} className="w-full sm:w-auto">
            {!loading && (
              <>
                <Send className="w-4 h-4" aria-hidden="true" />
                {trainerInDb ? 'Send Request' : 'Continue on WhatsApp'}
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  )
}
