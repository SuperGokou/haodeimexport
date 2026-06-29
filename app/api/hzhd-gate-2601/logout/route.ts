import { NextResponse } from 'next/server'
import { clearAdminCookieOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set({
    ...clearAdminCookieOptions(),
    value: ''
  })
  return response
}
