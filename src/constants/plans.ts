import { formatPrice } from '@/lib/utils'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type PlanCategoryKey =
  | 'all'
  | 'fat_loss'
  | 'muscle_gain'
  | 'vegetarian'
  | 'keto'
  | 'beginner'
  | 'advanced'

export interface MealExample {
  time: string
  name: string
  calories: string
  protein: string
}

export interface PlanWeek {
  label: string
  focus: string
  description: string
}

export interface PlanFAQItem {
  question: string
  answer: string
}

export interface DetailedPlan {
  // ── Core fields (shown on card + detail) ──
  id: string
  slug: string
  title: string
  tagline: string
  description: string
  longDescription: string
  category: PlanCategoryKey
  price: number
  originalPrice?: number
  durationWeeks: number
  mealsPerDay: number
  caloriesRange: string
  caloriesMin: number
  caloriesMax: number
  trainerName: string
  trainerSlug: string
  trainerTitle: string
  isPopular?: boolean
  isFeatured?: boolean
  thumbnailGradient: string   // CSS gradient for placeholder
  accentColor: string

  // ── Card quick-stats ──
  features: string[]

  // ── Detail page ──
  targetAudience: string[]
  notFor: string[]
  whatsIncluded: { icon: string; title: string; description: string }[]
  sampleDay: MealExample[]
  weekBreakdown: PlanWeek[]
  faqs: PlanFAQItem[]
  relatedSlugs: string[]

  // ── Social proof ──
  totalPurchases: number
  rating: number
  reviewCount: number
}

// ─────────────────────────────────────────────
// Category meta
// ─────────────────────────────────────────────

export const CATEGORIES: { key: PlanCategoryKey; label: string; emoji: string }[] = [
  { key: 'all',         label: 'All Plans',    emoji: '✦' },
  { key: 'fat_loss',    label: 'Fat Loss',     emoji: '🔥' },
  { key: 'muscle_gain', label: 'Muscle Gain',  emoji: '💪' },
  { key: 'vegetarian',  label: 'Vegetarian',   emoji: '🥗' },
  { key: 'keto',        label: 'Keto',         emoji: '⚡' },
  { key: 'beginner',    label: 'Beginner',     emoji: '🌱' },
  { key: 'advanced',    label: 'Advanced',     emoji: '🏆' },
]

export const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'duration',   label: 'Duration' },
  { value: 'popular',    label: 'Most Popular' },
] as const

export type SortOption = typeof SORT_OPTIONS[number]['value']

// ─────────────────────────────────────────────
// Plan data
// ─────────────────────────────────────────────

