import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

/**
 * Auth Callback Route
 * Handles:
 *   1. Email confirmation links (signup / password reset)
 *   2. OAuth provider redirects (Google, GitHub, etc.)
 *
 * Supabase sends users here after they click an email link.
 * We exchange the code for a session, then redirect.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)

  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  // Sanitise redirect — only allow relative paths (prevent open redirect)
  const safeNext = next.startsWith('/') ? next : '/dashboard'

  if (!code) {
    // No code — something went wrong with the email link
    return NextResponse.redirect(`${origin}/auth/login?error=missing_code`)
  }

  const cookieStore = await cookies()

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth/callback]', error.message)
    return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`)
  }

  // Session established — redirect to intended destination
  return NextResponse.redirect(`${origin}${safeNext}`)
}
