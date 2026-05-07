'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { FitnessGoal, ActivityLevel, DietPreference } from '@/types/supabase'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface StepCompleteProps {
  data: {
    phone: string
    age: number | ''
    height_cm: number | ''
    weight_kg: number | ''
    fitness_goal: FitnessGoal | ''
    activity_level: ActivityLevel | ''
    diet_preference: DietPreference | ''
    experience_level: string
  }
}

const GOAL_LABELS: Record<FitnessGoal, string> = {
  fat_loss:              'Fat Loss',
  muscle_gain:           'Muscle Gain',
  body_recomposition:    'Body Recomposition',
  general_fitness:       'General Fitness',
  athletic_performance:  'Athletic Performance',
}

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary:         'Sedentary',
  lightly_active:    'Lightly Active',
  moderately_active: 'Moderately Active',
  very_active:       'Very Active',
  super_active:      'Super Active',
}

export function StepComplete({ data }: StepCompleteProps) {
  const router = useRouter()

  useEffect(() => {
    const t = setTimeout(() => router.push('/dashboard'), 3500)
    return () => clearTimeout(t)
  }, [router])

  const summary = [
    { label: 'Phone',         value: data.phone ? `+91 ${data.phone}` : '—' },
    { label: 'Age',           value: data.age ? `${data.age} years` : '—' },
    { label: 'Height',        value: data.height_cm ? `${data.height_cm} cm` : '—' },
    { label: 'Weight',        value: data.weight_kg ? `${data.weight_kg} kg` : '—' },
    { label: 'Goal',          value: data.fitness_goal ? GOAL_LABELS[data.fitness_goal] : '—' },
    { label: 'Activity',      value: data.activity_level ? ACTIVITY_LABELS[data.activity_level] : '—' },
    { label: 'Experience',    value: data.experience_level ? data.experience_level.charAt(0).toUpperCase() + data.experience_level.slice(1) : '—' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="w-full max-w-lg mx-auto px-4 sm:px-6 py-12 flex flex-col items-center text-center"
    >
      {/* Success icon */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
        className="w-20 h-20 rounded-full bg-[rgba(34,197,94,0.12)] border-2 border-[rgba(34,197,94,0.3)] flex items-center justify-center mb-8"
      >
        <CheckCircle className="w-10 h-10 text-emerald-400" aria-hidden="true" />
      </motion.div>

      <h2 className="font-[var(--font-heading)] text-4xl font-bold text-[var(--color-brand-cream)] mb-3">
        You&apos;re all set!
      </h2>
      <p className="text-base text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed mb-8 max-w-sm">
        Your profile is ready. We&apos;ll use this to recommend the right plans and match you with the perfect trainer.
      </p>

      {/* Summary card */}
      <div className="w-full glass rounded-2xl p-6 mb-8 text-left">
        <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.15em] uppercase text-[var(--color-brand-gold)] mb-4">
          Your Profile Summary
        </p>
        <div className="grid grid-cols-2 gap-3">
          {summary.map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">{label}</p>
              <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)] mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <Button variant="primary" size="lg" onClick={() => router.push('/dashboard')}>
        Go to Dashboard
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </Button>

      <p className="mt-4 text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
        Redirecting automatically in 3 seconds…
      </p>
    </motion.div>
  )
}
