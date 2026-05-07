'use client'

import { StepWrapper, NumberPicker } from '@/components/onboarding/StepWrapper'

interface StepAgeProps {
  value: number | ''
  onChange: (v: number) => void
  onNext: () => void
  onBack: () => void
  direction: number
  error?: string
}

export function StepAge({ value, onChange, onNext, onBack, direction, error }: StepAgeProps) {
  return (
    <StepWrapper
      title="How old are you?"
      subtitle="Your age helps us calibrate calorie targets and hormonal factors accurately."
      onNext={onNext}
      onBack={onBack}
      nextDisabled={value === '' || (value as number) < 10 || (value as number) > 100}
      direction={direction}
    >
      <div className="flex flex-col items-center py-8">
        <NumberPicker
          value={value}
          onChange={onChange}
          min={10}
          max={100}
          step={1}
          unit="years"
          label="Age"
        />
        {error && (
          <p className="mt-4 text-sm text-red-400 font-[var(--font-sans)]" role="alert">{error}</p>
        )}
      </div>
    </StepWrapper>
  )
}
