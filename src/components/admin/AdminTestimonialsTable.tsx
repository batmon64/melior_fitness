'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star, Check, EyeOff, Trash2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Testimonial {
  id: string; display_name: string; location: string | null
  quote: string; before_weight: string | null; after_weight: string | null
  weight_lost: string | null; duration: string | null
  rating: number; is_published: boolean; created_at: string; trainer_id: string
}

export function AdminTestimonialsTable({ testimonials }: { testimonials: Testimonial[] }) {
  const router = useRouter()
  const [actingOn, setActingOn] = useState<string | null>(null)

  async function togglePublish(id: string, current: boolean) {
    setActingOn(id)
    try {
      await fetch('/api/admin/toggle-testimonial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testimonialId: id, isPublished: !current }),
      })
      router.refresh()
    } finally {
      setActingOn(null)
    }
  }

  const pending   = testimonials.filter((t) => !t.is_published)
  const published = testimonials.filter((t) => t.is_published)

  function TestimonialCard({ t }: { t: Testimonial }) {
    return (
      <article className="glass rounded-xl p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--color-brand-cream)] font-[var(--font-sans)]">
              {t.display_name}
            </p>
            {t.location && (
              <p className="text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">{t.location}</p>
            )}
          </div>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3 h-3"
                style={{ fill: i < t.rating ? '#CA8A04' : 'transparent', color: '#CA8A04' }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        {/* Quote */}
        <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] leading-relaxed line-clamp-3 italic">
          &ldquo;{t.quote}&rdquo;
        </p>

        {/* Stats */}
        {(t.before_weight || t.weight_lost) && (
          <div className="flex gap-3 text-xs font-[var(--font-sans)]">
            {t.before_weight && <span className="text-[var(--color-brand-muted)]">Before: {t.before_weight}</span>}
            {t.after_weight  && <span className="text-emerald-400">After: {t.after_weight}</span>}
            {t.weight_lost   && <span className="text-[var(--color-brand-gold)] font-semibold">Lost: {t.weight_lost}</span>}
            {t.duration      && <span className="text-[var(--color-brand-muted)]">{t.duration}</span>}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-[rgba(255,255,255,0.06)]">
          <button
            onClick={() => togglePublish(t.id, t.is_published)}
            disabled={actingOn === t.id}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-[var(--font-sans)] font-semibold transition-all cursor-pointer disabled:opacity-50',
              t.is_published
                ? 'bg-[rgba(255,255,255,0.05)] text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)]'
                : 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
            )}
          >
            {actingOn === t.id
              ? <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
              : t.is_published
                ? <><EyeOff className="w-3 h-3" aria-hidden="true" /> Unpublish</>
                : <><Check className="w-3 h-3" aria-hidden="true" /> Approve</>
            }
          </button>
          <span className="text-[10px] text-[var(--color-brand-muted)] font-[var(--font-sans)] ml-auto">
            {new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
          </span>
        </div>
      </article>
    )
  }

  return (
    <div className="space-y-8">
      {/* Pending approval */}
      {pending.length > 0 && (
        <section>
          <h2 className="text-sm font-[var(--font-sans)] font-semibold uppercase tracking-wider text-amber-400 mb-4">
            Pending Approval ({pending.length})
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pending.map((t) => <TestimonialCard key={t.id} t={t} />)}
          </div>
        </section>
      )}

      {/* Published */}
      {published.length > 0 && (
        <section>
          <h2 className="text-sm font-[var(--font-sans)] font-semibold uppercase tracking-wider text-emerald-400 mb-4">
            Published ({published.length})
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {published.map((t) => <TestimonialCard key={t.id} t={t} />)}
          </div>
        </section>
      )}

      {testimonials.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center">
          <Star className="w-12 h-12 text-[var(--color-brand-muted)] mx-auto mb-4" aria-hidden="true" />
          <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">No testimonials yet.</p>
        </div>
      )}
    </div>
  )
}
