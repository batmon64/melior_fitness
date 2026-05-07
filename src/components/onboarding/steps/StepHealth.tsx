'use client'

import { cn } from '@/lib/utils'
import { StepWrapper, OptionCard } from '@/components/onboarding/StepWrapper'
import { Star, TrendingUp, Flame } from 'lucide-react'

const MEDICAL_CONDITIONS = [
  'Diabetes (Type 1 or 2)',
  'Hypertension',
  'Thyroid issues',
  'PCOS / PCOD',
  'Heart condition',
  'Back / spine issues',
  'Knee / joint issues',
  'Digestive issues (IBS, GERD)',
  'High cholesterol',
  'None of the above',
]

const EXPERIENCE_LEVELS = [
  {
    value: 'beginner',
    icon: <Star className="w-5 h-5" aria-hidden="true" />,
    title: 'Beginner',
    description: '0–6 months experience. Just getting started with diet and fitness.',
  },
  {
    value: 'intermediate',
    icon: <TrendingUp className="w-5 h-5" aria-hidden="true" />,
    title: 'Intermediate',
    description: '6 months – 2 years. Comfortable with training, understand the basics.',
  },
  {
    value: 'advanced',
    icon: <Flame className="w-5 h-5" aria-hidden="true" />,
    title: 'Advanced',
    description: '2+ years of consistent training. Looking to optimise and break plateaus.',
  },
]

interface StepHealthProps {
  conditions: string[]
  experienceLevel: string
  onConditionToggle: (c: string) => void
  onExperienceChange: (v: string) => void
  onNext: () => void
  onBack: () => void
  direction: number
  error?: string
}

export function StepHealth({
  conditions,
  experienceLevel,
  onConditionToggle,
  onExperienceChange,
  onNext,
  onBack,
  direction,
  error,
}: StepHealthProps) {
  return (
    <StepWrapper
      title="Health & experience"
      subtitle="This helps us flag any considerations your trainer should know about, and match the right plan complexity."
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!experienceLevel}
      direction={direction}
    >
      <div className="space-y-8">

        {/* Medical conditions */}
        <div>
          <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.15em] uppercase text-[var(--color-brand-gold)] mb-3">
            Any medical conditions? <span className="text-[var(--color-brand-muted)] normal-case tracking-normal font-normal">(select all that apply)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {MEDICAL_CONDITIONS.map((condition) => {
              const isNone = condition === 'None of the above'
              const selected = conditions.includes(condition)
              return (
                <button
                  key={condition}
                  type="button"
                  onClick={() => {
                    if (isNone) {
                      // selecting "None" clears all others
                      if (!selected) {
                        MEDICAL_CONDITIONS.filter(c => c !== 'None of the above').forEach(c => {
                          if (conditions.includes(c)) onConditionToggle(c)
                        })
                      }
                    } else {
                      // deselect "None" if selecting something else
                      if (conditions.includes('None of the above')) onConditionToggle('None of the above')
                    }
                    onConditionToggle(condition)
                  }}
                  aria-pressed={selected}
                  className={cn(
                    'px-3 py-2 rounded-xl text-xs font-[var(--font-sans)] font-medium border transition-all duration-200 cursor-pointer',
                    selected
                      ? 'bg-[rgba(202,138,4,0.15)] border-[rgba(202,138,4,0.5)] text-[var(--color-brand-gold)]'
                      : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-[var(--color-brand-muted)] hover:border-[rgba(202,138,4,0.3)] hover:text-[var(--color-brand-cream)]'
                  )}
                >
                  {condition}
                </button>
              )
            })}
          </div>
        </div>

        {/* Experience level */}
        <div>
          <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.15em] uppercase text-[var(--color-brand-gold)] mb-3">
            Fitness experience level
          </p>
          <div className="flex flex-col gap-3">
            {EXPERIENCE_LEVELS.map((level) => (
              <OptionCard
                key={level.value}
                selected={experienceLevel === level.value}
                onClick={() => onExperienceChange(level.value)}
                icon={level.icon}
                title={level.title}
                description={level.description}
              />
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-400 font-[var(--font-sans)]" role="alert">{error}</p>}
      </div>
    </StepWrapper>
  )
}
