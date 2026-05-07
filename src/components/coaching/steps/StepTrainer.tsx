'use client'

import Link from 'next/link'
import { Star, Users, Award, ArrowRight } from 'lucide-react'
import { StepWrapper } from '@/components/onboarding/StepWrapper'
import { cn } from '@/lib/utils'
import { TRAINERS } from '@/constants/data'

interface StepTrainerProps {
  value: string
  onChange: (v: string) => void
  onNext: () => void
  direction: number
}

const TRAINER_SPECIALTIES: Record<string, string[]> = {
  vishal: ['Fat Loss', 'Strength Training', 'Keto', 'Body Recomposition'],
  sharon: ['Muscle Building', 'Sports Nutrition', 'Women\'s Fitness', 'Vegetarian Plans'],
}

export function StepTrainer({ value, onChange, onNext, direction }: StepTrainerProps) {
  return (
    <StepWrapper
      title="Choose your trainer"
      subtitle="Pick the coach whose specialisation best matches your goal. You can read their full profiles first."
      onNext={onNext}
      nextDisabled={!value}
      direction={direction}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        {TRAINERS.map((trainer) => {
          const selected = value === trainer.slug
          return (
            <button
              key={trainer.slug}
              type="button"
              onClick={() => onChange(trainer.slug)}
              className={cn(
                'text-left rounded-2xl border p-5 transition-all duration-200 cursor-pointer group',
                selected
                  ? 'border-[var(--color-brand-gold)] bg-[rgba(202,138,4,0.06)] shadow-[0_0_24px_rgba(202,138,4,0.1)]'
                  : 'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(202,138,4,0.3)]'
              )}
              aria-pressed={selected}
            >
              {/* Avatar + name */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center transition-all',
                    selected ? 'bg-[var(--color-brand-gold)]' : 'bg-[rgba(202,138,4,0.15)]'
                  )}
                >
                  <span
                    className={cn(
                      'font-[var(--font-heading)] text-xl font-bold',
                      selected ? 'text-[var(--color-brand-black)]' : 'text-[var(--color-brand-gold)]'
                    )}
                  >
                    {trainer.name[0]}
                  </span>
                </div>
                <div>
                  <p className="font-[var(--font-heading)] text-lg font-bold text-[var(--color-brand-cream)]">
                    {trainer.name}
                  </p>
                  <p className="text-xs text-[var(--color-brand-gold)] font-[var(--font-sans)]">
                    {trainer.title}
                  </p>
                </div>
              </div>

              {/* Specialization */}
              <p className="text-xs font-semibold text-[var(--color-brand-muted)] font-[var(--font-sans)] mb-3">
                {trainer.specialization}
              </p>

              {/* Specialty tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(TRAINER_SPECIALTIES[trainer.slug] ?? []).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-[10px] font-[var(--font-sans)] font-medium"
                    style={{
                      background: selected ? 'rgba(202,138,4,0.15)' : 'rgba(255,255,255,0.05)',
                      color: selected ? 'var(--color-brand-gold)' : 'var(--color-brand-muted)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5 text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                  <Users className="w-3.5 h-3.5" aria-hidden="true" />
                  {trainer.clientsHelped}+ clients
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                  <Award className="w-3.5 h-3.5" aria-hidden="true" />
                  {trainer.experience} years
                </div>
                <div className="flex items-center gap-0.5 ml-auto">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[var(--color-brand-gold)] text-[var(--color-brand-gold)]" aria-hidden="true" />
                  ))}
                </div>
              </div>

              {/* Profile link */}
              <Link
                href={`/trainers/${trainer.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-[var(--color-brand-gold)] hover:underline font-[var(--font-sans)] flex items-center gap-1 cursor-pointer"
              >
                View full profile <ArrowRight className="w-3 h-3" aria-hidden="true" />
              </Link>
            </button>
          )
        })}
      </div>
    </StepWrapper>
  )
}
