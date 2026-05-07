import type { Metadata, Viewport } from 'next'
import { Bodoni_Moda, Jost } from 'next/font/google'
import './globals.css'

const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-bodoni',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jost',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://melior.fit'),
  verification: {
    // Add Google / Bing site verification tokens here when deploying
    // google: 'your-google-verification-token',
  },
  title: {
    default: 'Melior Fitness — Premium Coaching & Diet Plans',
    template: '%s | Melior Fitness',
  },
  description:
    'Transform your body with science-backed diet plans and 1-on-1 coaching from certified trainers Vishal & Sharon. Join 800+ clients who have changed their lives.',
  keywords: [
    'fitness coaching India',
    'diet plans online',
    'fat loss plan',
    'muscle gain nutrition',
    'personal trainer online',
    'Vishal fitness',
    'Sharon fitness coach',
    'Indian diet plan',
    'weight loss coaching',
  ],
  authors: [{ name: 'Melior Fitness' }],
  creator: 'Melior Fitness',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://melior.fit',
    siteName: 'Melior Fitness',
    title: 'Melior Fitness — Premium Coaching & Diet Plans',
    description:
      'Transform your body with science-backed diet plans and 1-on-1 coaching from certified trainers Vishal & Sharon.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Melior Fitness',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Melior Fitness — Premium Coaching & Diet Plans',
    description: 'Transform your body with science-backed diet plans and 1-on-1 personal coaching.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export const viewport: Viewport = {
  themeColor: '#0A0908',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bodoniModa.variable} ${jost.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-[var(--color-background)] text-[var(--color-foreground)] font-[var(--font-sans)] selection:bg-[rgba(202,138,4,0.3)] selection:text-[var(--color-brand-cream)]">
        {/* Skip to main content — accessibility for keyboard/screen reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[var(--color-brand-gold)] focus:text-[var(--color-brand-black)] focus:font-semibold focus:text-sm focus:font-[var(--font-sans)]"
        >
          Skip to main content
        </a>
        <div id="main-content">
          {children}
        </div>
      </body>
    </html>
  )
}
