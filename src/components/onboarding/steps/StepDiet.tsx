'use client'

import { Utensils, Leaf, Sprout, Flame, Circle } from 'lucide-react'
import { StepWrapper, OptionCard } from '@/components/onboarding/StepWrapper'
import type { DietPreference } from '@/types/supabase'

const PREFERENCES: { value: DietPreference; icon: React.ReactNode; title: string; description: string }[] = [
  {
    value: 'non_vegetarian',
    icon: <Utensils className="w-5 h-5" aria-hidden="true" />,
    title: 'Non-Vegetarian',
    description: 'Includes all meats, fish, eggs, and dairy. Maximum protein flexibility.',
  },
  {
    value: 'vegetarian',
    icon: <Leaf className="w-5 h-5" aria-hidden="true" />,
    title: 'Vegetarian',
    description: 'No meat or fish. Includes dairy and eggs. Indian cuisine friendly.',
  },
  {
    value: 'vegan',
    icon: <Sprout className="w-5 h-5" aria-hidden="true" />,
    title: 'Vegan',
    description: 'Entirely plant-based. No animal products of any kind.',
  },
  {
    value: 'keto',
    icon: <Flame className="w-5 h-5" aria-hidden="true" />,
    title: 'Keto / Low Carb',
    description: 'High fat, very low carbohydrate approach. Optimised for fat adaptation.',
  },
  {
    value: 'no_preference',
    icon: <Circle className="w-5 h-5" aria-hidden="true" />,
    title: 'No Preference',
    description: "I'm flexible — let the trainer recommend what's best for my goals.",
  },
]

interface StepDietProps {
  value: DietPreference | ''
  onChange: (v: DietPreference) => void
  onNext: () => void
  onBack: () => void
  direction: number
}

export function StepDiet({ value, onChange, onNext, onBack, direction }: StepDietProps) {
  return (
    <StepWrapper
      title="Dietary preference"
      subtitle="Your meal plan will be fully tailored around what you actually eat and enjoy."
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value}
      direction={direction}
    >
      <div className="flex flex-col gap-3">
        {PREFERENCES.map((pref) => (
          <OptionCard
            key={pref.value}
            selected={value === pref.value}
            onClick={() => onChange(pref.value)}
            icon={pref.icon}
            title={pref.title}
            description={pref.description}
          />
        ))}
      </div>
    </StepWrapper>
  )
}
