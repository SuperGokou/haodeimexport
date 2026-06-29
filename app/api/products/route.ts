import { NextResponse } from 'next/server'
import { getCompany, getProducts, publicProducts } from '@/lib/data-store'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const [products, company] = await Promise.all([getProducts(), getCompany()])
  return NextResponse.json({
    products: publicProducts(products),
    company
  })
}
