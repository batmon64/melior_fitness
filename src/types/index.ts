import type { FitnessGoal, DietPreference, ActivityLevel } from './supabase'

// Re-export all database types
export type {
  Database,
  UserRole,
  PlanCategory,
  CoachingStatus,
  PaymentStatus,
  ActivityLevel,
  FitnessGoal,
  DietPreference,
  ProfileRow,
  TrainerRow,
  DietPlanRow,
  PurchaseRow,
  CoachingRequestRow,
  TestimonialRow,
  TransformationRow,
  DietPlanWithTrainer,
  PurchaseWithPlan,
  CoachingRequestWithDetails,
} from './supabase'

// ── UI-only types (not in DB) ────────────────────────────────────────────────

/** Static trainer card (used on landing page before DB is connected) */
export interface Trainer {
  id: string
  name: string
  slug: string
  title: string
  specialization: string
  experience: number
  clientsHelped: number
  certifications: string[]
  achievements: string[]
  bio: string
  avatarUrl: string
  whatsapp: string
}

/** Static diet plan card (used on landing page before DB is connected) */
export interface DietPlanCard {
  id: string
  title: string
  description: string
  category: string
  price: number
  originalPrice?: number
  trainerName: string
  trainerSlug: string
  durationWeeks: number
  mealsPerDay: number
  caloriesRange: string
  features: string[]
  thumbnailUrl?: string
  isPopular?: boolean
}

/** Static testimonial */
export interface Testimonial {
  id: string
  name: string
  location: string
  before: string
  after: string
  weightLost?: string | null
  duration: string
  quote: string
  avatarUrl?: string
  trainerName: string
  rating: number
}

/** FAQ item */
export interface FAQItem {
  question: string
  answer: string
}

/** Nav link */
export interface NavLink {
  label: string
  href: string
}

/** Onboarding form values */
export interface OnboardingFormValues {
  full_name: string
  phone: string
  age: number
  weight_kg: number
  height_cm: number
  fitness_goal: FitnessGoal
  diet_preference: DietPreference
  activity_level: ActivityLevel
}

// Re-export convenience
export type { FitnessGoal as Goal }
