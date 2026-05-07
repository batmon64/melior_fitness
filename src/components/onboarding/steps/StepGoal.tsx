'use client'

import { Flame, Dumbbell, RefreshCw, Heart, Zap } from 'lucide-react'
import { StepWrapper, OptionCard } from '@/components/onboarding/StepWrapper'
import type { FitnessGoal } from '@/types/supabase'

const GOALS: { value: FitnessGoal; icon: React.ReactNode; title: string; description: string }[] = [
  {
    value: 'fat_loss',
    icon: <Flame className="w-5 h-5" aria-hidden="true" />,
    title: 'Fat Loss',
    description: 'Lose body fat, improve definition, and feel lighter and more energetic.',
  },
  {
    value: 'muscle_gain',
    icon: <Dumbbell className="w-5 h-5" aria-hidden="true" />,
    title: 'Muscle Gain',
    description: 'Build lean muscle mass, increase strength, and improve body composition.',
  },
  {
    value: 'body_recomposition',
    icon: <RefreshCw className="w-5 h-5" aria-hidden="true" />,
    title: 'Body Recomposition',
    description: 'Lose fat and gain muscle simultaneously — the ideal transformation.',
  },
  {
    value: 'general_fitness',
    icon: <Heart className="w-5 h-5" aria-hidden="true" />,
    title: 'General Fitness',
    description: 'Improve overall health, energy, and wellbeing without extreme goals.',
  },
  {
    value: 'athletic_performance',
    icon: <Zap className="w-5 h-5" aria-hidden="true" />,
    title: 'Athletic Performance',
    description: 'Fuel your sport — optimise nutrition for strength, speed, or endurance.',
  },
]

interface StepGoalProps {
  value: FitnessGoal | ''
  onChange: (v: FitnessGoal) => void
  onNext: () => void
  onBack: () => void
  direction: number
}

export function StepGoal({ value, onChange, onNext, onBack, direction }: StepGoalProps) {
  return (
    <StepWrapper
      title="What's your main goal?"
      subtitle="This determines which trainers and plans we recommend for you."
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value}
      direction={direction}
    >
      <div className="flex flex-col gap-3">
        {GOALS.map((goal) => (
          <OptionCard
            key={goal.value}
            selected={value === goal.value}
            onClick={() => onChange(goal.value)}
            icon={goal.icon}
            title={goal.title}
            description={goal.description}
          />
        ))}
      </div>
    </StepWrapper>
  )
}