export const DETAILED_PLANS: DetailedPlan[] = [
  // ── 1. Fat Loss Starter ────────────────────
  {
    id:              'fat-loss-starter',
    slug:            'fat-loss-starter',
    title:           'Fat Loss Starter',
    tagline:         'Your first step to a leaner body — no extremes, just results.',
    category:        'fat_loss',
    price:           999,
    originalPrice:   1499,
    durationWeeks:   4,
    mealsPerDay:     4,
    caloriesRange:   '1,400–1,700 kcal',
    caloriesMin:     1400,
    caloriesMax:     1700,
    trainerName:     'Vishal',
    trainerSlug:     'vishal',
    trainerTitle:    'Head Coach — Fat Loss & Strength',
    isPopular:       false,
    isFeatured:      true,
    thumbnailGradient: 'linear-gradient(135deg, #1C1917 0%, #44403C 50%, #78350F 100%)',
    accentColor:     '#CA8A04',
    totalPurchases:  312,
    rating:          4.8,
    reviewCount:     87,
    features: [
      'Full 4-week meal plan with recipes',
      'Daily macro & calorie targets',
      'Grocery shopping list',
      'Snack & cheat meal guidance',
      'Email support',
    ],
    description:
      'A structured 4-week plan designed to ignite your metabolism and shed initial body fat with sustainable habits.',
    longDescription:
      `The Fat Loss Starter is Vishal's entry-level programme designed for people who want to lose weight without completely overhauling their life.

Over 4 weeks, you'll follow a calorie-controlled meal plan built around Indian food you actually enjoy. No bland boiled chicken. No skipping family dinners. Just a smart framework that puts you in a sustainable caloric deficit.

By the end of 4 weeks, most clients lose 2–4 kg, build healthier eating habits, and understand how nutrition actually works for their body. This plan is the foundation everything else is built on.`,
    targetAudience: [
      'Complete beginners to structured eating',
      'People who have tried dieting before but struggled with consistency',
      'Anyone who wants to lose 4–8 kg total',
      'Those who want to understand how calories and macros work',
    ],
    notFor: [
      'People who want an extreme crash diet',
      'Athletes with high caloric needs (>2500 kcal)',
    ],
    whatsIncluded: [
      {
        icon: 'FileText',
        title: '4-Week Meal Plan',
        description: 'Day-by-day meals for all 28 days. Breakfast, lunch, dinner, and 1 snack.',
      },
      {
        icon: 'Calculator',
        title: 'Your Personal Macros',
        description: 'Protein, carbs, and fat targets calculated specifically for your body and goal.',
      },
      {
        icon: 'ShoppingCart',
        title: 'Weekly Grocery Lists',
        description: 'Exact quantities of everything you need. No waste, no guessing.',
      },
      {
        icon: 'ChefHat',
        title: '25+ Indian Recipes',
        description: 'Calorie-counted recipes that fit your plan. Dal, sabzi, roti, rice — all included.',
      },
      {
        icon: 'Mail',
        title: 'Email Support',
        description: 'Questions? Email Vishal and get a response within 24 hours.',
      },
      {
        icon: 'Download',
        title: 'PDF Download',
        description: 'Download your plan once and access it forever. No subscription needed.',
      },
    ],
    sampleDay: [
      { time: '7:30 AM',  name: 'Oats Upma + 2 Boiled Eggs',          calories: '380 kcal', protein: '22g' },
      { time: '1:00 PM',  name: '2 Chapati + Dal + Sabzi + Curd',      calories: '480 kcal', protein: '18g' },
      { time: '4:30 PM',  name: 'Greek Yogurt + Handful of Almonds',   calories: '220 kcal', protein: '14g' },
      { time: '8:00 PM',  name: 'Grilled Chicken / Paneer + Salad',    calories: '420 kcal', protein: '35g' },
    ],
    weekBreakdown: [
      { label: 'Week 1', focus: 'Foundation',    description: 'Establishing your calorie baseline and building the habit of tracking meals.' },
      { label: 'Week 2', focus: 'Adaptation',    description: 'Your body adjusts. We fine-tune portions and introduce smarter food swaps.' },
      { label: 'Week 3', focus: 'Acceleration',  description: 'Tighter deficits as your metabolism adapts. Cheat meal strategy introduced.' },
      { label: 'Week 4', focus: 'Consolidation', description: 'Locking in habits for long-term success. Transition plan for after week 4.' },
    ],
    faqs: [
      {
        question: 'Can I follow this plan if I\'m vegetarian?',
        answer: 'Yes. The plan includes vegetarian meal swaps for every non-veg meal. Just let us know your preference and we\'ll send the veg version.',
      },
      {
        question: 'Do I need to count calories every day?',
        answer: 'In week 1, yes — tracking helps you understand portions. By week 3, most clients stop counting because they\'ve internalised the habit.',
      },
      {
        question: 'What if I miss a day?',
        answer: 'Missing one day doesn\'t derail your progress. The plan builds in flexibility. Just pick up the next day — no punishment, no guilt.',
      },
      {
        question: 'Is this plan suitable for someone with diabetes?',
        answer: 'Consult your doctor before starting any diet plan. While this plan is low-GI friendly, it is not a medically supervised programme.',
      },
    ],
    relatedSlugs: ['fat-loss-pro', 'keto-reset', 'veg-fat-loss'],
  },

  // ── 2. Fat Loss Pro ────────────────────────
  {
    id:              'fat-loss-pro',
    slug:            'fat-loss-pro',
    title:           'Fat Loss Pro',
    tagline:         '12 weeks. A fundamentally different body.',
    category:        'fat_loss',
    price:           2499,
    originalPrice:   3499,
    durationWeeks:   12,
    mealsPerDay:     5,
    caloriesRange:   '1,600–2,000 kcal',
    caloriesMin:     1600,
    caloriesMax:     2000,
    trainerName:     'Vishal',
    trainerSlug:     'vishal',
    trainerTitle:    'Head Coach — Fat Loss & Strength',
    isPopular:       true,
    isFeatured:      true,
    thumbnailGradient: 'linear-gradient(135deg, #1C1917 0%, #431407 50%, #7C2D12 100%)',
    accentColor:     '#F97316',
    totalPurchases:  641,
    rating:          4.9,
    reviewCount:     203,
    features: [
      'Progressive caloric cycling (deficit → refeed)',
      'Refeed days to prevent metabolic slowdown',
      'Weekly check-in templates',
      '24/7 WhatsApp support',
      'Supplement guide (optional)',
      'Training plan pairing guide',
    ],
    description:
      '12-week progressive cutting plan for those serious about sustainable fat loss and visible results.',
    longDescription:
      `The Fat Loss Pro is Vishal's signature programme and the plan that 600+ clients have used to achieve their most dramatic transformations.

Unlike the starter plan, the Pro uses advanced nutrition periodisation — strategically cycling your calories and macros week by week to prevent plateaus, protect muscle, and keep your metabolism firing.

Refeed days are built in. Recovery weeks are planned. This isn't just a diet — it's a 12-week system engineered to get you to your goal and keep you there.

Most Pro clients lose 8–14 kg over 12 weeks. Some lose more. The key is the progressive structure — your body never fully adapts because the plan keeps changing.`,
    targetAudience: [
      'People who have tried dieting before and hit plateaus',
      'Those who want 8–15 kg total fat loss',
      'Anyone ready to commit to a 12-week transformation',
      'People who want structure, science, and support',
    ],
    notFor: [
      'People looking for a 2-week quick fix',
      'Those who are not ready to change their eating habits',
    ],
    whatsIncluded: [
      {
        icon: 'FileText',
        title: '12-Week Progressive Meal Plan',
        description: 'Phases 1–3 each with different caloric targets. Deficit → Refeed → Consolidation.',
      },
      {
        icon: 'BarChart',
        title: 'Weekly Caloric Cycling',
        description: 'Scheduled refeed days prevent metabolic adaptation and reduce diet fatigue.',
      },
      {
        icon: 'MessageCircle',
        title: 'WhatsApp Support',
        description: '24/7 access to Vishal for questions, accountability, and real-time adjustments.',
      },
      {
        icon: 'ClipboardList',
        title: 'Weekly Check-In Templates',
        description: 'Structured templates to review your week and plan the next one.',
      },
      {
        icon: 'Pill',
        title: 'Supplement Guide',
        description: 'Evidence-based supplement recommendations (creatine, protein, multivitamins). Always optional.',
      },
      {
        icon: 'Dumbbell',
        title: 'Training Plan Pairing',
        description: 'How to sync your training with your nutrition phases for maximum fat loss.',
      },
    ],
    sampleDay: [
      { time: '7:00 AM',  name: 'Protein Oats + Berries + Black Coffee',   calories: '350 kcal', protein: '28g' },
      { time: '10:30 AM', name: 'Paneer Salad Bowl',                        calories: '280 kcal', protein: '22g' },
      { time: '1:00 PM',  name: '2 Roti + Chicken Curry + Salad',           calories: '520 kcal', protein: '38g' },
      { time: '4:00 PM',  name: 'Protein Shake + Banana (Pre-Workout)',     calories: '250 kcal', protein: '25g' },
      { time: '8:00 PM',  name: 'Baked Fish + Roasted Vegetables',          calories: '420 kcal', protein: '40g' },
    ],
    weekBreakdown: [
      { label: 'Weeks 1–3',  focus: 'Foundation Phase',     description: 'Baseline calories, habit formation, tracking protocols.' },
      { label: 'Weeks 4–7',  focus: 'Deficit Phase',        description: 'Progressive caloric reduction with scheduled refeed days.' },
      { label: 'Weeks 8–10', focus: 'Acceleration Phase',   description: 'Deeper cuts, carb cycling, strategic cheats.' },
      { label: 'Weeks 11–12', focus: 'Peak & Maintenance',  description: 'Final push + transition plan to maintain results.' },
    ],
    faqs: [
      {
        question: 'How is this different from the Starter plan?',
        answer: 'The Pro uses advanced caloric cycling, planned refeed days, and 3x the duration. It\'s designed for people who want serious results, not just a starting point.',
      },
      {
        question: 'Do I need a gym to follow this plan?',
        answer: 'No. The nutrition plan works with any training style — gym, home workouts, or even just walking. The training pairing guide covers all scenarios.',
      },
      {
        question: 'What happens after 12 weeks?',
        answer: 'The final 2 weeks include a transition to maintenance calories. You\'ll know exactly how to eat to keep your results without continuing to diet.',
      },
      {
        question: 'Can I eat out while on this plan?',
        answer: 'Yes. Week 2 includes a restaurant guide with macro estimates for common Indian restaurant dishes and fast food options.',
      },
    ],
    relatedSlugs: ['fat-loss-starter', 'keto-reset', 'muscle-builder-beginner'],
  },

  // ── 3. Muscle Builder Beginner ─────────────
  {
    id:              'muscle-builder-beginner',
    slug:            'muscle-builder-beginner',
    title:           'Muscle Builder — Beginner',
    tagline:         'Learn to eat for growth. Build your foundation right.',
    category:        'muscle_gain',
    price:           1299,
    originalPrice:   1799,
    durationWeeks:   6,
    mealsPerDay:     5,
    caloriesRange:   '2,200–2,600 kcal',
    caloriesMin:     2200,
    caloriesMax:     2600,
    trainerName:     'Sharon',
    trainerSlug:     'sharon',
    trainerTitle:    'Nutrition & Muscle Coach',
    isPopular:       false,
    isFeatured:      true,
    thumbnailGradient: 'linear-gradient(135deg, #1C1917 0%, #1e1b4b 50%, #312e81 100%)',
    accentColor:     '#A78BFA',
    totalPurchases:  287,
    rating:          4.7,
    reviewCount:     94,
    features: [
      'High-protein meal templates (1.8–2.2g/kg)',
      'Pre & post workout nutrition timing',
      'Calorie surplus calculator included',
      'Supplement guide for beginners',
      'Vegetarian protein alternatives',
      'Email support',
    ],
    description:
      'The perfect starting point for muscle building. Learn to eat for growth with a structured 6-week plan.',
    longDescription:
      `Building muscle is 70% nutrition. Most beginners get this wrong — eating too little, the wrong macros, or at the wrong times. The Muscle Builder Beginner fixes all of that.

Over 6 weeks, Sharon walks you through the fundamentals of muscle-building nutrition: caloric surplus, protein targets, meal timing, and recovery nutrition. Every concept is explained in plain English with practical examples.

By the end of 6 weeks, you'll have gained 1–3 kg of lean muscle (expect more if you're new to training), and more importantly, you'll understand exactly why each meal is designed the way it is.`,
    targetAudience: [
      'Complete beginners to muscle building and nutrition',
      'People who are "skinny" and want to gain healthy weight',
      'Those who train but don\'t know how to eat for it',
      'Women who want to build lean muscle without getting "bulky"',
    ],
    notFor: [
      'Advanced lifters who have already mastered nutrition basics',
      'People looking for an aggressive bulk (this is a lean approach)',
    ],
    whatsIncluded: [
      {
        icon: 'FileText',
        title: '6-Week High-Protein Meal Plan',
        description: 'Day-by-day meals engineered for muscle synthesis. 5 meals/day including pre/post workout.',
      },
      {
        icon: 'Clock',
        title: 'Meal Timing Guide',
        description: 'When to eat what for maximum muscle protein synthesis. Pre-workout, post-workout, and overnight meals.',
      },
      {
        icon: 'Calculator',
        title: 'Calorie Surplus Calculator',
        description: 'Calculate exactly how many calories you need to gain muscle without excess fat.',
      },
      {
        icon: 'Leaf',
        title: 'Vegetarian Protein Guide',
        description: 'Complete list of plant-based proteins and how to combine them for all essential amino acids.',
      },
      {
        icon: 'Pill',
        title: 'Beginner Supplement Stack',
        description: 'The 3 supplements worth taking as a beginner (creatine, protein, vitamin D). Everything else is optional.',
      },
    ],
    sampleDay: [
      { time: '7:30 AM',  name: 'Protein Oats + Banana + 3 Eggs',         calories: '550 kcal', protein: '38g' },
      { time: '10:00 AM', name: 'Greek Yogurt + Mixed Nuts + Fruit',       calories: '320 kcal', protein: '20g' },
      { time: '1:00 PM',  name: '3 Roti + Chicken Dal + Sabzi + Rice',     calories: '680 kcal', protein: '42g' },
      { time: '5:00 PM',  name: 'Pre-Workout: Banana + Protein Shake',     calories: '320 kcal', protein: '28g' },
      { time: '8:30 PM',  name: 'Paneer Bhurji / Egg Curry + 2 Roti',     calories: '530 kcal', protein: '35g' },
    ],
    weekBreakdown: [
      { label: 'Weeks 1–2', focus: 'Baseline & Protein',  description: 'Setting your surplus and hitting daily protein targets consistently.' },
      { label: 'Weeks 3–4', focus: 'Meal Timing',         description: 'Optimising pre/post workout meals for recovery and growth.' },
      { label: 'Weeks 5–6', focus: 'Progressive Loading',  description: 'Increasing calories as training volume increases.' },
    ],
    faqs: [
      {
        question: 'Will I gain fat on this plan?',
        answer: 'A small amount of fat gain is normal during a muscle-building phase (lean bulk). This plan minimises it by using a conservative surplus of 200–300 kcal above maintenance.',
      },
      {
        question: 'I\'m vegetarian. Can I follow this?',
        answer: 'Absolutely. Sharon has designed complete vegetarian versions of every meal. Hitting your protein target is very achievable with paneer, curd, legumes, and plant protein sources.',
      },
      {
        question: 'How quickly will I see results?',
        answer: 'In terms of strength: within 2 weeks. In terms of visible muscle: 4–6 weeks with consistent training. Muscle building is slower than fat loss, but the changes are permanent.',
      },
    ],
    relatedSlugs: ['lean-bulk-protocol', 'veg-fat-loss', 'fat-loss-starter'],
  },

  // ── 4. Lean Bulk Protocol ─────────────────
  {
    id:              'lean-bulk-protocol',
    slug:            'lean-bulk-protocol',
    title:           'Lean Bulk Protocol',
    tagline:         '16 weeks. Maximum muscle, minimum fat. No compromises.',
    category:        'advanced',
    price:           3299,
    originalPrice:   4499,
    durationWeeks:   16,
    mealsPerDay:     6,
    caloriesRange:   '2,800–3,400 kcal',
    caloriesMin:     2800,
    caloriesMax:     3400,
    trainerName:     'Sharon',
    trainerSlug:     'sharon',
    trainerTitle:    'Nutrition & Muscle Coach',
    isPopular:       true,
    isFeatured:      true,
    thumbnailGradient: 'linear-gradient(135deg, #1C1917 0%, #2e1065 50%, #4c1d95 100%)',
    accentColor:     '#8B5CF6',
    totalPurchases:  423,
    rating:          5.0,
    reviewCount:     156,
    features: [
      'Caloric periodisation across 4 phases',
      'Deload week nutrition protocols',
      'Blood work interpretation guide',
      '1-on-1 monthly video call with Sharon',
      'Custom macro targets (not generic)',
      '24/7 WhatsApp support',
    ],
    description:
      '16-week clean bulk plan to pack on maximum muscle with minimal fat gain. Advanced periodised nutrition.',
    longDescription:
      `The Lean Bulk Protocol is Sharon's most advanced programme — a 16-week system for experienced individuals who want to maximise muscle gain without accumulating unnecessary body fat.

This isn't a "see food diet." Every calorie is accounted for. Every week is planned with specific caloric and macro targets that change based on your training phase, recovery needs, and progress data.

The programme includes a monthly 1-on-1 video call with Sharon where she reviews your progress, adjusts macros, and addresses anything the plan didn't anticipate. Real coaching, not a template.`,
    targetAudience: [
      'Experienced lifters (2+ years consistent training)',
      'People who want 6–10 kg of lean muscle in a single bulk cycle',
      'Those who have previously bulked and gained too much fat',
      'Athletes looking for sport-specific body composition improvements',
    ],
    notFor: [
      'Beginners who haven\'t mastered basic nutrition yet',
      'People who want quick results without commitment',
    ],
    whatsIncluded: [
      {
        icon: 'FileText',
        title: '16-Week Periodised Meal Plan',
        description: '4 distinct phases with different caloric and macro targets. Structured like a professional athlete\'s nutrition.',
      },
      {
        icon: 'Video',
        title: 'Monthly 1-on-1 Call',
        description: '45-minute video session with Sharon to review progress, adjust macros, and troubleshoot.',
      },
      {
        icon: 'MessageCircle',
        title: '24/7 WhatsApp Access',
        description: 'Direct line to Sharon for questions, accountability, and real-time plan adjustments.',
      },
      {
        icon: 'FlaskConical',
        title: 'Blood Work Guide',
        description: 'Which markers to track, what optimal ranges look like, and how to use data to optimise your nutrition.',
      },
      {
        icon: 'RefreshCw',
        title: 'Deload Week Protocols',
        description: 'Planned deload weeks with specific nutrition to recover, reduce inflammation, and come back stronger.',
      },
    ],
    sampleDay: [
      { time: '7:00 AM',  name: 'Mass Gainer Breakfast: Oats + Eggs + Milk', calories: '700 kcal', protein: '45g' },
      { time: '10:30 AM', name: 'Chicken Sandwich + Greek Yogurt',             calories: '500 kcal', protein: '38g' },
      { time: '1:30 PM',  name: 'Rice + Chicken Curry + Dal + Sabzi',          calories: '750 kcal', protein: '50g' },
      { time: '5:00 PM',  name: 'Pre-Workout: Dates + Protein Shake',          calories: '380 kcal', protein: '30g' },
      { time: '8:00 PM',  name: 'Steak / Paneer + Sweet Potato + Salad',       calories: '620 kcal', protein: '48g' },
      { time: '10:30 PM', name: 'Casein Shake + Almonds (Pre-Sleep)',           calories: '280 kcal', protein: '28g' },
    ],
    weekBreakdown: [
      { label: 'Weeks 1–4',   focus: 'Baseline Phase',     description: 'Establish maintenance calories, measure body composition, plan macros.' },
      { label: 'Weeks 5–8',   focus: 'Growth Phase 1',     description: '+300 kcal surplus. Progressive overload in training synced with nutrition.' },
      { label: 'Weeks 9–12',  focus: 'Growth Phase 2',     description: 'Increased volume, higher protein, deload in week 11.' },
      { label: 'Weeks 13–16', focus: 'Peak & Transition',  description: 'Mini cut to sharpen physique. Transition to maintenance.' },
    ],
    faqs: [
      {
        question: 'How is this different from the Beginner plan?',
        answer: 'The Lean Bulk Protocol uses advanced periodisation, includes a monthly coaching call, and is designed for people who already understand nutrition basics and want to go to the next level.',
      },
      {
        question: 'Do I need to take blood tests?',
        answer: 'Not mandatory, but strongly recommended. The blood work guide tells you exactly which tests to order and what to look for. Many clients find it transformative.',
      },
      {
        question: 'What if I travel or have an unusual week?',
        answer: 'WhatsApp Sharon and she\'ll give you a modified plan for that week. Travel weeks, weddings, festivals — all handled.',
      },
    ],
    relatedSlugs: ['muscle-builder-beginner', 'fat-loss-pro', 'veg-fat-loss'],
  },

  // ── 5. Veg Fat Loss ────────────────────────
  {
    id:              'veg-fat-loss',
    slug:            'veg-fat-loss',
    title:           'Veg Fat Loss Plan',
    tagline:         'Plant-powered fat loss. No meat. No compromise.',
    category:        'vegetarian',
    price:           1499,
    originalPrice:   1999,
    durationWeeks:   8,
    mealsPerDay:     4,
    caloriesRange:   '1,500–1,800 kcal',
    caloriesMin:     1500,
    caloriesMax:     1800,
    trainerName:     'Sharon',
    trainerSlug:     'sharon',
    trainerTitle:    'Nutrition & Muscle Coach',
    isPopular:       false,
    isFeatured:      false,
    thumbnailGradient: 'linear-gradient(135deg, #1C1917 0%, #14532d 50%, #166534 100%)',
    accentColor:     '#4ADE80',
    totalPurchases:  198,
    rating:          4.8,
    reviewCount:     71,
    features: [
      '100% vegetarian — no meat or fish',
      'High-protein plant-based recipes',
      'Indian cuisine friendly',
      'Paneer, curd, legume heavy',
      'Snack ideas for every craving',
    ],
    description:
      'Prove that plant-based eating can power serious fat loss. 8 weeks of high-protein vegetarian meals.',
    longDescription:
      `The most common myth about vegetarian eating: you can't lose weight or build muscle without meat. The Veg Fat Loss Plan exists to demolish that myth.

Sharon has designed an 8-week vegetarian fat loss plan that's built around high-protein Indian ingredients — paneer, curd, dal, tofu, eggs, legumes — to keep you satiated while in a caloric deficit.

Every recipe is tested for Indian kitchens and Indian palates. This is not a Western salad plan with a tikka masala thrown in. It's built from the ground up for people who eat Indian food every day.`,
    targetAudience: [
      'Vegetarians who want to lose weight',
      'People who find high-protein vegetarian eating difficult',
      'Those who want Indian recipes that actually work for fat loss',
      'People with PCOS, thyroid issues, or insulin resistance',
    ],
    notFor: [
      'Non-vegetarians (there is a better plan for you)',
      'Vegans (this plan includes dairy and eggs)',
    ],
    whatsIncluded: [
      {
        icon: 'FileText',
        title: '8-Week Vegetarian Meal Plan',
        description: 'Day-by-day vegetarian meals. Every single recipe is high-protein and calorie-counted.',
      },
      {
        icon: 'ChefHat',
        title: '40+ Indian Vegetarian Recipes',
        description: 'Dal, paneer dishes, sabzi, egg preparations, curd-based meals — all with macros listed.',
      },
      {
        icon: 'Apple',
        title: 'High-Protein Snack Guide',
        description: '20 vegetarian snacks under 200 kcal. Roasted chana, makhana, protein smoothies, and more.',
      },
      {
        icon: 'Heart',
        title: 'PCOS-Friendly Variants',
        description: 'Low-GI meal swaps specifically for clients with PCOS or insulin resistance.',
      },
    ],
    sampleDay: [
      { time: '8:00 AM',  name: 'Moong Dal Chilla + Curd + Fruit',        calories: '380 kcal', protein: '22g' },
      { time: '1:00 PM',  name: 'Palak Paneer + 2 Roti + Salad',          calories: '480 kcal', protein: '28g' },
      { time: '4:30 PM',  name: 'Roasted Makhana + Green Tea',             calories: '150 kcal', protein: '5g'  },
      { time: '8:00 PM',  name: 'Tofu Bhurji + Brown Rice + Raita',       calories: '450 kcal', protein: '30g' },
    ],
    weekBreakdown: [
      { label: 'Weeks 1–2', focus: 'High-Protein Foundation', description: 'Building up protein intake while creating a caloric deficit.' },
      { label: 'Weeks 3–4', focus: 'Metabolic Boost',         description: 'Introducing metabolism-supporting foods and meal timing.' },
      { label: 'Weeks 5–6', focus: 'Deficit Deepening',       description: 'Refining the deficit. Smart food swaps for better satiety.' },
      { label: 'Weeks 7–8', focus: 'Habit Lock-In',           description: 'Preparing for long-term maintenance of vegetarian fat loss habits.' },
    ],
    faqs: [
      {
        question: 'Does this plan work for vegans?',
        answer: 'This plan includes dairy (paneer, curd, milk) and eggs. For a vegan plan, please contact Sharon directly for a custom option.',
      },
      {
        question: 'How do I hit my protein targets without meat?',
        answer: 'The plan is specifically designed around high-protein vegetarian sources: paneer, Greek yogurt, curd, eggs, dal, chickpeas, tofu, and protein supplements if needed.',
      },
    ],
    relatedSlugs: ['fat-loss-starter', 'muscle-builder-beginner', 'keto-reset'],
  },

  // ── 6. Keto Reset ─────────────────────────
  {
    id:              'keto-reset',
    slug:            'keto-reset',
    title:           'Keto Reset',
    tagline:         'Fat adaptation done right — Indian style.',
    category:        'keto',
    price:           1799,
    originalPrice:   2499,
    durationWeeks:   6,
    mealsPerDay:     3,
    caloriesRange:   '1,600–1,900 kcal',
    caloriesMin:     1600,
    caloriesMax:     1900,
    trainerName:     'Vishal',
    trainerSlug:     'vishal',
    trainerTitle:    'Head Coach — Fat Loss & Strength',
    isPopular:       false,
    isFeatured:      false,
    thumbnailGradient: 'linear-gradient(135deg, #1C1917 0%, #422006 50%, #78350F 100%)',
    accentColor:     '#F59E0B',
    totalPurchases:  174,
    rating:          4.6,
    reviewCount:     52,
    features: [
      'Keto induction protocol (weeks 1–2)',
      'Indian-adapted keto recipes',
      'Electrolyte & hydration guide',
      'Keto flu prevention strategies',
      'Carb cycling introduction (week 5+)',
    ],
    description:
      'Kickstart fat adaptation with a guided 6-week ketogenic plan — optimised for Indian tastes and ingredients.',
    longDescription:
      `The ketogenic diet is one of the most powerful fat loss tools available — and one of the most misunderstood. Most people fail keto in the first 2 weeks because they don't manage electrolytes, they eat the wrong fats, or they go too extreme too fast.

The Keto Reset is Vishal's guided 6-week entry into ketogenic eating, specifically designed for people who eat Indian food. Yes, you can do keto with Indian food. This plan proves it.

Butter chicken (without the roti). Saag with coconut cream. Egg bhurji. Paneer tikka. Indian food is actually keto-friendly — you just need to know which dishes to choose.`,
    targetAudience: [
      'People who have tried keto before but failed',
      'Those who eat Indian food and thought keto wasn\'t for them',
      'Anyone with significant weight to lose who wants fast initial results',
      'People with insulin resistance or type 2 diabetes (consult your doctor)',
    ],
    notFor: [
      'People who don\'t want to restrict carbohydrates significantly',
      'Athletes with high carb requirements',
    ],
    whatsIncluded: [
      {
        icon: 'FileText',
        title: '6-Week Keto Meal Plan',
        description: 'Phase 1: Strict induction. Phase 2: Adapted keto. Phase 3: Carb cycling intro.',
      },
      {
        icon: 'ChefHat',
        title: 'Indian Keto Recipe Collection',
        description: '30+ keto-friendly Indian recipes. From butter chicken to keto dosa — all macro-counted.',
      },
      {
        icon: 'Droplets',
        title: 'Electrolyte & Hydration Guide',
        description: 'Prevent keto flu with proper sodium, potassium, and magnesium management.',
      },
      {
        icon: 'BarChart',
        title: 'Carb Cycling Introduction',
        description: 'Weeks 5–6 introduce strategic carb refeeds for hormonal health and performance.',
      },
    ],
    sampleDay: [
      { time: '9:00 AM',  name: 'Bulletproof Coffee + 3 Scrambled Eggs',     calories: '420 kcal', protein: '24g' },
      { time: '1:30 PM',  name: 'Butter Chicken (no roti) + Salad',           calories: '580 kcal', protein: '45g' },
      { time: '8:00 PM',  name: 'Paneer Tikka + Sautéed Spinach + Cream',    calories: '620 kcal', protein: '38g' },
    ],
    weekBreakdown: [
      { label: 'Weeks 1–2', focus: 'Induction',        description: 'Strict keto (<20g carbs). Fat adaptation begins. Keto flu management.' },
      { label: 'Weeks 3–4', focus: 'Adaptation',       description: 'Fat burning optimised. Energy levels normalise. Recipes expand.' },
      { label: 'Weeks 5–6', focus: 'Carb Cycling Intro', description: 'Strategic carb refeeds. Transitioning toward sustainable low-carb eating.' },
    ],
    faqs: [
      {
        question: 'What is the keto flu and how do I avoid it?',
        answer: 'The keto flu is a temporary adjustment period (3–7 days) of fatigue, headaches, and brain fog. The plan includes a detailed electrolyte protocol to minimise or eliminate these symptoms.',
      },
      {
        question: 'Can vegetarians do this keto plan?',
        answer: 'Yes, with modifications. The plan includes vegetarian keto meal options using paneer, eggs, and full-fat dairy. Hitting protein targets requires more planning but is very doable.',
      },
      {
        question: 'How many grams of carbs is this plan?',
        answer: 'Weeks 1–4: under 20g net carbs. Weeks 5–6: up to 50g on refeed days, otherwise under 30g.',
      },
    ],
    relatedSlugs: ['fat-loss-starter', 'fat-loss-pro', 'veg-fat-loss'],
  },
]

