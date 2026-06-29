import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/auth'
import { getProducts, saveProducts } from '@/lib/data-store'
import { translateProductToEnglish } from '@/lib/deepseek'
import { normalizeProduct } from '@/lib/product-utils'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const products = await getProducts()
  return NextResponse.json({ products })
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const product = normalizeProduct(body?.product)
  const shouldTranslate = body?.autoTranslate !== false
  const finalProduct = shouldTranslate
    ? { ...product, translations: { ...product.translations, en: await translateProductToEnglish(product) } }
    : product

  const products = await getProducts()
  await saveProducts([finalProduct, ...products.filter((item) => item.id !== finalProduct.id)])
  return NextResponse.json({ product: finalProduct })
}
