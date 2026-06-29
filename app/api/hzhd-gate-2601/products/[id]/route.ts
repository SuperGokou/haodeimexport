import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/auth'
import { getProducts, saveProducts } from '@/lib/data-store'
import { formatDeepSeekAdminError, translateProductToEnglish } from '@/lib/deepseek'
import { normalizeProduct } from '@/lib/product-utils'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json().catch(() => null)
  const products = await getProducts()
  const previous = products.find((product) => product.id === id)

  if (!previous) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  const product = normalizeProduct({ ...body?.product, id }, previous)
  const shouldTranslate = body?.autoTranslate !== false
  let finalProduct = product

  if (shouldTranslate) {
    try {
      const englishTranslation = await translateProductToEnglish(product)

      finalProduct = {
        ...product,
        translations: {
          ...product.translations,
          en: { ...englishTranslation, translationStatus: 'ai' }
        }
      }
    } catch (error) {
      return NextResponse.json({ error: formatDeepSeekAdminError(error) }, { status: 502 })
    }
  }

  await saveProducts(products.map((item) => (item.id === id ? finalProduct : item)))
  return NextResponse.json({ product: finalProduct })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const products = await getProducts()
  await saveProducts(products.filter((product) => product.id !== id))
  return NextResponse.json({ ok: true })
}
