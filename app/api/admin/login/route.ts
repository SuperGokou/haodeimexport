import { NextRequest, NextResponse } from 'next/server'
import { adminCookieOptions, createAdminSession, getAdminPassword } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const password = typeof body?.password === 'string' ? body.password : ''
  const adminPassword = getAdminPassword()

  if (!adminPassword) {
    return NextResponse.json(
      { error: 'Admin password is not configured on this deployment.' },
      { status: 503 }
    )
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set({
    ...adminCookieOptions(),
    value: createAdminSession()
  })
  return response
}
