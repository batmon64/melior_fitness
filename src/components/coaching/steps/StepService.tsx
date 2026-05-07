'use client'

import { Dumbbell, Apple, Video, Check } from 'lucide-react'
import { StepWrapper } from '@/components/onboarding/StepWrapper'
import { cn } from '@/lib/utils'
import { COACHING_SERVICES } from '@/constants/coaching'

const ICON_MAP: Record<string, React.ReactNode> = {
  Dumbbell: <Dumbbell className="w-6 h-6" aria-hidden="true" />,
  Apple:    <Apple    className="w-6 h-6" aria-hidden="true" />,
  Video:    <Video    className="w-6 h-6" aria-hidden="true" />,
}

interface StepServiceProps {
  value: string
  onChange: (v: string) => void
  onNext: () => void
  onBack: () => void
  direction: number
}

export function StepService({ value, onChange, onNext, onBack, direction }: StepServiceProps) {
  return (
    <StepWrapper
      title="What kind of support do you need?"
      subtitle="Choose the service that fits your goal and budget. You can always upgrade later."
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value}
      direction={direction}
    >
      <div className="flex flex-col gap-4">
        {COACHING_SERVICES.map((service) => {
          const selected = value === service.id
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onChange(service.id)}
              className={cn(
                'text-left rounded-2xl border p-5 transition-all duration-200 cursor-pointer',
                selected
                  ? 'border-[var(--color-brand-gold)] bg-[rgba(202,138,4,0.06)]'
                  : 'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(202,138,4,0.3)]'
              )}
              aria-pressed={selected}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all"
                  style={{
                    background: selected ? `${service.accentColor}20` : 'rgba(255,255,255,0.05)',
                    color: selected ? service.accentColor : 'var(--color-brand-muted)',
                  }}
                >
                  {ICON_MAP[service.icon] ?? <Dumbbell className="w-6 h-6" aria-hidden="true" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <p className={cn(
                      'font-[var(--font-heading)] text-lg font-semibold transition-colors',
                      selected ? 'text-[var(--color-brand-cream)]' : 'text-[var(--color-brand-muted)]'
                    )}>
                      {service.name}
                    </p>
                    <span
                      className="text-xs font-[var(--font-sans)] font-bold shrink-0"
                      style={{ color: service.accentColor }}
                    >
                      {service.priceLabel}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed mb-3">
                    {service.description}
                  </p>

                  {/* Duration */}
                  <p className="text-xs font-[var(--font-sans)] font-medium mb-3" style={{ color: service.accentColor }}>
                    {service.duration}
                  </p>

                  {/* Top 3 includes */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {service.includes.slice(0, 3).map((item) => (
                      <span key={item} className="flex items-center gap-1.5 text-[10px] text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                        <Check className="w-3 h-3 shrink-0" style={{ color: service.accentColor }} aria-hidden="true" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Selection indicator */}
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all"
                  style={{
                    borderColor: selected ? 'var(--color-brand-gold)' : 'rgba(255,255,255,0.15)',
                    background: selected ? 'var(--color-brand-gold)' : 'transparent',
                  }}
                  aria-hidden="true"
                >
                  {selected && <div className="w-2 h-2 rounded-full bg-[var(--color-brand-black)]" />}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </StepWrapper>
  )
}
