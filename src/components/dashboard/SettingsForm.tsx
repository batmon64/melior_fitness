'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Save, CheckCircle, AlertCircle, User, Activity, Target, Utensils, Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AuthInput } from '@/components/ui/AuthCard'
import { cn } from '@/lib/utils'
import { updateProfile } from '@/lib/actions/settings'
import type { ProfileRow } from '@/types/supabase'

interface SettingsFormProps {
  profile: ProfileRow | null
}

const FITNESS_GOALS = [
  { value: 'fat_loss',             label: 'Fat Loss' },
  { value: 'muscle_gain',          label: 'Muscle Gain' },
  { value: 'body_recomposition',   label: 'Body Recomposition' },
  { value: 'general_fitness',      label: 'General Fitness' },
  { value: 'athletic_performance', label: 'Athletic Performance' },
]

const ACTIVITY_LEVELS = [
  { value: 'sedentary',         label: 'Sedentary' },
  { value: 'lightly_active',    label: 'Lightly Active' },
  { value: 'moderately_active', label: 'Moderately Active' },
  { value: 'very_active',       label: 'Very Active' },
  { value: 'super_active',      label: 'Super Active' },
]

const DIET_PREFERENCES = [
  { value: 'non_vegetarian', label: 'Non-Vegetarian' },
  { value: 'vegetarian',     label: 'Vegetarian' },
  { value: 'vegan',          label: 'Vegan' },
  { value: 'keto',           label: 'Keto' },
  { value: 'no_preference',  label: 'No Preference' },
]

