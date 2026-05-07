import type { Trainer } from '@/types'

// ─────────────────────────────────────────────
// Services
// ─────────────────────────────────────────────

export interface CoachingService {
  id:          string
  name:        string
  description: string
  longDescription: string
  icon:        string        // lucide icon name
  duration:    string
  includes:    string[]
  priceLabel:  string
  accentColor: string
  bestFor:     string
}

export const COACHING_SERVICES: CoachingService[] = [
  {
    id:          'personal_training',
    name:        'Personal Coaching',
    description: 'Full 1-on-1 coaching — training, nutrition, and accountability.',
    longDescription:
      'End-to-end transformation support. Your trainer designs both your workout programme and nutrition strategy, checks in with you weekly, and adjusts the plan in real time. The most effective way to transform your body.',
    icon:        'Dumbbell',
    duration:    '1 month minimum',
    includes: [
      'Custom training programme',
      'Personalised meal plan',
      'Weekly video check-ins',
      '24/7 WhatsApp access',
      'Progress photo reviews',
      'Supplement guidance',
    ],
    priceLabel:  'From ₹6,999/month',
    accentColor: '#CA8A04',
    bestFor:     'Maximum results with full support',
  },
  {
    id:          'diet_plan',
    name:        'Custom Diet Plan',
    description: 'A fully personalised nutrition plan built around your body and goals.',
    longDescription:
      'Your trainer analyses your body metrics, goals, food preferences, and lifestyle to create a plan that works for you specifically — not a template. Includes macro targets, meal timing, recipes, and a grocery list.',
    icon:        'Apple',
    duration:    '4–12 weeks',
    includes: [
      'Personalised macro targets',
      'Day-by-day meal plan',
      'Indian recipe collection',
      'Grocery shopping list',
      'Snack & cheat meal guide',
      'Email / WhatsApp support',
    ],
    priceLabel:  'From ₹999',
    accentColor: '#4ADE80',
    bestFor:     'Structured nutrition without full coaching',
  },
  {
    id:          'consultation_call',
    name:        'Consultation Call',
    description: 'A focused 30-minute strategy session with your chosen trainer.',
    longDescription:
      'Not sure where to start? Book a direct call with Vishal or Sharon. In 30 minutes they\'ll review your current situation, identify what\'s holding you back, and give you a clear roadmap — no sales pitch, just actionable advice.',
    icon:        'Video',
    duration:    '30 minutes',
    includes: [
      'Full situation analysis',
      'Goal-setting framework',
      'Personalised action plan',
      'Top 3 priority changes',
      'Q&A — ask anything',
      'Follow-up summary via WhatsApp',
    ],
    priceLabel:  '₹499',
    accentColor: '#A78BFA',
    bestFor:     'Clarity before committing to a programme',
  },
]

// ─────────────────────────────────────────────
// Goals
// ─────────────────────────────────────────────

export const COACHING_GOALS = [
  { value: 'fat_loss',           label: 'Lose Body Fat',         emoji: '🔥' },
  { value: 'muscle_gain',        label: 'Build Muscle',          emoji: '💪' },
  { value: 'body_recomposition', label: 'Body Recomposition',    emoji: '⚖️' },
  { value: 'athletic',           label: 'Athletic Performance',  emoji: '⚡' },
  { value: 'general_fitness',    label: 'General Fitness',       emoji: '🏃' },
  { value: 'postpartum',         label: 'Postpartum Recovery',   emoji: '🌸' },
  { value: 'plateau',            label: 'Break a Plateau',       emoji: '📈' },
  { value: 'wedding',            label: 'Wedding / Event Prep',  emoji: '💍' },
] as const

export type CoachingGoalValue = (typeof COACHING_GOALS)[number]['value']

// ─────────────────────────────────────────────
// Timelines
// ─────────────────────────────────────────────

export const TIMELINES = [
  { value: 'asap',      label: 'ASAP',          desc: 'Ready to start immediately' },
  { value: '2_weeks',   label: 'In 2 weeks',    desc: 'Just getting prepared' },
  { value: '1_month',   label: 'Next month',    desc: 'No rush, but soon' },
  { value: 'flexible',  label: 'Flexible',      desc: "I'll follow your recommendation" },
] as const

// ─────────────────────────────────────────────
// Contact preferences
// ─────────────────────────────────────────────

export const CONTACT_PREFS = [
  { value: 'whatsapp', label: 'WhatsApp', desc: 'Fast responses, voice notes welcome' },
  { value: 'email',    label: 'Email',    desc: 'Prefer written communication' },
  { value: 'call',     label: 'Phone Call', desc: 'Happy to talk it through' },
] as const

// ─────────────────────────────────────────────
// WhatsApp message builder
// ─────────────────────────────────────────────

export function buildWhatsAppMessage(data: {
  trainerName:      string
  serviceName:      string
  goal:             string
  currentSituation: string
  challenges:       string
  timeline:         string
  userName:         string
  userPhone:        string
}): string {
  return `Hi ${data.trainerName}! 🙏

I just submitted a coaching request on Melior Fitness. Here are my details:

*Service:* ${data.serviceName}
*Goal:* ${data.goal}
*Timeline:* ${data.timeline}

*My situation:*
${data.currentSituation}

*Main challenge:*
${data.challenges}

*My name:* ${data.userName}
*My number:* ${data.userPhone || 'Shared via app'}

Looking forward to working with you!`
}
