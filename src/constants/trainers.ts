import { whatsappUrl } from '@/lib/utils'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface TrainerService {
  name: string
  description: string
  icon: string          // lucide icon name
  features: string[]
}

export interface TrainerPricingTier {
  name: string
  price: number
  originalPrice?: number
  duration: string
  description: string
  features: string[]
  isPopular?: boolean
  ctaLabel: string
}

export interface TrainerTransformation {
  id: string
  clientName: string
  location: string
  beforeWeight: string
  afterWeight: string
  weightLost: string
  duration: string
  quote: string
  goalType: string
}

export interface TrainerTestimonial {
  id: string
  name: string
  location: string
  rating: number
  quote: string
  result: string
  duration: string
}

export interface TrainerSpecialization {
  title: string
  description: string
  icon: string
}

export interface TrainerData {
  id: string
  slug: string
  name: string
  title: string
  tagline: string
  bio: string
  bioExtended: string
  experience: number
  clientsHelped: number
  successRate: number
  avgWeightLost: string
  accentColor: string           // CSS color for this trainer's theme
  whatsapp: string
  instagram?: string
  certifications: { name: string; issuer: string; year: number }[]
  specializations: TrainerSpecialization[]
  services: TrainerService[]
  pricing: TrainerPricingTier[]
  transformations: TrainerTransformation[]
  testimonials: TrainerTestimonial[]
  philosophy: string[]          // 3 core beliefs
  typicalWeek: string[]         // what a week looks like with this trainer
}

// ─────────────────────────────────────────────
// VISHAL
// ─────────────────────────────────────────────