// ─────────────────────────────────────────────
// Helper functions
// ─────────────────────────────────────────────

export function getPlan(slug: string): DetailedPlan | null {
  return DETAILED_PLANS.find((p) => p.slug === slug) ?? null
}

export function getRelatedPlans(slugs: string[]): DetailedPlan[] {
  return slugs
    .map((s) => getPlan(s))
    .filter(Boolean) as DetailedPlan[]
}

export function filterPlans(
  plans: DetailedPlan[],
  {
    category,
    search,
    trainer,
    sort,
  }: {
    category?: PlanCategoryKey
    search?: string
    trainer?: string
    sort?: SortOption
  }
): DetailedPlan[] {
  let filtered = [...plans]

  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.category === category)
  }

  if (trainer) {
    filtered = filtered.filter((p) => p.trainerSlug === trainer)
  }

  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.trainerName.toLowerCase().includes(q) ||
        p.category.replace('_', ' ').includes(q)
    )
  }

  switch (sort) {
    case 'price_asc':  filtered.sort((a, b) => a.price - b.price);            break
    case 'price_desc': filtered.sort((a, b) => b.price - a.price);            break
    case 'duration':   filtered.sort((a, b) => a.durationWeeks - b.durationWeeks); break
    case 'popular':    filtered.sort((a, b) => b.totalPurchases - a.totalPurchases); break
    case 'featured':
    default:
      filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
  }

  return filtered
}

export function formatDiscount(plan: DetailedPlan): string | null {
  if (!plan.originalPrice) return null
  const pct = Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)
  return `${pct}% OFF`
}
