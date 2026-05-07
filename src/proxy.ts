import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/** Routes that require authentication */
const PROTECTED_ROUTES = ['/dashboard', '/onboarding', '/checkout']

/** Routes that require trainer/admin role */
const TRAINER_ROUTES = ['/trainer-dashboard']

/** Redirect authenticated users away from these */
const AUTH_ROUTES = ['/auth/login', '/auth/signup']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  let response = NextResponse.next({ request })

  // Skip auth logic entirely if Supabase isn't configured yet
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) return response

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r))
  const isTrainerRoute = TRAINER_ROUTES.some((r) => pathname.startsWith(r))
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r))

  // Only hit Supabase when the route actually needs it
  if (!isProtected && !isTrainerRoute && !isAuthRoute) return response

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  // Refresh session — keeps auth token alive
  const { data: { user } } = await supabase.auth.getUser()

  // Unauthenticated user hitting protected route → redirect to login
  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // Authenticated user hitting auth routes → redirect to dashboard
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Trainer-only routes: verify role via profile
  if (user && isTrainerRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || (profile.role !== 'trainer' && profile.role !== 'admin')) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|icons|og-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