const VISHAL: TrainerData = {
  id: 'vishal',
  slug: 'vishal',
  name: 'Vishal',
  title: 'Head Coach — Fat Loss & Strength',
  tagline: 'Science-backed transformations. No crash diets. No shortcuts.',
  accentColor: '#CA8A04',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_VISHAL ?? '+919999999999',
  instagram: 'https://instagram.com',
  experience: 8,
  clientsHelped: 500,
  successRate: 97,
  avgWeightLost: '11 kg',

  bio: 'Vishal has spent 8 years mastering the science of fat loss and body recomposition. His approach is rooted in metabolic physiology, progressive overload, and sustainable habit architecture — not crash diets or extreme restriction.',

  bioExtended: `After struggling with his own weight in his early 20s, Vishal turned to fitness science to find what actually works. What he discovered changed his life — and now he's dedicated to sharing that knowledge with everyone who walks through his virtual door.

Vishal's methodology combines precision nutrition with intelligent training. He doesn't believe in "willpower" as a strategy — he engineers your environment and systems so success becomes inevitable. Every plan is built around your life, your food preferences, and your schedule.

Over 8 years, he's worked with 500+ clients across India — from software engineers and homemakers to athletes and executives. The common thread? They all achieved results they thought were impossible.`,

  philosophy: [
    'Sustainability over speed — results that last a lifetime, not 30 days',
    'Data drives decisions — track what matters, ignore the noise',
    'Mindset is the missing macro — your beliefs shape your body',
  ],

  typicalWeek: [
    'Monday — Weekly check-in call + plan review',
    'Wednesday — Macro adjustment based on progress photos',
    'Daily — WhatsApp availability for questions & accountability',
    'Friday — Refeed/cheat meal planning for the weekend',
    'Sunday — Next week meal prep strategy',
  ],

  certifications: [
    { name: 'Certified Fitness Coach', issuer: 'National Academy of Sports Medicine (NASM)', year: 2017 },
    { name: 'Online Transformation Specialist', issuer: 'Precision Nutrition', year: 2018 },
    { name: 'Precision Nutrition Level 1', issuer: 'Precision Nutrition', year: 2019 },
    { name: 'Advanced Sports Nutrition', issuer: 'International Sports Sciences Association', year: 2021 },
    { name: 'Metabolic Analytics Certification', issuer: 'Carbon Diet Coach', year: 2023 },
  ],

  specializations: [
    {
      title: 'Fat Loss Engineering',
      description: 'Systematic caloric deficit design with metabolic adaptation prevention. No rebound weight.',
      icon: 'Flame',
    },
    {
      title: 'Body Recomposition',
      description: 'Simultaneously lose fat and build muscle — the holy grail that most coaches say is impossible.',
      icon: 'Dumbbell',
    },
    {
      title: 'Keto & Low-Carb Protocols',
      description: 'Indian-adapted ketogenic and low-carb strategies that work with your food culture.',
      icon: 'Zap',
    },
    {
      title: 'Metabolic Reset',
      description: 'Repair damaged metabolisms from years of crash dieting using reverse dieting protocols.',
      icon: 'RefreshCw',
    },
    {
      title: 'Strength Training Nutrition',
      description: 'Fuel your lifts, protect your muscle, and maximise performance through food periodisation.',
      icon: 'TrendingUp',
    },
    {
      title: 'Plateau Busting',
      description: 'Advanced techniques to break through weight loss stalls — diet breaks, refeeds, carb cycling.',
      icon: 'BarChart',
    },
  ],

  services: [
    {
      name: 'Custom Diet Plans',
      description: 'Fully personalised meal plans built around your goals, food preferences, and schedule.',
      icon: 'FileText',
      features: [
        'Macro targets calculated for your body',
        'Indian cuisine friendly recipes',
        'Meal timing optimised for your lifestyle',
        'Grocery shopping lists included',
        'PDF download + mobile-friendly format',
      ],
    },
    {
      name: '1-on-1 Online Coaching',
      description: 'Dedicated coaching relationship with weekly check-ins, plan adjustments, and full WhatsApp access.',
      icon: 'Video',
      features: [
        'Weekly video check-in calls',
        'Daily WhatsApp support',
        'Bi-weekly plan adjustments',
        'Progress photo analysis',
        'Training plan included',
        'Supplement recommendations',
      ],
    },
    {
      name: 'Transformation Programs',
      description: 'Structured 12–16 week programs with a clear start, milestones, and a defined goal.',
      icon: 'Target',
      features: [
        'Progressive nutrition periodisation',
        'Weekly milestones and benchmarks',
        'Body composition tracking',
        'End-of-program physique assessment',
        'Maintenance phase guidance',
      ],
    },
  ],

  pricing: [
    {
      name: 'Starter Plan',
      price: 999,
      originalPrice: 1499,
      duration: '4 weeks',
      description: 'Your first step — a structured 4-week diet plan to ignite fat loss.',
      features: [
        'Personalised 4-week meal plan',
        'Macro & calorie targets',
        'Grocery list',
        'Recipe ideas',
        'Email support',
        'PDF download',
      ],
      ctaLabel: 'Buy Plan',
    },
    {
      name: 'Pro Transformation',
      price: 2499,
      originalPrice: 3499,
      duration: '12 weeks',
      description: 'The complete system — 12 weeks to a fundamentally different body.',
      features: [
        'Everything in Starter',
        'Progressive caloric cycling',
        'Refeed day protocol',
        'Weekly check-in templates',
        '24/7 WhatsApp support',
        'Supplement guide',
        'Training plan pairing',
      ],
      isPopular: true,
      ctaLabel: 'Get Started',
    },
    {
      name: 'Elite 1-on-1 Coaching',
      price: 7999,
      duration: 'per month',
      description: 'Maximum results with full personal coaching access. Limited spots.',
      features: [
        'Everything in Pro',
        'Weekly 1-on-1 video calls',
        'Daily WhatsApp check-ins',
        'Real-time plan adjustments',
        'Blood work interpretation',
        'Unlimited revisions',
        'Priority response (<2 hours)',
        'Monthly progress report',
      ],
      ctaLabel: 'Apply Now',
    },
  ],

  transformations: [
    {
      id: 'v1',
      clientName: 'Arjun S.',
      location: 'Mumbai',
      beforeWeight: '94 kg',
      afterWeight: '76 kg',
      weightLost: '18 kg',
      duration: '14 weeks',
      quote: "I'd tried everything for 3 years. Vishal's plan was the first thing that actually worked and didn't make me miserable.",
      goalType: 'Fat Loss',
    },
    {
      id: 'v2',
      clientName: 'Kavya R.',
      location: 'Hyderabad',
      beforeWeight: '80 kg',
      afterWeight: '65 kg',
      weightLost: '15 kg',
      duration: '12 weeks',
      quote: "I never thought I could lose weight while still eating rice and chapati. Vishal proved me completely wrong.",
      goalType: 'Fat Loss',
    },
    {
      id: 'v3',
      clientName: 'Rohan M.',
      location: 'Pune',
      beforeWeight: '102 kg',
      afterWeight: '84 kg',
      weightLost: '18 kg',
      duration: '16 weeks',
      quote: 'The accountability and the science behind every decision made this feel different from day one.',
      goalType: 'Body Recomposition',
    },
    {
      id: 'v4',
      clientName: 'Sneha P.',
      location: 'Chennai',
      beforeWeight: '72 kg',
      afterWeight: '60 kg',
      weightLost: '12 kg',
      duration: '10 weeks',
      quote: 'As a working mom with zero time, the meal prep strategies Vishal gave me were a total game changer.',
      goalType: 'Fat Loss',
    },
  ],

  testimonials: [
    {
      id: 'vt1',
      name: 'Arjun Sharma',
      location: 'Mumbai',
      rating: 5,
      quote: "Vishal's Fat Loss Pro plan is the only thing that has ever worked for me. The structure, the support, the results — everything exceeded my expectations. I feel like a completely different person.",
      result: '18 kg lost',
      duration: '14 weeks',
    },
    {
      id: 'vt2',
      name: 'Kavya Reddy',
      location: 'Hyderabad',
      rating: 5,
      quote: "I tried everything before Melior. This was the first time I had a real plan tailored to my lifestyle. The WhatsApp support from Vishal kept me accountable every single day.",
      result: '15 kg lost',
      duration: '12 weeks',
    },
    {
      id: 'vt3',
      name: 'Karan Mehta',
      location: 'Delhi',
      rating: 5,
      quote: 'What sets Vishal apart is he actually explains the WHY behind every decision. I understand my body now in a way I never did before.',
      result: '9 kg lost',
      duration: '8 weeks',
    },
    {
      id: 'vt4',
      name: 'Divya Iyer',
      location: 'Bangalore',
      rating: 5,
      quote: "I was skeptical of online coaching but Vishal changed my mind completely. More attentive than any in-person trainer I've had.",
      result: '11 kg lost',
      duration: '10 weeks',
    },
  ],
}

