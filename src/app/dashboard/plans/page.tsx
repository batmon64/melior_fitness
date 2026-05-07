import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ShoppingBag, Download, ExternalLink, Calendar, IndianRupee } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/utils'
import { PlanDownloadButton } from '@/components/marketplace/PlanDownloadButton'
import { getPlan } from '@/constants/plans'

export const metadata: Metadata = { title: 'My Plans' }

export default async function DashboardPlansPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch purchases joined with plan info from Supabase
  const { data: rawPurchases } = await (supabase
    .from('purchases') as ReturnType<typeof supabase.from>)
    .select(`
      id, amount, created_at, status,
      plan:diet_plans!purchases_plan_id_fkey (
        id, title, slug, description, category,
        thumbnail_url, document_path, trainer_id
      )
    `)
    .eq('user_id', user!.id)
    .eq('status', 'paid')
    .order('created_at', { ascending: false })

  const purchases = (rawPurchases ?? []) as {
    id: string
    amount: number
    created_at: string
    status: string
    plan: {
      id: string
      title: string
      slug: string
      description: string
      category: string
      thumbnail_url: string | null
      document_path: string | null
      trainer_id: string
    } | null
  }[]

  if (purchases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center mb-6">
          <ShoppingBag className="w-9 h-9 text-[var(--color-brand-muted)]" aria-hidden="true" />
        </div>
        <h2 className="font-[var(--font-heading)] text-2xl text-[var(--color-brand-cream)] mb-3">
          No plans yet
        </h2>
        <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] max-w-xs leading-relaxed mb-6">
          You haven&apos;t purchased any diet plans yet. Browse our collection and find the perfect one for your goal.
        </p>
        <Button variant="primary" size="md" asChild>
          <Link href="/plans">Browse Plans</Link>
        </Button>
      </div>
    )
  }

  const CATEGORY_COLORS: Record<string, string> = {
    fat_loss: '#F97316', muscle_gain: '#A78BFA',
    vegetarian: '#4ADE80', keto: '#FBBF24',
    beginner: '#34D399', advanced: '#F43F5E',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)]">
          {purchases.length} plan{purchases.length !== 1 ? 's' : ''} purchased
        </p>
        <Button variant="secondary" size="sm" asChild>
          <Link href="/plans">Browse More Plans</Link>
        </Button>
      </div>

      <div className="grid gap-5">
        {purchases.map((purchase) => {
          const plan = purchase.plan
          const staticPlan = plan?.slug ? getPlan(plan.slug) : null
          const accentColor = plan?.category ? (CATEGORY_COLORS[plan.category] ?? '#CA8A04') : '#CA8A04'

          return (
            <article
              key={purchase.id}
              className="glass rounded-2xl overflow-hidden"
            >
              <div className="grid md:grid-cols-3 gap-0">
                {/* Plan thumbnail */}
                <div
                  className="h-32 md:h-full md:min-h-[140px] relative"
                  style={{
                    background: staticPlan?.thumbnailGradient
                      ?? 'linear-gradient(135deg, #1C1917, #44403C)',
                  }}
                  aria-hidden="true"
                >
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to right, transparent, rgba(10,9,8,0.4))' }}
                  />
                  <div className="absolute bottom-3 left-3">
                    <Badge
                      variant="glass"
                      className="text-xs capitalize"
                    >
                      {plan?.category?.replace('_', ' ') ?? 'Plan'}
                    </Badge>
                  </div>
                </div>

                {/* Plan info */}
                <div className="md:col-span-2 p-5 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-[var(--font-heading)] text-xl font-semibold text-[var(--color-brand-cream)] leading-snug mb-1">
                        {plan?.title ?? `Plan #${purchase.id.slice(-6).toUpperCase()}`}
                      </h3>
                      <p className="text-sm text-[var(--color-brand-muted)] font-[var(--font-sans)] line-clamp-2">
                        {plan?.description ?? 'Your purchased plan'}
                      </p>
                    </div>
                    <Badge variant="success" className="shrink-0">Purchased</Badge>
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-brand-muted)] font-[var(--font-sans)]">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                      {new Date(purchase.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5" aria-hidden="true" />
                      {formatPrice(purchase.amount)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {/* Download button */}
                    {plan ? (
                      <PlanDownloadButton
                        plan={staticPlan ?? {
                          id: plan.id, slug: plan.slug, title: plan.title,
                          trainerSlug: 'vishal', trainerName: 'Vishal',
                          accentColor: accentColor,
                        } as Parameters<typeof PlanDownloadButton>[0]['plan']}
                        isAuthenticated={true}
                        isPurchased={true}
                        hasPdf={!!plan.document_path}
                      />
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm font-[var(--font-sans)] text-[var(--color-brand-muted)]">
                        <Download className="w-4 h-4" aria-hidden="true" />
                        PDF being prepared
                      </div>
                    )}

                    {plan?.slug && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/plans/${plan.slug}`}>
                          View Plan
                          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
