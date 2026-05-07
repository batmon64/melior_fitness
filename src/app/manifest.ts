import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             'Melior Fitness',
    short_name:       'Melior',
    description:      'Premium fitness coaching and science-backed diet plans.',
    start_url:        '/',
    display:          'standalone',
    background_color: '#0A0908',
    theme_color:      '#CA8A04',
    orientation:      'portrait',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
