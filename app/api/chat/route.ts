import { NextRequest, NextResponse } from 'next/server'
import { answerCustomerQuestion } from '@/lib/deepseek'
import { getCompany, getProducts, publicProducts } from '@/lib/data-store'
import type { Locale } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const message = typeof body?.message === 'string' ? body.message.trim() : ''
  const locale: Locale = body?.locale === 'zh' ? 'zh' : 'en'

  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  if (message.length > 2000) {
    return NextResponse.json({ error: 'Message is too long' }, { status: 400 })
  }

  const [products, company] = await Promise.all([getProducts(), getCompany()])
  const answer = await answerCustomerQuestion({
    locale,
    message,
    products: publicProducts(products),
    company
  })

  return NextResponse.json({ answer })
}
