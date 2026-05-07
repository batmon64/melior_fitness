import type { MetadataRoute } from 'next'
import { DETAILED_PLANS } from '@/constants/plans'
import { ALL_TRAINERS } from '@/constants/trainers'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://melior.fit'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,           lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/plans`,    lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/coaching`, lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
  ]

  // Trainer portfolio pages
  const trainerPages: MetadataRoute.Sitemap = ALL_TRAINERS.map((t) => ({
    url:              `${BASE}/trainers/${t.slug}`,
    lastModified:     now,
    changeFrequency:  'monthly',
    priority:         0.8,
  }))

  // Diet plan detail pages
  const planPages: MetadataRoute.Sitemap = DETAILED_PLANS.map((p) => ({
    url:              `${BASE}/plans/${p.slug}`,
    lastModified:     now,
    changeFrequency:  'monthly',
    priority:         0.7,
  }))

  return [...staticPages, ...trainerPages, ...planPages]
}
