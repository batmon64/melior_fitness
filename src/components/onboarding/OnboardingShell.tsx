'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ProgressBar } from './ProgressBar'
import { StepWelcome } from './steps/StepWelcome'
import { StepPhone } from './steps/StepPhone'
import { StepAge } from './steps/StepAge'
import { StepMetrics } from './steps/StepMetrics'
import { StepGoal } from './steps/StepGoal'
import { StepActivity } from './steps/StepActivity'
import { StepDiet } from './steps/StepDiet'
import { StepHealth } from './steps/StepHealth'
import { StepComplete } from './steps/StepComplete'
import { saveOnboardingData } from '@/lib/actions/onboarding'
import type { FitnessGoal, ActivityLevel, DietPreference } from '@/types/supabase'

// ── Step definitions ──────────────────────────────────────────────────────────

const STEPS = [
  'Welcome',
  'Phone',
  'Age',
  'Metrics',
  'Goal',
  'Activity',
  'Diet',
  'Health',
  'Done',
] as const

type StepKey = (typeof STEPS)[number]

// ── Form state ────────────────────────────────────────────────────────────────

interface FormState {
  phone:              string
  age:                number | ''
  height_cm:          number | ''
  weight_kg:          number | ''
  fitness_goal:       FitnessGoal | ''
  activity_level:     ActivityLevel | ''
  diet_preference:    DietPreference | ''
  medical_conditions: string[]
  experience_level:   string
}

const INITIAL_STATE: FormState = {
  phone:              '',
  age:                '',
  height_cm:          '',
  weight_kg:          '',
  fitness_goal:       '',
  activity_level:     '',
  diet_preference:    '',
  medical_conditions: [],
  experience_level:   '',
}

// ── Shell component ───────────────────────────────────────────────────────────

interface OnboardingShellProps {
  userId: string
  userName: string
}