export function SettingsForm({ profile }: SettingsFormProps) {
  const router     = useRouter()
  const formRef    = useRef<HTMLFormElement>(null)
  const [pending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    const data = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await updateProfile(data)
      if (result.success) {
        setSuccess(true)
        router.refresh()
        setTimeout(() => setSuccess(false), 4000)
      } else {
        setError(result.error ?? 'Something went wrong')
      }
    })
  }

  const section = 'glass rounded-2xl p-6 space-y-5'
  const label   = 'block text-xs font-[var(--font-sans)] font-semibold tracking-[0.12em] uppercase text-[var(--color-brand-muted)] mb-2'
  const select  = 'w-full h-11 px-4 rounded-[var(--radius-btn)] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[var(--color-brand-cream)] text-sm font-[var(--font-sans)] focus:outline-none focus:border-[var(--color-brand-gold)] transition-all cursor-pointer appearance-none'

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 max-w-2xl">

      {/* Profile section */}
      <div className={section}>
        <div className="flex items-center gap-3 mb-1">
          <User className="w-4 h-4 text-[var(--color-brand-gold)]" aria-hidden="true" />
          <h2 className="text-sm font-[var(--font-sans)] font-semibold text-[var(--color-brand-cream)] uppercase tracking-wider">
            Personal Info
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="full_name" className={label}>Full Name</label>
            <AuthInput
              id="full_name"
              name="full_name"
              type="text"
              defaultValue={profile?.full_name ?? ''}
              placeholder="Your full name"
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="phone" className={label}>Phone</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] pointer-events-none">
                +91
              </span>
              <AuthInput
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                defaultValue={profile?.phone?.replace('+91', '') ?? ''}
                placeholder="98765 43210"
                className="pl-12"
                autoComplete="tel"
                onChange={(e) => {
                  // Prepend +91 on submit via hidden field logic
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
                  e.target.value = digits
                }}
              />
            </div>
          </div>
        </div>

        {/* Email (read-only) */}
        <div>
          <label htmlFor="email" className={label}>Email</label>
          <AuthInput
            id="email"
            type="email"
            value={profile?.email ?? ''}
            readOnly
            className="opacity-60 cursor-not-allowed"
            aria-readonly="true"
          />
          <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] mt-1">
            Email cannot be changed here.{' '}
            <a href="mailto:hello@melior.fit" className="text-[var(--color-brand-gold)] hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </div>

      {/* Body metrics */}
      <div className={section}>
        <div className="flex items-center gap-3 mb-1">
          <Activity className="w-4 h-4 text-[var(--color-brand-gold)]" aria-hidden="true" />
          <h2 className="text-sm font-[var(--font-sans)] font-semibold text-[var(--color-brand-cream)] uppercase tracking-wider">
            Body Metrics
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="age" className={label}>Age</label>
            <AuthInput
              id="age"
              name="age"
              type="number"
              inputMode="numeric"
              defaultValue={profile?.age ?? ''}
              placeholder="25"
              min={10} max={100}
            />
          </div>
          <div>
            <label htmlFor="height_cm" className={label}>Height (cm)</label>
            <AuthInput
              id="height_cm"
              name="height_cm"
              type="number"
              inputMode="decimal"
              defaultValue={profile?.height_cm ?? ''}
              placeholder="175"
              min={100} max={250}
            />
          </div>
          <div>
            <label htmlFor="weight_kg" className={label}>Weight (kg)</label>
            <AuthInput
              id="weight_kg"
              name="weight_kg"
              type="number"
              inputMode="decimal"
              defaultValue={profile?.weight_kg ?? ''}
              placeholder="70"
              min={25} max={300}
            />
          </div>
        </div>
      </div>

      {/* Goals & preferences */}
      <div className={section}>
        <div className="flex items-center gap-3 mb-1">
          <Target className="w-4 h-4 text-[var(--color-brand-gold)]" aria-hidden="true" />
          <h2 className="text-sm font-[var(--font-sans)] font-semibold text-[var(--color-brand-cream)] uppercase tracking-wider">
            Goals & Preferences
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fitness_goal" className={label}>Fitness Goal</label>
            <select id="fitness_goal" name="fitness_goal" className={select} defaultValue={profile?.fitness_goal ?? ''}>
              <option value="" disabled className="bg-[#1C1917]">Select goal</option>
              {FITNESS_GOALS.map((g) => (
                <option key={g.value} value={g.value} className="bg-[#1C1917]">{g.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="activity_level" className={label}>Activity Level</label>
            <select id="activity_level" name="activity_level" className={select} defaultValue={profile?.activity_level ?? ''}>
              <option value="" disabled className="bg-[#1C1917]">Select level</option>
              {ACTIVITY_LEVELS.map((l) => (
                <option key={l.value} value={l.value} className="bg-[#1C1917]">{l.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="diet_preference" className={label}>
            <Utensils className="inline w-3 h-3 mr-1" aria-hidden="true" />
            Diet Preference
          </label>
          <select id="diet_preference" name="diet_preference" className={cn(select, 'sm:max-w-xs')} defaultValue={profile?.diet_preference ?? ''}>
            <option value="" disabled className="bg-[#1C1917]">Select preference</option>
            {DIET_PREFERENCES.map((d) => (
              <option key={d.value} value={d.value} className="bg-[#1C1917]">{d.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Account security */}
      <div className={section}>
        <div className="flex items-center gap-3 mb-1">
          <Lock className="w-4 h-4 text-[var(--color-brand-gold)]" aria-hidden="true" />
          <h2 className="text-sm font-[var(--font-sans)] font-semibold text-[var(--color-brand-cream)] uppercase tracking-wider">
            Security
          </h2>
        </div>
        <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
          To change your password, use the{' '}
          <a href="/auth/forgot-password" className="text-[var(--color-brand-gold)] hover:underline font-medium">
            forgot password
          </a>{' '}
          flow — we&apos;ll send a reset link to your email.
        </p>
      </div>

      {/* Status messages */}
      {success && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)]">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
          <p className="text-sm text-emerald-400 font-[var(--font-sans)]">
            Profile updated successfully!
          </p>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)]">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" aria-hidden="true" />
          <p className="text-sm text-red-400 font-[var(--font-sans)]" role="alert">{error}</p>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={pending}
        className="w-full sm:w-auto"
      >
        {!pending && (
          <>
            <Save className="w-4 h-4" aria-hidden="true" />
            Save Changes
          </>
        )}
      </Button>
    </form>
  )
}
