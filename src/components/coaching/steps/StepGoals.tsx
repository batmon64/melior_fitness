'use client'

import { StepWrapper } from '@/components/onboarding/StepWrapper'
import { cn } from '@/lib/utils'
import { COACHING_GOALS, TIMELINES } from '@/constants/coaching'

interface StepGoalsProps {
  goal:             string
  currentSituation: string
  challenges:       string
  timeline:         string
  onGoalChange:       (v: string) => void
  onSituationChange:  (v: string) => void
  onChallengesChange: (v: string) => void
  onTimelineChange:   (v: string) => void
  onNext: () => void
  onBack: () => void
  direction: number
  error?: string
}

export function StepGoals({
  goal, currentSituation, challenges, timeline,
  onGoalChange, onSituationChange, onChallengesChange, onTimelineChange,
  onNext, onBack, direction, error,
}: StepGoalsProps) {
  // Just require something is typed — no character minimum shown to user
  const isValid = !!(goal && currentSituation.trim() && challenges.trim() && timeline)

  return (
    <StepWrapper
      title="Tell us about your goals"
      subtitle="The more detail you give, the better your trainer can prepare before your first conversation."
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!isValid}
      direction={direction}
    >
      <div className="space-y-6">

        {/* Primary goal */}
        <div>
          <label className="block text-xs font-[var(--font-sans)] font-semibold tracking-[0.15em] uppercase text-[var(--color-brand-gold)] mb-3">
            Primary Goal
          </label>
          <div className="flex flex-wrap gap-2">
            {COACHING_GOALS.map(({ value, label, emoji }) => (
              <button
                key={value}
                type="button"
                onClick={() => onGoalChange(value)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-[var(--font-sans)] font-medium border transition-all duration-150 cursor-pointer',
                  goal === value
                    ? 'bg-[rgba(202,138,4,0.15)] border-[rgba(202,138,4,0.5)] text-[var(--color-brand-gold)]'
                    : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-[var(--color-brand-muted)] hover:border-[rgba(202,138,4,0.3)] hover:text-[var(--color-brand-cream)]'
                )}
                aria-pressed={goal === value}
              >
                <span aria-hidden="true">{emoji}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Current situation */}
        <div>
          <label htmlFor="situation" className="block text-xs font-[var(--font-sans)] font-semibold tracking-[0.15em] uppercase text-[var(--color-brand-gold)] mb-2">
            Your Current Situation
          </label>
          <textarea
            id="situation"
            value={currentSituation}
            onChange={(e) => onSituationChange(e.target.value)}
            placeholder="Describe your current fitness level, diet habits, work schedule, and anything your trainer should know about your lifestyle…"
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[var(--color-brand-cream)] text-sm font-[var(--font-sans)] placeholder:text-[var(--color-brand-muted)] focus:outline-none focus:border-[var(--color-brand-gold)] transition-all resize-none"
          />
        </div>

        {/* Main challenge */}
        <div>
          <label htmlFor="challenges" className="block text-xs font-[var(--font-sans)] font-semibold tracking-[0.15em] uppercase text-[var(--color-brand-gold)] mb-2">
            Biggest Challenge
          </label>
          <textarea
            id="challenges"
            value={challenges}
            onChange={(e) => onChallengesChange(e.target.value)}
            placeholder="What's been stopping you from reaching your goal so far? Consistency? Knowledge? Time? Previous injuries?"
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[var(--color-brand-cream)] text-sm font-[var(--font-sans)] placeholder:text-[var(--color-brand-muted)] focus:outline-none focus:border-[var(--color-brand-gold)] transition-all resize-none"
          />
        </div>

        {/* Timeline */}
        <div>
          <label className="block text-xs font-[var(--font-sans)] font-semibold tracking-[0.15em] uppercase text-[var(--color-brand-gold)] mb-3">
            When Do You Want to Start?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TIMELINES.map(({ value, label, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => onTimelineChange(value)}
                className={cn(
                  'text-left p-3 rounded-xl border transition-all duration-150 cursor-pointer',
                  timeline === value
                    ? 'border-[var(--color-brand-gold)] bg-[rgba(202,138,4,0.08)]'
                    : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(202,138,4,0.3)]'
                )}
                aria-pressed={timeline === value}
              >
                <p className={cn(
                  'text-sm font-[var(--font-sans)] font-semibold mb-0.5 transition-colors',
                  timeline === value ? 'text-[var(--color-brand-gold)]' : 'text-[var(--color-brand-cream)]'
                )}>
                  {label}
                </p>
                <p className="text-[10px] text-[var(--color-brand-muted)] font-[var(--font-sans)]">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-400 font-[var(--font-sans)]" role="alert">{error}</p>}
      </div>
    </StepWrapper>
  )
}
