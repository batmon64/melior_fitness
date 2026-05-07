'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  currentStep: number   // 0-indexed
  totalSteps: number
  stepLabels: string[]
}

export function ProgressBar({ currentStep, totalSteps, stepLabels }: ProgressBarProps) {
  const progressPct = (currentStep / (totalSteps - 1)) * 100

  return (
    <div className="w-full px-4 sm:px-6 pt-6 pb-2">
      {/* Step count + label */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-[var(--font-sans)] font-semibold tracking-[0.15em] uppercase text-[var(--color-brand-gold)]">
          Step {currentStep + 1} of {totalSteps}
        </p>
        <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
          {stepLabels[currentStep]}
        </p>
      </div>

      {/* Track */}
      <div className="relative h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: 'linear-gradient(90deg, #CA8A04, #EAB308)' }}
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Step dots — desktop only */}
      <div className="hidden sm:flex items-center justify-between mt-3">
        {stepLabels.map((label, i) => {
          const isDone    = i < currentStep
          const isCurrent = i === currentStep
          return (
            <div key={label} className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 text-[10px]',
                  isDone    && 'bg-[var(--color-brand-gold)]',
                  isCurrent && 'bg-[rgba(202,138,4,0.2)] border-2 border-[var(--color-brand-gold)]',
                  !isDone && !isCurrent && 'bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)]'
                )}
              >
                {isDone ? (
                  <Check className="w-2.5 h-2.5 text-[var(--color-brand-black)]" aria-hidden="true" />
                ) : (
                  <span className={cn(
                    'font-[var(--font-sans)] font-bold',
                    isCurrent ? 'text-[var(--color-brand-gold)]' : 'text-[var(--color-brand-muted)]'
                  )}>
                    {i + 1}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
