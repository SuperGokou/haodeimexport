import crypto from 'crypto'
import type { NextRequest } from 'next/server'

const cookieName = 'haode_admin'

type SessionPayload = {
  role: 'admin'
  exp: number
}

function secret() {
  return process.env.AUTH_SECRET || process.env.DEEPSEEK_API_KEY || 'haode-dev-secret'
}

function sign(payload: string) {
  return crypto.createHmac('sha256', secret()).update(payload).digest('base64url')
}

function encodeSession(payload: SessionPayload) {
  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  return `${body}.${sign(body)}`
}

function decodeSession(token?: string): SessionPayload | null {
  if (!token) return null
  const [body, signature] = token.split('.')
  if (!body || !signature || sign(body) !== signature) return null

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload
    if (payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export function getAdminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD
  if (process.env.NODE_ENV !== 'production') return 'haode2026'
  return ''
}

export function createAdminSession() {
  return encodeSession({
    role: 'admin',
    exp: Date.now() + 1000 * 60 * 60 * 12
  })
}

export function isAdminRequest(request: NextRequest) {
  const session = decodeSession(request.cookies.get(cookieName)?.value)
  return session?.role === 'admin'
}

export function adminCookieOptions() {
  return {
    name: cookieName,
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12
  }
}

export function clearAdminCookieOptions() {
  return {
    name: cookieName,
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  }
}
