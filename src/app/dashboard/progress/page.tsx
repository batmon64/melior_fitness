import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TrendingUp, Target, Activity, Scale, Ruler, Calendar, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { ProfileRow } from '@/types/supabase'

export const metadata: Metadata = { title: 'Progress' }

function getBMICategory(bmi: number) {
  if (bmi < 18.5) return { label: 'Underweight', color: '#60A5FA' }
  if (bmi < 25)   return { label: 'Normal',      color: '#34D399' }
  if (bmi < 30)   return { label: 'Overweight',  color: '#FBBF24' }
  return                  { label: 'Obese',       color: '#F87171' }
}

const GOAL_LABELS: Record<string, string> = {
  fat_loss:             'Fat Loss',
  muscle_gain:          'Muscle Gain',
  body_recomposition:   'Body Recomposition',
  general_fitness:      'General Fitness',
  athletic_performance: 'Athletic Performance',
}

const ACTIVITY_LABELS: Record<string, string> = {
  sedentary:         'Sedentary',
  lightly_active:    'Lightly Active',
  moderately_active: 'Moderately Active',
  very_active:       'Very Active',
  super_active:      'Super Active',
}

export default async function DashboardProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const profile = profileData as ProfileRow | null

  const hasMetrics = !!(profile?.weight_kg && profile?.height_cm)
  const bmi = hasMetrics
    ? Math.round(((profile!.weight_kg! / ((profile!.height_cm! / 100) ** 2)) * 10)) / 10
    : null
  const bmiCat = bmi ? getBMICategory(bmi) : null

  const memberDays = profile?.created_at
    ? Math.floor((Date.now() - new Date(profile.created_at).getTime()) / 86400000)
    : 0

  return (
    <div className="space-y-6">

      {/* Member since banner */}
      <div className="glass rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[rgba(202,138,4,0.12)] flex items-center justify-center shrink-0">
          <Calendar className="w-6 h-6 text-[var(--color-brand-gold)]" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">
            Day {memberDays} of your journey
          </p>
          <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
            Member since {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
              : '—'}
          </p>
        </div>
        <Badge variant="gold" className="ml-auto">Active</Badge>
      </div>

      {/* Body metrics */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-[var(--font-sans)] font-semibold text-[var(--color-brand-muted)] uppercase tracking-wider">
            Body Metrics
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/settings">
              Update <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Scale className="w-5 h-5" aria-hidden="true" />, label: 'Weight', value: profile?.weight_kg ? `${profile.weight_kg} kg` : '—', color: '#CA8A04' },
            { icon: <Ruler className="w-5 h-5" aria-hidden="true" />, label: 'Height', value: profile?.height_cm ? `${profile.height_cm} cm` : '—', color: '#A78BFA' },
            { icon: <TrendingUp className="w-5 h-5" aria-hidden="true" />, label: 'Age', value: profile?.age ? `${profile.age} yrs` : '—', color: '#34D399' },
            {
              icon: <Activity className="w-5 h-5" aria-hidden="true" />,
              label: 'BMI',
              value: bmi ? String(bmi) : '—',
              color: bmiCat?.color ?? '#CA8A04',
              sub: bmiCat?.label,
            },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-5 flex flex-col gap-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${stat.color}18`, color: stat.color }}
              >
                {stat.icon}
              </div>
              <p className="font-[var(--font-heading)] text-2xl font-bold text-[var(--color-brand-cream)]">
                {stat.value}
              </p>
              <div>
                <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">{stat.label}</p>
                {stat.sub && (
                  <p className="text-xs font-semibold font-[var(--font-sans)] mt-0.5" style={{ color: stat.color }}>
                    {stat.sub}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goal & activity */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[rgba(202,138,4,0.12)] flex items-center justify-center">
              <Target className="w-5 h-5 text-[var(--color-brand-gold)]" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">
              Your Goal
            </p>
          </div>
          <p className="font-[var(--font-heading)] text-2xl font-bold text-[var(--color-brand-cream)] mb-2">
            {profile?.fitness_goal ? GOAL_LABELS[profile.fitness_goal] : 'Not set'}
          </p>
          <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
            {profile?.diet_preference
              ? `Diet: ${profile.diet_preference.replace('_', ' ')}`
              : 'Update your settings to set a goal'}
          </p>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[rgba(167,139,250,0.12)] flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#A78BFA]" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">
              Activity Level
            </p>
          </div>
          <p className="font-[var(--font-heading)] text-2xl font-bold text-[var(--color-brand-cream)] mb-2">
            {profile?.activity_level ? ACTIVITY_LABELS[profile.activity_level] : 'Not set'}
          </p>
          <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
            {profile?.experience_level
              ? `Experience: ${profile.experience_level}`
              : 'Update in settings'}
          </p>
        </div>
      </div>

      {/* Progress logging CTA */}
      <div className="glass rounded-2xl p-6 text-center">
        <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-6 h-6 text-[var(--color-brand-gold)]" aria-hidden="true" />
        </div>
        <h3 className="font-[var(--font-heading)] text-lg text-[var(--color-brand-cream)] mb-2">
          Weight tracking coming soon
        </h3>
        <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] max-w-sm mx-auto mb-4">
          Log weekly weigh-ins, track your progress photos, and visualise your transformation over time.
        </p>
        <Badge variant="glass">In Development</Badge>
      </div>
    </div>
  )
}
