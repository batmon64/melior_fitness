'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { AuthCard, FormField, AuthInput, AuthAlert } from '@/components/ui/AuthCard'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo: `${window.location.origin}/auth/reset-password` }
    )

    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <AuthCard title="Email sent!" subtitle={`We sent a password reset link to ${email}.`}>
          <div className="flex flex-col items-center gap-6 py-4">
            <div className="w-16 h-16 rounded-full bg-[rgba(202,138,4,0.12)] border border-[rgba(202,138,4,0.25)] flex items-center justify-center">
              <Mail className="w-7 h-7 text-[var(--color-brand-gold)]" aria-hidden="true" />
            </div>
            <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] text-center leading-relaxed">
              Check your spam folder if you don&apos;t see it within a few minutes.
            </p>
            <Button variant="secondary" size="md" asChild>
              <Link href="/auth/login">
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Back to Login
              </Link>
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
        title="Reset your password"
        subtitle="Enter your email and we'll send you a reset link."
      >
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <FormField label="Email Address" htmlFor="email" error={error}>
            <AuthInput
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              disabled={loading}
            />
          </FormField>

          <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full">
            {!loading && 'Send Reset Link'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1.5 text-[var(--color-brand-gold)] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            Back to Login
          </Link>
        </p>
      </AuthCard>
    </motion.div>
  )
}
