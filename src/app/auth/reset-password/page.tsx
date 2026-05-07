'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { AuthCard, FormField, AuthInput, AuthAlert } from '@/components/ui/AuthCard'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/dashboard'), 2000)
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <AuthCard title="Password updated!" subtitle="You'll be redirected to your dashboard shortly.">
          <div className="flex justify-center py-6">
            <div className="w-16 h-16 rounded-full bg-[rgba(34,197,94,0.12)] border border-[rgba(34,197,94,0.25)] flex items-center justify-center">
              <Check className="w-8 h-8 text-emerald-400" aria-hidden="true" />
            </div>
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
      <AuthCard title="Set new password" subtitle="Choose a strong password for your account.">
        <form onSubmit={handleReset} noValidate className="flex flex-col gap-5">
          <FormField label="New Password" htmlFor="password">
            <div className="relative">
              <AuthInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                disabled={loading}
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </FormField>

          <FormField label="Confirm Password" htmlFor="confirm">
            <AuthInput
              id="confirm"
              type="password"
              placeholder="Repeat your password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setError('') }}
              disabled={loading}
            />
          </FormField>

          {error && <AuthAlert type="error" message={error} />}

          <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full">
            {!loading && 'Update Password'}
          </Button>
        </form>
      </AuthCard>
    </motion.div>
  )
}