// ─────────────────────────────────────────────
// SHARON
// ─────────────────────────────────────────────

const SHARON: TrainerData = {
  id: 'sharon',
  slug: 'sharon',
  name: 'Sharon',
  title: 'Nutrition & Muscle Coach',
  tagline: 'Build strength. Eat smart. Own your body.',
  accentColor: '#A78BFA',       // purple accent for Sharon
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_SHARON ?? '+919999999998',
  instagram: 'https://instagram.com',
  experience: 6,
  clientsHelped: 300,
  successRate: 96,
  avgWeightLost: '9 kg',

  bio: "Sharon specialises in muscle building, sports nutrition, and women's body composition. Her evidence-based approach combines precision macros with intelligent programming to help clients build strong, athletic physiques.",

  bioExtended: `Sharon's journey into fitness began as a competitive dancer, where she learned the profound relationship between nutrition, performance, and body composition. This foundation of athletic training shaped her unique approach — one that honours both strength and aesthetics.

After completing her Sports Nutrition Specialist certification, Sharon spent years working with athletes, postpartum women, and everyday people who wanted to build muscle without the extremes of bodybuilding culture. Her philosophy: food is fuel, not punishment.

Sharon's clients consistently report not just physical transformation, but a fundamentally different relationship with food and their bodies. She doesn't just change how you look — she changes how you think about yourself.`,

  philosophy: [
    'Muscle is medicine — building it protects you for decades to come',
    'Nutrition should empower, not restrict — food freedom is the goal',
    "Women deserve better than \"eat less, do more\" — that advice has failed millions",
  ],

  typicalWeek: [
    'Monday — Weekly progress review + macro check-in',
    'Tuesday — Recipe swap and meal prep planning',
    'Thursday — Mid-week form check (training videos welcome)',
    'Daily — WhatsApp support for food questions & wins',
    'Sunday — Next week game plan + mindset check',
  ],

  certifications: [
    { name: 'Sports Nutrition Specialist', issuer: 'International Society of Sports Nutrition (ISSN)', year: 2019 },
    { name: 'Certified Personal Trainer', issuer: 'American Council on Exercise (ACE)', year: 2018 },
    { name: 'Yoga Alliance RYT-200', issuer: 'Yoga Alliance', year: 2020 },
    { name: 'Women\'s Fitness Specialist', issuer: 'National Academy of Sports Medicine', year: 2021 },
    { name: 'Precision Nutrition Level 1', issuer: 'Precision Nutrition', year: 2022 },
  ],

  specializations: [
    {
      title: 'Muscle Building Nutrition',
      description: 'Scientific lean bulking strategies that maximise muscle gain while minimising fat accumulation.',
      icon: 'Dumbbell',
    },
    {
      title: "Women's Body Composition",
      description: 'Hormone-aware nutrition planning that works with your cycle, not against it.',
      icon: 'Heart',
    },
    {
      title: 'Sports Performance',
      description: 'Fuel strategies for athletes — pre/intra/post workout nutrition for peak output.',
      icon: 'Zap',
    },
    {
      title: 'Vegetarian Muscle Building',
      description: 'Proving that plant-based eating can build serious muscle with the right protein strategy.',
      icon: 'Leaf',
    },
    {
      title: 'Postpartum Fitness',
      description: 'Safe, evidence-based nutrition for new mothers rebuilding strength and confidence.',
      icon: 'Star',
    },
    {
      title: 'Intuitive Eating Integration',
      description: 'Bridging the gap between structured macros and long-term food freedom.',
      icon: 'Sparkles',
    },
  ],

  services: [
    {
      name: 'Muscle Building Plans',
      description: 'High-protein meal plans engineered for maximum muscle synthesis and recovery.',
      icon: 'FileText',
      features: [
        'Calorie surplus calculated precisely',
        'Protein targets per kg body weight',
        'Pre/post workout meal timing',
        'Progressive caloric adjustment',
        'Vegetarian options available',
        'Supplement stack guide',
      ],
    },
    {
      name: '1-on-1 Nutrition Coaching',
      description: 'A full coaching relationship — weekly calls, daily support, and real-time adjustments.',
      icon: 'Video',
      features: [
        'Weekly 45-minute video sessions',
        'Daily WhatsApp access',
        'Bi-weekly macro adjustments',
        'Menstrual cycle nutrition syncing',
        'Food journaling review',
        'Mindset & relationship with food',
      ],
    },
    {
      name: 'Transformation Packages',
      description: '8–16 week structured programs with milestone-based progression.',
      icon: 'Target',
      features: [
        'Phased nutrition periodisation',
        'Body composition benchmarks',
        'Progress photo analysis',
        'Strength tracking integration',
        'End-program assessment',
      ],
    },
  ],

  pricing: [
    {
      name: 'Muscle Builder Starter',
      price: 1299,
      originalPrice: 1799,
      duration: '6 weeks',
      description: 'Perfect first step into muscle building nutrition — structured and beginner-friendly.',
      features: [
        'Personalised 6-week plan',
        'High-protein meal templates',
        'Pre/post workout nutrition',
        'Calorie surplus calculator',
        'Supplement guide',
        'Email support',
      ],
      ctaLabel: 'Buy Plan',
    },
    {
      name: 'Lean Bulk Protocol',
      price: 3299,
      originalPrice: 4499,
      duration: '16 weeks',
      description: 'The complete lean bulk system — 16 weeks to maximum muscle with minimum fat.',
      features: [
        'Everything in Starter',
        'Caloric periodisation',
        'Deload week nutrition',
        'Blood work guidance',
        '1-on-1 monthly call',
        'Custom macro targets',
        'WhatsApp support',
      ],
      isPopular: true,
      ctaLabel: 'Get Started',
    },
    {
      name: 'Elite Coaching',
      price: 6999,
      duration: 'per month',
      description: 'Full personal coaching with Sharon. Maximum transformation, maximum support.',
      features: [
        'Everything in Lean Bulk',
        'Weekly video check-ins',
        'Cycle-synced nutrition',
        'Daily accountability',
        'Real-time plan edits',
        'Unlimited WhatsApp',
        'Priority response',
        'Monthly body composition report',
      ],
      ctaLabel: 'Apply Now',
    },
  ],

  transformations: [
    {
      id: 's1',
      clientName: 'Priya N.',
      location: 'Bangalore',
      beforeWeight: '68 kg',
      afterWeight: '58 kg',
      weightLost: '10 kg',
      duration: '10 weeks',
      quote: "Sharon's vegetarian plan showed me that plant-based eating can be absolutely delicious and effective.",
      goalType: 'Fat Loss',
    },
    {
      id: 's2',
      clientName: 'Rahul V.',
      location: 'Delhi',
      beforeWeight: '72 kg',
      afterWeight: '80 kg',
      weightLost: '+8 kg muscle',
      duration: '16 weeks',
      quote: "The Lean Bulk Protocol is the most comprehensive nutrition guide I've encountered. Sharon's attention to detail is extraordinary.",
      goalType: 'Muscle Gain',
    },
    {
      id: 's3',
      clientName: 'Meera K.',
      location: 'Kochi',
      beforeWeight: '75 kg',
      afterWeight: '63 kg',
      weightLost: '12 kg',
      duration: '12 weeks',
      quote: 'As a postpartum mom, I was scared to start. Sharon made it feel completely safe and manageable.',
      goalType: 'Body Recomposition',
    },
    {
      id: 's4',
      clientName: 'Anita S.',
      location: 'Mumbai',
      beforeWeight: '58 kg',
      afterWeight: '64 kg',
      weightLost: '+6 kg muscle',
      duration: '14 weeks',
      quote: "I went from skinny-fat to genuinely athletic. People at the gym keep asking me what changed. The answer is Sharon.",
      goalType: 'Muscle Gain',
    },
  ],

  testimonials: [
    {
      id: 'st1',
      name: 'Priya Nair',
      location: 'Bangalore',
      rating: 5,
      quote: "Sharon's vegetarian plan showed me that plant-based eating can be absolutely delicious and effective. I never felt deprived, and the results speak for themselves.",
      result: '10 kg lost',
      duration: '10 weeks',
    },
    {
      id: 'st2',
      name: 'Rahul Verma',
      location: 'Delhi',
      rating: 5,
      quote: "The Lean Bulk Protocol is the most comprehensive nutrition guide I've encountered. The 1-on-1 call each month made all the difference.",
      result: '8 kg muscle gained',
      duration: '16 weeks',
    },
    {
      id: 'st3',
      name: 'Anjali Mehta',
      location: 'Mumbai',
      rating: 5,
      quote: "Sharon understands women's bodies in a way most trainers don't. She factored in my cycle, my stress levels, everything. It felt truly personalised.",
      result: '8 kg lost',
      duration: '9 weeks',
    },
    {
      id: 'st4',
      name: 'Sruthi Krishnan',
      location: 'Chennai',
      rating: 5,
      quote: "I have PCOS and had given up on losing weight. Sharon built a plan that worked specifically for my condition. I am genuinely emotional about the results.",
      result: '14 kg lost',
      duration: '18 weeks',
    },
  ],
}

// ─────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────

export const TRAINER_DATA: Record<string, TrainerData> = {
  vishal: VISHAL,
  sharon: SHARON,
}

export const ALL_TRAINERS = Object.values(TRAINER_DATA)

export function getTrainerData(slug: string): TrainerData | null {
  return TRAINER_DATA[slug] ?? null
}

export function getTrainerWhatsAppUrl(trainer: TrainerData, message?: string) {
  return whatsappUrl(
    trainer.whatsapp,
    message ?? `Hi ${trainer.name}! I found your profile on Melior Fitness and I'm interested in your coaching. Can we connect?`
  )
}
