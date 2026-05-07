/**
 * Melior Fitness — Full Supabase Database Types
 *
 * Auto-generate with:
 *   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
 *
 * This manual scaffold matches 001_initial_schema.sql exactly.
 * Replace with the generated version once your Supabase project is connected.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ── Enums (mirror SQL ENUMs) ─────────────────────────────────────────────────

export type UserRole       = 'user' | 'trainer' | 'admin'
export type PlanCategory   = 'fat_loss' | 'muscle_gain' | 'vegetarian' | 'keto' | 'beginner' | 'advanced'
export type CoachingStatus = 'pending' | 'active' | 'completed' | 'cancelled'
export type PaymentStatus  = 'pending' | 'paid' | 'failed' | 'refunded'
export type ActivityLevel  = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'super_active'
export type FitnessGoal    = 'fat_loss' | 'muscle_gain' | 'body_recomposition' | 'general_fitness' | 'athletic_performance'
export type DietPreference = 'non_vegetarian' | 'vegetarian' | 'vegan' | 'keto' | 'no_preference'

// ── Table Row types ──────────────────────────────────────────────────────────

export interface ProfileRow {
  id:                   string
  email:                string
  full_name:            string | null
  avatar_url:           string | null
  role:                 UserRole
  phone:                string | null
  age:                  number | null
  weight_kg:            number | null
  height_cm:            number | null
  fitness_goal:         FitnessGoal | null
  diet_preference:      DietPreference | null
  activity_level:       ActivityLevel | null
  onboarding_completed: boolean
  /** Added via ALTER TABLE migration */
  medical_conditions:   string | null
  /** Added via ALTER TABLE migration */
  experience_level:     string | null
  created_at:           string
  updated_at:           string
}

export interface TrainerRow {
  id:               string
  user_id:          string
  slug:             string
  title:            string
  bio:              string
  specialization:   string
  experience_years: number
  clients_helped:   number
  certifications:   string[]
  achievements:     string[]
  whatsapp:         string | null
  instagram_url:    string | null
  is_active:        boolean
  created_at:       string
  updated_at:       string
}

export interface DietPlanRow {
  id:             string
  trainer_id:     string
  title:          string
  slug:           string
  description:    string
  category:       PlanCategory
  price:          number
  original_price: number | null
  duration_weeks: number
  meals_per_day:  number
  calories_range: string
  features:       string[]
  is_published:   boolean
  is_popular:     boolean
  thumbnail_url:  string | null
  stripe_price_id: string | null
  /** Path in plan-documents bucket: e.g. "{plan_uuid}/fat-loss-pro.pdf" */
  document_path:  string | null
  created_at:     string
  updated_at:     string
}

export interface PurchaseRow {
  id:                       string
  user_id:                  string
  plan_id:                  string
  stripe_payment_intent_id: string | null
  stripe_session_id:        string | null
  amount:                   number
  currency:                 string
  status:                   PaymentStatus
  created_at:               string
}

export interface CoachingRequestRow {
  id:           string
  user_id:      string
  trainer_id:   string
  message:      string
  goal:         string
  status:       CoachingStatus
  trainer_note: string | null
  created_at:   string
  updated_at:   string
}

export interface TestimonialRow {
  id:            string
  user_id:       string | null
  trainer_id:    string
  display_name:  string
  location:      string | null
  quote:         string
  before_weight: string | null
  after_weight:  string | null
  weight_lost:   string | null
  duration:      string | null
  rating:        number
  is_published:  boolean
  created_at:    string
}

export interface TransformationRow {
  id:               string
  user_id:          string | null
  trainer_id:       string
  display_name:     string
  before_image_url: string
  after_image_url:  string
  duration_weeks:   number | null
  weight_lost_kg:   number | null
  description:      string | null
  is_published:     boolean
  created_at:       string
}

