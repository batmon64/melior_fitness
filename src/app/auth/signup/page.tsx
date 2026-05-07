'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { AuthCard, FormField, AuthInput, AuthAlert } from '@/components/ui/AuthCard'

const passwordRules = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /\d/.test(p) },
]

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  })

  const [fieldErrors, setFieldErrors] = useState({
    fullName: '',
    email: '',
    password: '',
  })

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: '' }))
    setError('')
  }

  function validate() {
    const errors = { fullName: '', email: '', password: '' }
    let valid = true

    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      errors.fullName = 'Please enter your full name'
      valid = false
    }
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email address'
      valid = false
    }
    if (form.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
      valid = false
    }

    setFieldErrors(errors)
    return valid
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      options: {
        data: { full_name: form.fullName.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    })

    setLoading(false)

    if (authError) {
      if (authError.message.includes('already registered')) {
        setError('This email is already registered. Try logging in instead.')
      } else {
        setError(authError.message)
      }
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AuthCard
          title="Check your inbox"
          subtitle={`We sent a confirmation link to ${form.email}. Click it to activate your account.`}
        >
          <div className="flex flex-col items-center gap-6 py-4">
            {/* Success icon */}
            <div className="w-16 h-16 rounded-full bg-[rgba(34,197,94,0.12)] border border-[rgba(34,197,94,0.25)] flex items-center justify-center">
              <Check className="w-8 h-8 text-emerald-400" aria-hidden="true" />
            </div>
            <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] text-center leading-relaxed">
              Didn't receive it? Check your spam folder, or{' '}
              <button
                onClick={() => setSuccess(false)}
                className="text-[var(--color-brand-gold)] hover:underline cursor-pointer"
              >
                try again
              </button>
              .
            </p>
            <Button variant="secondary" size="md" asChild>
              <Link href="/auth/login">Go to Login</Link>
            </Button>
          </div>
        </AuthCard>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md"
    >
      <AuthCard
        title="Create your account"
        subtitle="Start your transformation journey today."
      >
        <form onSubmit={handleSignup} noValidate className="flex flex-col gap-5">

          {/* Full name */}
          <FormField label="Full Name" htmlFor="fullName" error={fieldErrors.fullName}>
            <AuthInput
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Arjun Sharma"
              autoComplete="name"
              value={form.fullName}
              onChange={onChange}
              disabled={loading}
              aria-invalid={!!fieldErrors.fullName}
            />
          </FormField>

          {/* Email */}
          <FormField label="Email Address" htmlFor="email" error={fieldErrors.email}>
            <AuthInput
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={form.email}
              onChange={onChange}
              disabled={loading}
              aria-invalid={!!fieldErrors.email}
            />
          </FormField>

          {/* Password */}
          <FormField label="Password" htmlFor="password" error={fieldErrors.password}>
            <div className="relative">
              <AuthInput
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                value={form.password}
                onChange={onChange}
                disabled={loading}
                aria-invalid={!!fieldErrors.password}
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword
                  ? <EyeOff className="w-4 h-4" aria-hidden="true" />
                  : <Eye className="w-4 h-4" aria-hidden="true" />}
              </button>
            </div>

            {/* Password strength indicators */}
            {form.password.length > 0 && (
              <div className="flex flex-col gap-1 mt-2">
                {passwordRules.map((rule) => {
                  const passed = rule.test(form.password)
                  return (
                    <div key={rule.label} className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${passed ? 'bg-emerald-500' : 'bg-[rgba(255,255,255,0.1)]'}`}>
                        {passed && <Check className="w-2 h-2 text-white" aria-hidden="true" />}
                      </div>
                      <span className={`text-xs font-[var(--font-sans)] transition-colors ${passed ? 'text-emerald-400' : 'text-[var(--color-brand-muted)]'}`}>
                        {rule.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </FormField>

          {/* Error alert */}
          {error && <AuthAlert type="error" message={error} />}

          {/* Terms notice */}
          <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed">
            By creating an account you agree to our{' '}
            <Link href="/terms" className="text-[var(--color-brand-gold)] hover:underline cursor-pointer">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-[var(--color-brand-gold)] hover:underline cursor-pointer">
              Privacy Policy
            </Link>.
          </p>

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            className="w-full mt-1"
          >
            {!loading && <>Create Account <ArrowRight className="w-4 h-4" aria-hidden="true" /></>}
          </Button>
        </form>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="text-[var(--color-brand-gold)] font-medium hover:underline cursor-pointer"
          >
            Log in
          </Link>
        </p>
      </AuthCard>
    </motion.div>
  )
}
