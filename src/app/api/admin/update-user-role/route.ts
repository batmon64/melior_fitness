import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { ProfileRow } from '@/types/supabase'

const schema = z.object({
  userId: z.string().uuid(),
  role:   z.enum(['user', 'trainer', 'admin']),
})

export async function POST(request: NextRequest) {
  try {
    const parsed = schema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Verify current user is admin
    const { data: profileData } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const profile = profileData as Pick<ProfileRow, 'role'> | null
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // Prevent demoting yourself
    if (parsed.data.userId === user.id && parsed.data.role !== 'admin') {
      return NextResponse.json({ error: 'Cannot change your own role' }, { status: 400 })
    }

    const { error } = await supabase
      .from('profiles')
      .update({ role: parsed.data.role } as never)
      .eq('id', parsed.data.userId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
