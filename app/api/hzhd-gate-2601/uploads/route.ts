import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/auth'
import { saveProductImage } from '@/lib/data-store'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const maxUploadBytes = 4 * 1024 * 1024
const allowedTypes: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const form = await request.formData().catch(() => null)
  const file = form?.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Please choose an image file.' }, { status: 400 })
  }

  const extension = allowedTypes[file.type]
  if (!extension) {
    return NextResponse.json({ error: 'Only JPG, PNG, and WebP images are supported.' }, { status: 400 })
  }

  if (file.size > maxUploadBytes) {
    return NextResponse.json({ error: 'Image is too large. Please keep it under 4MB.' }, { status: 413 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  if (!buffer.length) {
    return NextResponse.json({ error: 'Image file is empty.' }, { status: 400 })
  }

  const baseName = safeBaseName(file.name.replace(/\.[^.]+$/, '')) || 'product-image'
  const fileName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${baseName}.${extension}`
  const url = await saveProductImage(fileName, buffer)

  return NextResponse.json({
    url,
    fileName,
    size: file.size,
    recommended: { width: 1600, height: 1100 },
    maxUploadBytes
  })
}

function safeBaseName(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}
