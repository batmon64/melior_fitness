'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ProgressBar } from '@/components/onboarding/ProgressBar'
import { StepTrainer } from './steps/StepTrainer'
import { StepService }  from './steps/StepService'
import { StepGoals }    from './steps/StepGoals'
import { StepContact }  from './steps/StepContact'
import { StepReview }   from './steps/StepReview'
import { submitCoachingRequestFull } from '@/lib/actions/coaching'

// ── Step definitions ──────────────────────────────────────────────────────────

const STEPS = ['Trainer', 'Service', 'Goals', 'Contact', 'Review'] as const
type StepKey = (typeof STEPS)[number]

// ── Form state ────────────────────────────────────────────────────────────────

interface FormState {
  trainerSlug:       string
  serviceId:         string
  goal:              string
  currentSituation:  string
  challenges:        string
  timeline:          string
  phone:             string
  preferredContact:  string
  medicalConditions: string
}

const EMPTY: FormState = {
  trainerSlug:       '',
  serviceId:         '',
  goal:              '',
  currentSituation:  '',
  challenges:        '',
  timeline:          '',
  phone:             '',
  preferredContact:  'whatsapp',
  medicalConditions: '',
}

// ── Shell ─────────────────────────────────────────────────────────────────────

interface CoachingRequestShellProps {
  defaultTrainer?: string
  defaultService?: string
  /** Pre-filled phone from user profile */
  profilePhone?: string
  userName?: string
}

export function CoachingRequestShell({
  defaultTrainer = '',
  defaultService = '',
  profilePhone   = '',
  userName       = '',
}: CoachingRequestShellProps) {
  const router = useRouter()

  const [stepIdx, setStep]      = useState(0)
  const [direction, setDir]     = useState(1)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const [form, setForm] = useState<FormState>({
    ...EMPTY,
    trainerSlug:      defaultTrainer,
    serviceId:        defaultService,
    phone:            profilePhone.replace('+91', ''),
    preferredContact: 'whatsapp',
  })

  const currentStep: StepKey = STEPS[stepIdx]

  const set = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((p) => ({ ...p, [key]: value }))
    setError('')
  }, [])

  function goNext() {
    setDir(1)
    setStep((i) => Math.min(i + 1, STEPS.length - 1))
    setError('')
  }

  function goBack() {
    setDir(-1)
    setStep((i) => Math.max(i - 1, 0))
    setError('')
  }

  function jumpTo(idx: number) {
    setDir(idx < stepIdx ? -1 : 1)
    setStep(idx)
    setError('')
  }

  async function handleSubmit() {
    setLoading(true)
    setError('')

    const result = await submitCoachingRequestFull({
      trainerSlug:       form.trainerSlug,
      serviceId:         form.serviceId,
      goal:              form.goal,
      currentSituation:  form.currentSituation,
      challenges:        form.challenges,
      timeline:          form.timeline,
      phone:             `+91${form.phone}`,
      preferredContact:  form.preferredContact,
      medicalConditions: form.medicalConditions,
      userName,
    })

    setLoading(false)

    if (!result.success) {
      setError(result.error ?? 'Something went wrong. Please try again.')
      return
    }

    // Redirect to success page with data for WhatsApp link
    const params = new URLSearchParams({
      trainer:  form.trainerSlug,
      service:  form.serviceId,
      goal:     form.goal,
      phone:    form.phone,
      name:     userName,
    })
    router.push(`/coaching/success?${params.toString()}`)
  }

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Logo bar */}
      <header className="flex items-center justify-between px-6 py-5">
        <Link href="/coaching" className="flex items-center gap-2 cursor-pointer" aria-label="Back to Coaching">
          <div className="w-7 h-7 rounded-lg bg-[var(--color-brand-gold)] flex items-center justify-center">
            <span className="font-[var(--font-heading)] font-bold text-[var(--color-brand-black)] text-xs">M</span>
          </div>
          <span className="font-[var(--font-heading)] font-semibold text-[var(--color-brand-cream)] text-base">
            Melior
          </span>
        </Link>
        <Link
          href="/coaching"
          className="text-xs text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] font-[var(--font-sans)] transition-colors cursor-pointer"
        >
          ← Back to Coaching
        </Link>
      </header>

      {/* Progress */}
      <ProgressBar
        currentStep={stepIdx}
        totalSteps={STEPS.length}
        stepLabels={STEPS as unknown as string[]}
      />

      {/* Steps */}
      <div className="flex-1 flex flex-col justify-center overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>

          {currentStep === 'Trainer' && (
            <StepTrainer
              key="trainer"
              value={form.trainerSlug}
              onChange={(v) => set('trainerSlug', v)}
              onNext={goNext}
              direction={direction}
            />
          )}

          {currentStep === 'Service' && (
            <StepService
              key="service"
              value={form.serviceId}
              onChange={(v) => set('serviceId', v)}
              onNext={goNext}
              onBack={goBack}
              direction={direction}
            />
          )}

          {currentStep === 'Goals' && (
            <StepGoals
              key="goals"
              goal={form.goal}
              currentSituation={form.currentSituation}
              challenges={form.challenges}
              timeline={form.timeline}
              onGoalChange={(v)       => set('goal', v)}
              onSituationChange={(v)  => set('currentSituation', v)}
              onChallengesChange={(v) => set('challenges', v)}
              onTimelineChange={(v)   => set('timeline', v)}
              onNext={goNext}
              onBack={goBack}
              direction={direction}
              error={error}
            />
          )}

          {currentStep === 'Contact' && (
            <StepContact
              key="contact"
              phone={form.phone}
              preferredContact={form.preferredContact}
              medicalConditions={form.medicalConditions}
              onPhoneChange={(v)   => set('phone', v)}
              onContactChange={(v) => set('preferredContact', v)}
              onMedicalChange={(v) => set('medicalConditions', v)}
              onNext={goNext}
              onBack={goBack}
              direction={direction}
            />
          )}

          {currentStep === 'Review' && (
            <StepReview
              key="review"
              data={form}
              loading={loading}
              error={error}
              onSubmit={handleSubmit}
              onBack={goBack}
              onEditStep={jumpTo}
              direction={direction}
            />
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
