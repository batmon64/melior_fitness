'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { AuthCard, FormField, AuthInput, AuthAlert } from '@/components/ui/AuthCard'

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard'

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({ email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' })

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: '' }))
    setError('')
  }

  function validate() {
    const errors = { email: '', password: '' }
    let valid = true

    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email address'
      valid = false
    }
    if (!form.password) {
      errors.password = 'Please enter your password'
      valid = false
    }

    setFieldErrors(errors)
    return valid
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: form.email.trim().toLowerCase(),
      password: form.password,
    })

    setLoading(false)

    if (authError) {
      if (authError.message.includes('Invalid login credentials')) {
        setError('Incorrect email or password. Please try again.')
      } else if (authError.message.includes('Email not confirmed')) {
        setError('Please confirm your email address first. Check your inbox.')
      } else {
        setError(authError.message)
      }
      return
    }

    // Success — redirect
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md"
    >
      <AuthCard
        title="Welcome back"
        subtitle="Log in to access your plans and coaching dashboard."
      >
        <form onSubmit={handleLogin} noValidate className="flex flex-col gap-5">

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
                placeholder="Your password"
                autoComplete="current-password"
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

            {/* Forgot password link */}
            <div className="flex justify-end mt-1">
              <Link
                href="/auth/forgot-password"
                className="text-xs text-[var(--color-brand-gold)] hover:underline font-[var(--font-sans)] cursor-pointer"
              >
                Forgot password?
              </Link>
            </div>
          </FormField>

          {/* Error alert */}
          {error && <AuthAlert type="error" message={error} />}

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            className="w-full mt-1"
          >
            {!loading && <>Log In <ArrowRight className="w-4 h-4" aria-hidden="true" /></>}
          </Button>
        </form>

        {/* Signup link */}
        <p className="mt-6 text-center text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
          Don&apos;t have an account?{' '}
          <Link
            href="/auth/signup"
            className="text-[var(--color-brand-gold)] font-medium hover:underline cursor-pointer"
          >
            Sign up free
          </Link>
        </p>
      </AuthCard>
    </motion.div>
  )
}
