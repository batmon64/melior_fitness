'use client'

import { StepWrapper, NumberPicker } from '@/components/onboarding/StepWrapper'

interface StepMetricsProps {
  height: number | ''
  weight: number | ''
  onHeightChange: (v: number) => void
  onWeightChange: (v: number) => void
  onNext: () => void
  onBack: () => void
  direction: number
  error?: string
}

export function StepMetrics({
  height, weight,
  onHeightChange, onWeightChange,
  onNext, onBack, direction, error,
}: StepMetricsProps) {
  const isValid =
    height !== '' && (height as number) >= 100 && (height as number) <= 250 &&
    weight !== '' && (weight as number) >= 25  && (weight as number) <= 300

  return (
    <StepWrapper
      title="Height & weight"
      subtitle="Used to calculate your BMI, calorie needs, and track your progress over time."
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!isValid}
      direction={direction}
    >
      <div className="grid sm:grid-cols-2 gap-8 py-6">
        {/* Height */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.15em] uppercase text-[var(--color-brand-gold)]">
            Height
          </p>
          <NumberPicker
            value={height}
            onChange={onHeightChange}
            min={100}
            max={250}
            step={1}
            unit="cm"
            label="Height"
          />
        </div>

        {/* Divider on mobile */}
        <div className="sm:hidden h-px bg-[rgba(255,255,255,0.06)]" aria-hidden="true" />

        {/* Weight */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.15em] uppercase text-[var(--color-brand-gold)]">
            Current Weight
          </p>
          <NumberPicker
            value={weight}
            onChange={onWeightChange}
            min={25}
            max={300}
            step={0.5}
            unit="kg"
            label="Weight"
          />
        </div>
      </div>

      {/* BMI hint */}
      {height !== '' && weight !== '' && (
        <div className="mt-2 text-center">
          {(() => {
            const h = (height as number) / 100
            const bmi = Math.round(((weight as number) / (h * h)) * 10) / 10
            const label = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'
            const color = bmi < 18.5 ? '#60A5FA' : bmi < 25 ? '#34D399' : bmi < 30 ? '#FBBF24' : '#F87171'
            return (
              <p className="text-sm font-[var(--font-sans)]" style={{ color }}>
                BMI: {bmi} — {label}
              </p>
            )
          })()}
        </div>
      )}

      {error && <p className="mt-3 text-center text-sm text-red-400 font-[var(--font-sans)]" role="alert">{error}</p>}
    </StepWrapper>
  )
}
