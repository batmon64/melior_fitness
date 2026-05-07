'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface StepWrapperProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  onNext: () => void
  onBack?: () => void
  nextLabel?: string
  nextDisabled?: boolean
  isLoading?: boolean
  className?: string
  direction: number
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
}

export function StepWrapper({
  title,
  subtitle,
  children,
  onNext,
  onBack,
  nextLabel = 'Continue',
  nextDisabled = false,
  isLoading = false,
  className,
  direction,
}: StepWrapperProps) {
  return (
    <motion.div
      key={title}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35, ease: EASE }}
      className={cn('w-full max-w-2xl mx-auto px-4 sm:px-6 py-8', className)}
    >
      {/* Heading */}
      <div className="mb-8">
        <h2 className="font-[var(--font-heading)] text-3xl md:text-4xl font-bold text-[var(--color-brand-cream)] leading-tight mb-3">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm md:text-base text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Step content */}
      <div className="mb-10">{children}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        {onBack ? (
          <Button variant="ghost" size="md" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back
          </Button>
        ) : (
          <div />
        )}

        <Button
          variant="primary"
          size="lg"
          onClick={onNext}
          disabled={nextDisabled}
          isLoading={isLoading}
          className="min-w-[140px]"
        >
          {!isLoading && (
            <>
              {nextLabel}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  )
}

/** Clickable option card — used for goal/activity/diet selection */
interface OptionCardProps {
  selected: boolean
  onClick: () => void
  icon: React.ReactNode
  title: string
  description?: string
  accentColor?: string
}

export function OptionCard({ selected, onClick, icon, title, description, accentColor = '#CA8A04' }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer group',
        selected
          ? 'border-[var(--color-brand-gold)] bg-[rgba(202,138,4,0.08)]'
          : 'border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(202,138,4,0.3)] hover:bg-[rgba(202,138,4,0.04)]'
      )}
      aria-pressed={selected}
    >
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
        style={{
          background: selected ? `${accentColor}20` : 'rgba(255,255,255,0.05)',
          color: selected ? accentColor : 'var(--color-brand-muted)',
        }}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className={cn(
          'text-sm font-semibold font-[var(--font-sans)] leading-snug transition-colors',
          selected ? 'text-[var(--color-brand-cream)]' : 'text-[var(--color-brand-muted)] group-hover:text-[var(--color-brand-cream)]'
        )}>
          {title}
        </p>
        {description && (
          <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Radio dot */}
      <div
        className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200"
        style={{
          borderColor: selected ? accentColor : 'rgba(255,255,255,0.15)',
          background: selected ? accentColor : 'transparent',
        }}
        aria-hidden="true"
      >
        {selected && <div className="w-2 h-2 rounded-full bg-[var(--color-brand-black)]" />}
      </div>
    </button>
  )
}

/** Number input with +/- buttons — great for age/height/weight on mobile */
interface NumberPickerProps {
  value: number | ''
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  unit: string
  label: string
}

export function NumberPicker({ value, onChange, min, max, step = 1, unit, label }: NumberPickerProps) {
  // Local string state so the user can type freely without mid-word validation
  const [raw, setRaw] = useState<string>(value === '' ? '' : String(value))

  // Keep local state in sync when parent resets or +/- buttons fire
  const num = typeof value === 'number' ? value : min

  function increment() {
    const next = Math.min(max, num + step)
    onChange(next)
    setRaw(String(next))
  }
  function decrement() {
    const next = Math.max(min, num - step)
    onChange(next)
    setRaw(String(next))
  }

  function handleTyping(e: React.ChangeEvent<HTMLInputElement>) {
    const text = e.target.value
    setRaw(text)                          // always show what user is typing

    const parsed = step < 1 ? parseFloat(text) : parseInt(text)
    if (!isNaN(parsed) && parsed >= min && parsed <= max) {
      onChange(parsed)                    // only commit valid complete values
    }
  }

  function handleBlur() {
    const parsed = step < 1 ? parseFloat(raw) : parseInt(raw)
    if (isNaN(parsed) || parsed < min) {
      setRaw(String(min)); onChange(min)  // clamp to minimum on blur
    } else if (parsed > max) {
      setRaw(String(max)); onChange(max)  // clamp to maximum on blur
    } else {
      setRaw(String(parsed))              // normalise (e.g. "075" → "75")
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={decrement}
          disabled={num <= min}
          className="w-14 h-14 rounded-full glass flex items-center justify-center text-2xl font-bold text-[var(--color-brand-cream)] disabled:opacity-30 hover:border-[var(--color-brand-gold)] transition-all cursor-pointer disabled:cursor-not-allowed"
          aria-label={`Decrease ${label}`}
        >
          −
        </button>

        <div className="flex flex-col items-center min-w-[120px]">
          <input
            type="text"
            inputMode="decimal"
            value={raw}
            onChange={handleTyping}
            onBlur={handleBlur}
            onFocus={(e) => e.target.select()}
            placeholder={String(min)}
            className="w-full text-center bg-transparent border-none outline-none font-[var(--font-heading)] text-6xl font-bold text-[var(--color-brand-cream)] placeholder:text-[var(--color-brand-stone)]"
            aria-label={label}
          />
          <span className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] font-medium mt-1">
            {unit}
          </span>
        </div>

        <button
          type="button"
          onClick={increment}
          disabled={num >= max}
          className="w-14 h-14 rounded-full glass flex items-center justify-center text-2xl font-bold text-[var(--color-brand-cream)] disabled:opacity-30 hover:border-[var(--color-brand-gold)] transition-all cursor-pointer disabled:cursor-not-allowed"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>

      {/* Range indicator */}
      <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
        {min} – {max} {unit}
      </p>
    </div>
  )
}
