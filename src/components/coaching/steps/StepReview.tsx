'use client'

import { motion } from 'framer-motion'
import { Loader2, Send, MessageCircle, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { COACHING_SERVICES } from '@/constants/coaching'
import { TRAINERS } from '@/constants/data'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const GOAL_LABELS: Record<string, string> = {
  fat_loss: 'Lose Body Fat', muscle_gain: 'Build Muscle', body_recomposition: 'Body Recomposition',
  athletic: 'Athletic Performance', general_fitness: 'General Fitness', postpartum: 'Postpartum Recovery',
  plateau: 'Break a Plateau', wedding: 'Wedding / Event Prep',
}

const TIMELINE_LABELS: Record<string, string> = {
  asap: 'ASAP', '2_weeks': 'In 2 weeks', '1_month': 'Next month', flexible: 'Flexible',
}

const CONTACT_LABELS: Record<string, string> = {
  whatsapp: 'WhatsApp', email: 'Email', call: 'Phone Call',
}

interface ReviewData {
  trainerSlug:      string
  serviceId:        string
  goal:             string
  currentSituation: string
  challenges:       string
  timeline:         string
  phone:            string
  preferredContact: string
  medicalConditions: string
}

interface StepReviewProps {
  data:      ReviewData
  loading:   boolean
  error:     string
  onSubmit:  () => void
  onBack:    () => void
  onEditStep: (step: number) => void
  direction: number
}

export function StepReview({ data, loading, error, onSubmit, onBack, onEditStep, direction }: StepReviewProps) {
  const trainer = TRAINERS.find((t) => t.slug === data.trainerSlug)
  const service = COACHING_SERVICES.find((s) => s.id === data.serviceId)

  const sections = [
    {
      step: 0,
      title: 'Trainer',
      content: trainer?.name ?? '—',
      sub: trainer?.specialization,
    },
    {
      step: 1,
      title: 'Service',
      content: service?.name ?? '—',
      sub: service?.priceLabel,
    },
    {
      step: 2,
      title: 'Goal',
      content: GOAL_LABELS[data.goal] ?? data.goal,
      sub: TIMELINE_LABELS[data.timeline],
    },
    {
      step: 3,
      title: 'Contact',
      content: `+91 ${data.phone}`,
      sub: `Preferred: ${CONTACT_LABELS[data.preferredContact] ?? data.preferredContact}`,
    },
  ]

  return (
    <motion.div
      key="review"
      custom={direction}
      initial={{ x: direction > 0 ? 48 : -48, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: direction > 0 ? -48 : 48, opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8"
    >
      {/* Heading */}
      <div className="mb-8">
        <h2 className="font-[var(--font-heading)] text-3xl md:text-4xl font-bold text-[var(--color-brand-cream)] mb-3">
          Review your request
        </h2>
        <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
          Check everything looks right before submitting.
        </p>
      </div>

      {/* Summary grid */}
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        {sections.map(({ step, title, content, sub }) => (
          <div
            key={title}
            className="glass rounded-xl p-4 flex items-start justify-between gap-3"
          >
            <div>
              <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.12em] uppercase text-[var(--color-brand-muted)] mb-1">
                {title}
              </p>
              <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">
                {content}
              </p>
              {sub && (
                <p className="text-xs text-[var(--color-brand-gold)] font-[var(--font-sans)] mt-0.5">
                  {sub}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onEditStep(step)}
              className="text-[var(--color-brand-muted)] hover:text-[var(--color-brand-gold)] transition-colors cursor-pointer shrink-0"
              aria-label={`Edit ${title}`}
            >
              <Edit3 className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>

      {/* Message preview */}
      <div className="glass rounded-xl p-5 mb-8">
        <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.12em] uppercase text-[var(--color-brand-muted)] mb-3">
          Your Message to {trainer?.name}
        </p>
        <div className="space-y-3">
          <div>
            <p className="text-[10px] text-[var(--color-brand-muted)] font-[var(--font-sans)] uppercase tracking-wider mb-1">Situation</p>
            <p className="text-sm text-[var(--color-brand-cream)] font-[var(--font-sans)] leading-relaxed line-clamp-3">
              {data.currentSituation}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-[var(--color-brand-muted)] font-[var(--font-sans)] uppercase tracking-wider mb-1">Challenge</p>
            <p className="text-sm text-[var(--color-brand-cream)] font-[var(--font-sans)] leading-relaxed line-clamp-2">
              {data.challenges}
            </p>
          </div>
          {data.medicalConditions && (
            <div>
              <p className="text-[10px] text-[var(--color-brand-muted)] font-[var(--font-sans)] uppercase tracking-wider mb-1">Medical</p>
              <p className="text-sm text-[var(--color-brand-cream)] font-[var(--font-sans)]">{data.medicalConditions}</p>
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp note */}
      <div className="glass rounded-xl p-4 mb-8 flex items-start gap-3">
        <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed">
          After submitting, you&apos;ll get a <strong className="text-[var(--color-brand-cream)]">one-tap WhatsApp link</strong> to send your request directly to {trainer?.name}.
          Your trainer will respond within <strong className="text-[var(--color-brand-cream)]">24 hours</strong>.
        </p>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400 font-[var(--font-sans)] mb-4" role="alert">{error}</p>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="md" onClick={onBack}>← Back</Button>

        <button
          onClick={onSubmit}
          disabled={loading}
          className={cn(
            'inline-flex items-center gap-2.5 h-13 px-8 rounded-[var(--radius-btn)]',
            'bg-[var(--color-brand-gold)] text-[var(--color-brand-black)] font-[var(--font-sans)] font-semibold text-lg',
            'shadow-[0_0_24px_rgba(202,138,4,0.3)] hover:shadow-[0_0_36px_rgba(202,138,4,0.5)]',
            'hover:bg-[var(--color-brand-gold-lt)] transition-all duration-200 cursor-pointer',
            'disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none',
            'active:scale-[0.98]'
          )}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              Submitting…
            </>
          ) : (
            <>
              <Send className="w-5 h-5" aria-hidden="true" />
              Submit Request
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}
