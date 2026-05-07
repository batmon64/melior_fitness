import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PlanDetailHero } from '@/components/marketplace/PlanDetailHero'
import { PlanDetailContent } from '@/components/marketplace/PlanDetailContent'
import { PlanPurchaseCard } from '@/components/marketplace/PlanPurchaseCard'
import { PlanDownloadButton } from '@/components/marketplace/PlanDownloadButton'
import { DETAILED_PLANS, getPlan } from '@/constants/plans'
import { checkPurchaseStatus } from '@/lib/actions/plans'

// Pre-render all plan pages at build time
export function generateStaticParams() {
  return DETAILED_PLANS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const plan = getPlan(slug)
  if (!plan) return {}

  return {
    title: `${plan.title} by ${plan.trainerName}`,
    description: plan.description,
    openGraph: {
      title: `${plan.title} | Melior Fitness`,
      description: plan.description,
      type: 'website',
    },
  }
}

export default async function PlanDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const plan = getPlan(slug)
  if (!plan) notFound()

  // Server-side purchase check — safe, never reaches the client
  const { isAuthenticated, isPurchased, hasPdf } = await checkPurchaseStatus(slug)

  return (
    <>
      <Navbar />
      <main>
        <PlanDetailHero plan={plan} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-10 items-start">

            {/* Main content */}
            <div className="lg:col-span-2">
              <PlanDetailContent plan={plan} />
            </div>

            {/* Sticky right column */}
            <div className="lg:sticky lg:top-24 flex flex-col gap-4">

              {/* Download button — always shown, adapts to auth/purchase state */}
              <PlanDownloadButton
                plan={plan}
                isAuthenticated={isAuthenticated}
                isPurchased={isPurchased}
                hasPdf={hasPdf}
              />

              {/* Purchase card — shown only if not yet purchased */}
              {!isPurchased && (
                <PlanPurchaseCard plan={plan} />
              )}
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