export function OnboardingShell({ userId: _userId, userName }: OnboardingShellProps) {
  const [stepIdx, setStepIdx]     = useState(0)
  const [direction, setDir]       = useState(1)   // 1 = forward, -1 = backward
  const [form, setForm]           = useState<FormState>(INITIAL_STATE)
  const [error, setError]         = useState('')
  const [submitting, setSub]      = useState(false)
  const [completed, setCompleted] = useState(false)

  const currentStep: StepKey = STEPS[stepIdx]

  // Progress bar shows steps between Welcome and Done (Phone → Health)
  const progressSteps = STEPS.slice(1, -1)   // 'Phone' … 'Health'

  // ── Navigation ──────────────────────────────────────────────────────────────

  const goNext = useCallback(async () => {
    setError('')

    if (currentStep === 'Health') {
      setSub(true)
      const result = await saveOnboardingData({
        phone:              `+91${form.phone}`,
        age:                form.age as number,
        height_cm:          form.height_cm as number,
        weight_kg:          form.weight_kg as number,
        fitness_goal:       form.fitness_goal as FitnessGoal,
        activity_level:     form.activity_level as ActivityLevel,
        diet_preference:    form.diet_preference as DietPreference,
        medical_conditions: form.medical_conditions
          .filter(c => c !== 'None of the above')
          .join(', '),
        experience_level:   form.experience_level,
      })
      setSub(false)

      if (!result.success) {
        setError(result.error ?? 'Something went wrong. Please try again.')
        return
      }

      setCompleted(true)
    }

    setDir(1)
    setStepIdx((i) => Math.min(i + 1, STEPS.length - 1))
  }, [currentStep, form])

  const goBack = useCallback(() => {
    setDir(-1)
    setStepIdx((i) => Math.max(i - 1, 0))
    setError('')
  }, [])

  // ── Field updaters ───────────────────────────────────────────────────────────

  const set = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  const toggleCondition = useCallback((condition: string) => {
    setForm((prev) => ({
      ...prev,
      medical_conditions: prev.medical_conditions.includes(condition)
        ? prev.medical_conditions.filter((c) => c !== condition)
        : [...prev.medical_conditions, condition],
    }))
  }, [])

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Logo bar */}
      <header className="flex items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 cursor-pointer" aria-label="Melior Fitness home">
          <div className="w-7 h-7 rounded-lg bg-[var(--color-brand-gold)] flex items-center justify-center">
            <span className="font-[var(--font-heading)] font-bold text-[var(--color-brand-black)] text-xs">M</span>
          </div>
          <span className="font-[var(--font-heading)] font-semibold text-[var(--color-brand-cream)] text-base">Melior</span>
        </Link>

        {/* Skip for now */}
        {stepIdx > 0 && stepIdx < STEPS.length - 1 && (
          <button
            onClick={() => { setDir(1); setStepIdx(STEPS.length - 1) }}
            className="text-xs text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] font-[var(--font-sans)] transition-colors cursor-pointer"
          >
            Skip for now
          </button>
        )}
      </header>

      {/* Progress bar — after welcome, before complete */}
      {stepIdx > 0 && stepIdx < STEPS.length - 1 && (
        <ProgressBar
          currentStep={stepIdx - 1}
          totalSteps={progressSteps.length}
          stepLabels={progressSteps as unknown as string[]}
        />
      )}

      {/* Step content */}
      <div className="flex-1 flex flex-col justify-center overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>

          {currentStep === 'Welcome' && (
            <StepWelcome
              key="welcome"
              userName={userName}
              onNext={goNext}
              direction={direction}
            />
          )}

          {currentStep === 'Phone' && (
            <StepPhone
              key="phone"
              value={form.phone}
              onChange={(v) => set('phone', v)}
              onNext={goNext}
              onBack={goBack}
              direction={direction}
              error={error}
            />
          )}

          {currentStep === 'Age' && (
            <StepAge
              key="age"
              value={form.age}
              onChange={(v) => set('age', v)}
              onNext={goNext}
              onBack={goBack}
              direction={direction}
              error={error}
            />
          )}

          {currentStep === 'Metrics' && (
            <StepMetrics
              key="metrics"
              height={form.height_cm}
              weight={form.weight_kg}
              onHeightChange={(v) => set('height_cm', v)}
              onWeightChange={(v) => set('weight_kg', v)}
              onNext={goNext}
              onBack={goBack}
              direction={direction}
              error={error}
            />
          )}

          {currentStep === 'Goal' && (
            <StepGoal
              key="goal"
              value={form.fitness_goal}
              onChange={(v) => set('fitness_goal', v)}
              onNext={goNext}
              onBack={goBack}
              direction={direction}
            />
          )}

          {currentStep === 'Activity' && (
            <StepActivity
              key="activity"
              value={form.activity_level}
              onChange={(v) => set('activity_level', v)}
              onNext={goNext}
              onBack={goBack}
              direction={direction}
            />
          )}

          {currentStep === 'Diet' && (
            <StepDiet
              key="diet"
              value={form.diet_preference}
              onChange={(v) => set('diet_preference', v)}
              onNext={goNext}
              onBack={goBack}
              direction={direction}
            />
          )}

          {currentStep === 'Health' && (
            <StepHealth
              key="health"
              conditions={form.medical_conditions}
              experienceLevel={form.experience_level}
              onConditionToggle={toggleCondition}
              onExperienceChange={(v) => set('experience_level', v)}
              onNext={goNext}
              onBack={goBack}
              direction={direction}
              error={error}
            />
          )}

          {(currentStep === 'Done' || completed) && (
            <StepComplete
              key="done"
              data={form}
            />
          )}

        </AnimatePresence>
      </div>

      {/* Global submission error */}
      {error && currentStep === 'Health' && (
        <div className="px-6 pb-4 text-center">
          <p className="text-sm text-red-400 font-[var(--font-sans)]" role="alert">{error}</p>
        </div>
      )}
    </div>
  )
}
