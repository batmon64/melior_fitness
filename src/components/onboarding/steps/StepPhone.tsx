'use client'

import { Phone } from 'lucide-react'
import { StepWrapper } from '@/components/onboarding/StepWrapper'
import { cn } from '@/lib/utils'

interface StepPhoneProps {
  value: string
  onChange: (v: string) => void
  onNext: () => void
  onBack: () => void
  direction: number
  error?: string
}

/** Validates a 10-digit Indian mobile number */
export function isValidPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))
}

export function StepPhone({ value, onChange, onNext, onBack, direction, error }: StepPhoneProps) {
  const isValid = isValidPhone(value)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Allow only digits, max 10
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
    onChange(digits)
  }

  return (
    <StepWrapper
      title="What's your phone number?"
      subtitle="Your trainer will use this to reach you on WhatsApp for check-ins and support."
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!isValid}
      direction={direction}
    >
      <div className="flex flex-col items-center py-8 gap-4">
        {/* Phone input */}
        <div
          className={cn(
            'flex items-center gap-3 w-full max-w-sm rounded-xl border px-5 py-4 transition-all duration-200',
            isValid
              ? 'border-[var(--color-brand-gold)] bg-[rgba(202,138,4,0.06)]'
              : 'border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] focus-within:border-[rgba(202,138,4,0.5)]'
          )}
        >
          {/* Country prefix */}
          <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-[rgba(255,255,255,0.1)]">
            <span className="text-lg" aria-hidden="true">🇮🇳</span>
            <span className="text-base font-[var(--font-sans)] font-semibold text-[var(--color-brand-muted)]">
              +91
            </span>
          </div>

          {/* Number input */}
          <div className="flex items-center gap-3 flex-1">
            <Phone
              className="w-4 h-4 shrink-0 text-[var(--color-brand-muted)]"
              aria-hidden="true"
            />
            <input
              type="tel"
              inputMode="numeric"
              value={value}
              onChange={handleChange}
              placeholder="98765 43210"
              aria-label="Phone number"
              autoFocus
              className="w-full bg-transparent border-none outline-none font-[var(--font-sans)] text-xl font-semibold text-[var(--color-brand-cream)] placeholder:text-[var(--color-brand-muted)] placeholder:font-normal placeholder:text-base tracking-widest"
            />
          </div>

          {/* Character count */}
          <span
            className={cn(
              'text-xs font-[var(--font-sans)] shrink-0 tabular-nums',
              value.length === 10 ? 'text-[var(--color-brand-gold)]' : 'text-[var(--color-brand-muted)]'
            )}
            aria-hidden="true"
          >
            {value.length}/10
          </span>
        </div>

        {/* Validation feedback */}
        {value.length > 0 && !isValid && (
          <p className="text-sm text-red-400 font-[var(--font-sans)]" role="alert">
            Please enter a valid 10-digit Indian mobile number
          </p>
        )}

        {isValid && (
          <p className="text-sm text-emerald-400 font-[var(--font-sans)]">
            ✓ Looks good!
          </p>
        )}

        {error && (
          <p className="text-sm text-red-400 font-[var(--font-sans)]" role="alert">{error}</p>
        )}

        {/* Privacy note */}
        <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] text-center max-w-xs mt-2">
          Only your assigned trainer can see this. Never shared publicly.
        </p>
      </div>
    </StepWrapper>
  )
}
