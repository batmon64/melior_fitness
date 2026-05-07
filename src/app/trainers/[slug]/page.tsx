import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ALL_TRAINERS, getTrainerData } from '@/constants/trainers'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { TrainerHero } from '@/components/trainer/TrainerHero'
import { TrainerBio } from '@/components/trainer/TrainerBio'
import { TrainerSpecializations } from '@/components/trainer/TrainerSpecializations'
import { TrainerServices } from '@/components/trainer/TrainerServices'
import { TrainerTransformations } from '@/components/trainer/TrainerTransformations'
import { TrainerTestimonials } from '@/components/trainer/TrainerTestimonials'
import { TrainerCertifications } from '@/components/trainer/TrainerCertifications'
import { TrainerPricing } from '@/components/trainer/TrainerPricing'
import { TrainerCTA } from '@/components/trainer/TrainerCTA'

// ── Pre-render both trainer pages at build time ──────────────────────────────
export function generateStaticParams() {
  return ALL_TRAINERS.map((t) => ({ slug: t.slug }))
}

// ── Per-page SEO metadata ────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const trainer = getTrainerData(slug)
  if (!trainer) return {}

  return {
    title: `${trainer.name} — ${trainer.title}`,
    description: trainer.bio,
    openGraph: {
      title: `${trainer.name} | Melior Fitness`,
      description: trainer.bio,
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${trainer.name} | Melior Fitness`,
      description: trainer.bio,
    },
  }
}

// ── Page component ───────────────────────────────────────────────────────────
export default async function TrainerPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const trainer = getTrainerData(slug)
  if (!trainer) notFound()

  return (
    <>
      <Navbar />
      <main>
        <TrainerHero trainer={trainer} />
        <TrainerBio trainer={trainer} />
        <TrainerSpecializations trainer={trainer} />
        <TrainerServices trainer={trainer} />
        <TrainerPricing trainer={trainer} />
        <TrainerTransformations trainer={trainer} />
        <TrainerTestimonials trainer={trainer} />
        <TrainerCertifications trainer={trainer} />
        <TrainerCTA trainer={trainer} />
      </main>
      <Footer />
    </>
  )
}