// ── Database interface (used by createBrowserClient / createServerClient) ────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row:    ProfileRow
        Insert: {
          id: string; email: string; full_name?: string | null; avatar_url?: string | null
          role?: UserRole; phone?: string | null; age?: number | null
          weight_kg?: number | null; height_cm?: number | null
          fitness_goal?: FitnessGoal | null; diet_preference?: DietPreference | null
          activity_level?: ActivityLevel | null; onboarding_completed?: boolean
        }
        Update: Partial<Omit<ProfileRow, 'id' | 'created_at' | 'updated_at'>>
      }
      trainers: {
        Row:    TrainerRow
        Insert: {
          user_id: string; slug: string; title: string; bio: string
          specialization: string; experience_years: number
          clients_helped?: number; certifications?: string[]; achievements?: string[]
          whatsapp?: string | null; instagram_url?: string | null; is_active?: boolean
        }
        Update: Partial<Omit<TrainerRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
      }
      diet_plans: {
        Row:    DietPlanRow
        Insert: {
          trainer_id: string; title: string; slug: string; description: string
          category: PlanCategory; price: number; original_price?: number | null
          duration_weeks: number; meals_per_day: number; calories_range: string
          features?: string[]; is_published?: boolean; is_popular?: boolean
          thumbnail_url?: string | null; stripe_price_id?: string | null
          document_path?: string | null
        }
        Update: Partial<Omit<DietPlanRow, 'id' | 'trainer_id' | 'created_at' | 'updated_at'>>
      }
      purchases: {
        Row:    PurchaseRow
        Insert: {
          user_id: string; plan_id: string; amount: number
          currency?: string; status?: PaymentStatus
          stripe_payment_intent_id?: string | null; stripe_session_id?: string | null
        }
        Update: Partial<Pick<PurchaseRow, 'status' | 'stripe_payment_intent_id' | 'stripe_session_id'>>
      }
      coaching_requests: {
        Row:    CoachingRequestRow
        Insert: {
          user_id: string; trainer_id: string; message: string; goal: string
          status?: CoachingStatus; trainer_note?: string | null
        }
        Update: Partial<{
          status: CoachingStatus; trainer_note: string | null; goal: string; message: string
        }>
      }
      testimonials: {
        Row:    TestimonialRow
        Insert: {
          trainer_id: string; display_name: string; quote: string
          user_id?: string | null; location?: string | null
          before_weight?: string | null; after_weight?: string | null
          weight_lost?: string | null; duration?: string | null
          rating?: number; is_published?: boolean
        }
        Update: Partial<Omit<TestimonialRow, 'id' | 'created_at'>>
      }
      transformations: {
        Row:    TransformationRow
        Insert: {
          trainer_id: string; display_name: string
          before_image_url: string; after_image_url: string
          user_id?: string | null; duration_weeks?: number | null
          weight_lost_kg?: number | null; description?: string | null; is_published?: boolean
        }
        Update: Partial<Omit<TransformationRow, 'id' | 'created_at'>>
      }
    }
    Views:     Record<string, never>
    Functions: {
      user_has_purchased:  { Args: { plan_uuid: string }; Returns: boolean }
      current_user_role:   { Args: Record<string, never>; Returns: UserRole }
      is_trainer_or_admin: { Args: Record<string, never>; Returns: boolean }
    }
    Enums: {
      user_role:       UserRole
      plan_category:   PlanCategory
      coaching_status: CoachingStatus
      payment_status:  PaymentStatus
      activity_level:  ActivityLevel
      fitness_goal:    FitnessGoal
      diet_preference: DietPreference
    }
  }
}

// ── Joined / enriched types (for UI) ─────────────────────────────────────────

/** DietPlan joined with trainer profile */
export interface DietPlanWithTrainer extends DietPlanRow {
  trainer: Pick<TrainerRow, 'id' | 'slug' | 'title'> & { profile: Pick<ProfileRow, 'full_name' | 'avatar_url'> }
}

/** Purchase joined with plan info */
export interface PurchaseWithPlan extends PurchaseRow {
  diet_plan: Pick<DietPlanRow, 'id' | 'title' | 'slug' | 'thumbnail_url' | 'category'>
}

/** Coaching request joined with trainer + user profiles */
export interface CoachingRequestWithDetails extends CoachingRequestRow {
  trainer: Pick<TrainerRow, 'id' | 'slug'> & { profile: Pick<ProfileRow, 'full_name' | 'avatar_url'> }
  profile: Pick<ProfileRow, 'full_name' | 'avatar_url' | 'email'>
}
