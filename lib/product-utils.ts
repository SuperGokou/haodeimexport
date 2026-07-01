import type { Product, ProductTranslation } from './types'

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function normalizeProduct(input: Partial<Product>, previous?: Product): Product {
  const zh = input.translations?.zh || previous?.translations.zh
  const en = input.translations?.en || previous?.translations.en
  const fallbackName = zh?.name || en?.name || 'New Textile Product'
  const slug = input.slug || previous?.slug || slugify(en?.name || fallbackName) || cryptoSlug()

  const fallbackTranslation: ProductTranslation = {
    name: fallbackName,
    tagline: '',
    description: '',
    applications: [],
    specs: [],
    translationStatus: 'manual'
  }

  return {
    id: input.id || previous?.id || `prod-${cryptoSlug()}`,
    slug,
    sku: input.sku || previous?.sku || `HD-${Date.now().toString().slice(-6)}`,
    category: input.category || previous?.category || 'Home Textile',
    status: input.status || previous?.status || 'draft',
    featured: Boolean(input.featured ?? previous?.featured ?? false),
    collection: input.collection || previous?.collection || 'New Collection',
    image: input.image || previous?.image || '/images/haode-swatch-books.jpg',
    gallery: input.gallery?.length ? input.gallery : previous?.gallery || ['/images/haode-swatch-books.jpg'],
    colors: input.colors?.length ? input.colors : previous?.colors || ['#efe8db', '#a8845e', '#2d3c38'],
    updatedAt: new Date().toISOString(),
    translations: {
      en: en || fallbackTranslation,
      zh: zh || fallbackTranslation
    }
  }
}

function cryptoSlug() {
  return Math.random().toString(36).slice(2, 10)
}
