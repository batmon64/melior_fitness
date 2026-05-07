import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format price in INR */
export function formatPrice(amount: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Format large numbers (e.g. 1500 → 1.5k) */
export function formatCompact(n: number) {
  return new Intl.NumberFormat('en-IN', { notation: 'compact' }).format(n)
}

/** Pluralize a word */
export function pluralize(count: number, singular: string, plural?: string) {
  return count === 1 ? singular : (plural ?? `${singular}s`)
}

/** Sleep for ms milliseconds (use sparingly) */
export function sleep(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms))
}

/** Get initials from a full name */
export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/** Build a WhatsApp message URL */
export function whatsappUrl(phone: string, message: string) {
  const clean = phone.replace(/\D/g, '')
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
}
