import { NextRequest, NextResponse } from 'next/server'
import { adminCookieOptions, createAdminSession, getAdminPassword } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const maxFailedAttempts = 5
const lockWindowMs = 10 * 60 * 1000
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>()

export async function POST(request: NextRequest) {
  const key = requestKey(request)
  const lock = activeLock(key)
  if (lock) {
    return NextResponse.json(
      { error: `Too many login attempts. Try again in ${lock} minutes.` },
      { status: 429 }
    )
  }

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
    recordFailedLogin(key)
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  loginAttempts.delete(key)
  const response = NextResponse.json({ ok: true })
  response.cookies.set({
    ...adminCookieOptions(),
    value: createAdminSession()
  })
  return response
}

function requestKey(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwardedFor || request.headers.get('x-real-ip') || 'local'
}

function activeLock(key: string) {
  const attempt = loginAttempts.get(key)
  if (!attempt?.lockedUntil) return 0
  const remaining = attempt.lockedUntil - Date.now()
  if (remaining <= 0) {
    loginAttempts.delete(key)
    return 0
  }
  return Math.ceil(remaining / 60000)
}

function recordFailedLogin(key: string) {
  const current = loginAttempts.get(key)
  const count = (current?.count || 0) + 1
  loginAttempts.set(key, {
    count,
    lockedUntil: count >= maxFailedAttempts ? Date.now() + lockWindowMs : 0
  })
}
