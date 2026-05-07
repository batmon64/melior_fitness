'use client'

import { Sofa, PersonStanding, Bike, Dumbbell, Zap } from 'lucide-react'
import { StepWrapper, OptionCard } from '@/components/onboarding/StepWrapper'
import type { ActivityLevel } from '@/types/supabase'

const LEVELS: { value: ActivityLevel; icon: React.ReactNode; title: string; description: string }[] = [
  {
    value: 'sedentary',
    icon: <Sofa className="w-5 h-5" aria-hidden="true" />,
    title: 'Sedentary',
    description: 'Desk job, little or no exercise. Mostly sitting throughout the day.',
  },
  {
    value: 'lightly_active',
    icon: <PersonStanding className="w-5 h-5" aria-hidden="true" />,
    title: 'Lightly Active',
    description: 'Light exercise 1–3 days/week, or a job that involves some walking.',
  },
  {
    value: 'moderately_active',
    icon: <Bike className="w-5 h-5" aria-hidden="true" />,
    title: 'Moderately Active',
    description: 'Moderate exercise 3–5 days/week. Mix of gym and daily movement.',
  },
  {
    value: 'very_active',
    icon: <Dumbbell className="w-5 h-5" aria-hidden="true" />,
    title: 'Very Active',
    description: 'Hard training 6–7 days/week, or a physically demanding job.',
  },
  {
    value: 'super_active',
    icon: <Zap className="w-5 h-5" aria-hidden="true" />,
    title: 'Super Active',
    description: 'Athlete-level training twice a day, or extremely physical work + gym.',
  },
]

interface StepActivityProps {
  value: ActivityLevel | ''
  onChange: (v: ActivityLevel) => void
  onNext: () => void
  onBack: () => void
  direction: number
}

export function StepActivity({ value, onChange, onNext, onBack, direction }: StepActivityProps) {
  return (
    <StepWrapper
      title="How active are you?"
      subtitle="Be honest — this directly determines how many calories your plan will include."
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value}
      direction={direction}
    >
      <div className="flex flex-col gap-3">
        {LEVELS.map((level) => (
          <OptionCard
            key={level.value}
            selected={value === level.value}
            onClick={() => onChange(level.value)}
            icon={level.icon}
            title={level.title}
            description={level.description}
          />
        ))}
      </div>
    </StepWrapper>
  )
}
