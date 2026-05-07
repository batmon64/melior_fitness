import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { ProfileRow } from '@/types/supabase'

const schema = z.object({
  requestId:   z.string().uuid(),
  status:      z.enum(['pending', 'active', 'completed', 'cancelled']),
  trainerNote: z.string().max(2000).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body   = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Verify trainer/admin role
    const { data: profileData } = await supabase
      .from('profiles').select('role').eq('id', user.id).single()
    const profile = profileData as Pick<ProfileRow, 'role'> | null
    if (!profile || (profile.role !== 'trainer' && profile.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { requestId, status, trainerNote } = parsed.data

    // Update the coaching request
    const { error } = await supabase
      .from('coaching_requests')
      .update({
        status,
        ...(trainerNote !== undefined && { trainer_note: trainerNote }),
      } as never)
      .eq('id', requestId)

    if (error) {
      console.error('[update-request]', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[update-request]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
