'use client'

import { MessageCircle, Mail, Phone } from 'lucide-react'
import { StepWrapper } from '@/components/onboarding/StepWrapper'
import { cn } from '@/lib/utils'
import { CONTACT_PREFS } from '@/constants/coaching'

const CONTACT_ICONS: Record<string, React.ReactNode> = {
  whatsapp: <MessageCircle className="w-5 h-5" aria-hidden="true" />,
  email:    <Mail          className="w-5 h-5" aria-hidden="true" />,
  call:     <Phone         className="w-5 h-5" aria-hidden="true" />,
}

const CONTACT_COLORS: Record<string, string> = {
  whatsapp: '#25D366',
  email:    '#CA8A04',
  call:     '#A78BFA',
}

interface StepContactProps {
  phone:            string
  preferredContact: string
  medicalConditions: string
  onPhoneChange:           (v: string) => void
  onContactChange:         (v: string) => void
  onMedicalChange:         (v: string) => void
  onNext: () => void
  onBack: () => void
  direction: number
}

export function StepContact({
  phone, preferredContact, medicalConditions,
  onPhoneChange, onContactChange, onMedicalChange,
  onNext, onBack, direction,
}: StepContactProps) {
  const isValidPhone = /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))
  const isValid = isValidPhone && !!preferredContact

  function handlePhoneInput(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
    onPhoneChange(digits)
  }

  return (
    <StepWrapper
      title="How should we reach you?"
      subtitle="Your trainer will use this to get in touch within 24 hours of your request."
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!isValid}
      direction={direction}
    >
      <div className="space-y-6">

        {/* Phone number */}
        <div>
          <label htmlFor="contact-phone" className="block text-xs font-[var(--font-sans)] font-semibold tracking-[0.15em] uppercase text-[var(--color-brand-gold)] mb-2">
            WhatsApp / Phone Number
          </label>
          <div className={cn(
            'flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200',
            isValidPhone && phone
              ? 'border-[var(--color-brand-gold)] bg-[rgba(202,138,4,0.06)]'
              : 'border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] focus-within:border-[rgba(202,138,4,0.5)]'
          )}>
            <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-[rgba(255,255,255,0.1)]">
              <span className="text-lg" aria-hidden="true">🇮🇳</span>
              <span className="text-sm font-[var(--font-sans)] font-semibold text-[var(--color-brand-muted)]">+91</span>
            </div>
            <input
              id="contact-phone"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={handlePhoneInput}
              placeholder="98765 43210"
              autoFocus
              className="flex-1 bg-transparent border-none outline-none font-[var(--font-sans)] text-lg font-semibold text-[var(--color-brand-cream)] placeholder:text-[var(--color-brand-muted)] placeholder:font-normal placeholder:text-base tracking-widest"
              aria-label="Phone number"
            />
            <span className={cn(
              'text-xs font-[var(--font-sans)] shrink-0 tabular-nums',
              phone.length === 10 ? 'text-[var(--color-brand-gold)]' : 'text-[var(--color-brand-muted)]'
            )}>
              {phone.length}/10
            </span>
          </div>
          {phone.length > 0 && !isValidPhone && (
            <p className="text-xs text-red-400 font-[var(--font-sans)] mt-1" role="alert">
              Please enter a valid 10-digit Indian mobile number
            </p>
          )}
          {isValidPhone && (
            <p className="text-xs text-emerald-400 font-[var(--font-sans)] mt-1">✓ Looks good!</p>
          )}
        </div>

        {/* Preferred contact method */}
        <div>
          <label className="block text-xs font-[var(--font-sans)] font-semibold tracking-[0.15em] uppercase text-[var(--color-brand-gold)] mb-3">
            Preferred Contact Method
          </label>
          <div className="grid grid-cols-3 gap-3">
            {CONTACT_PREFS.map(({ value, label, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => onContactChange(value)}
                className={cn(
                  'text-left p-4 rounded-xl border transition-all duration-150 cursor-pointer',
                  preferredContact === value
                    ? 'border-[var(--color-brand-gold)] bg-[rgba(202,138,4,0.08)]'
                    : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(202,138,4,0.3)]'
                )}
                aria-pressed={preferredContact === value}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                  style={{
                    background: preferredContact === value ? `${CONTACT_COLORS[value]}18` : 'rgba(255,255,255,0.05)',
                    color: preferredContact === value ? CONTACT_COLORS[value] : 'var(--color-brand-muted)',
                  }}
                >
                  {CONTACT_ICONS[value]}
                </div>
                <p className={cn(
                  'text-sm font-[var(--font-sans)] font-semibold mb-0.5',
                  preferredContact === value ? 'text-[var(--color-brand-cream)]' : 'text-[var(--color-brand-muted)]'
                )}>
                  {label}
                </p>
                <p className="text-[10px] text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-tight">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Medical conditions (optional) */}
        <div>
          <label htmlFor="medical" className="block text-xs font-[var(--font-sans)] font-semibold tracking-[0.15em] uppercase text-[var(--color-brand-gold)] mb-2">
            Any Medical Conditions?{' '}
            <span className="text-[var(--color-brand-muted)] normal-case tracking-normal font-normal">(optional)</span>
          </label>
          <textarea
            id="medical"
            value={medicalConditions}
            onChange={(e) => onMedicalChange(e.target.value)}
            placeholder="Diabetes, PCOS, thyroid issues, back problems, previous injuries, etc. Leave blank if none."
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[var(--color-brand-cream)] text-sm font-[var(--font-sans)] placeholder:text-[var(--color-brand-muted)] focus:outline-none focus:border-[var(--color-brand-gold)] transition-all resize-none"
          />
          <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] mt-1">
            This helps your trainer plan safely around any health considerations.
          </p>
        </div>
      </div>
    </StepWrapper>
  )
}
