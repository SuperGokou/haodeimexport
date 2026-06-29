export type Locale = 'en' | 'zh'

export type ProductStatus = 'draft' | 'published'

export type ProductSpec = {
  label: string
  value: string
}

export type ProductTranslation = {
  name: string
  tagline: string
  description: string
  applications: string[]
  specs: ProductSpec[]
  seoTitle?: string
  seoDescription?: string
  translationStatus?: 'manual' | 'ai' | 'stale' | 'failed'
}

export type Product = {
  id: string
  slug: string
  sku: string
  category: string
  status: ProductStatus
  featured: boolean
  collection: string
  image: string
  gallery: string[]
  colors: string[]
  updatedAt: string
  translations: Record<Locale, ProductTranslation>
}

export type CompanyTranslation = {
  name: string
  shortName: string
  intro: string
  address: string
  serviceNote: string
}

export type CompanyInfo = {
  email: string
  phone: string
  whatsapp: string
  markets: string[]
  capabilities: string[]
  facts: {
    label: string
    value: string
  }[]
  translations: Record<Locale, CompanyTranslation>
}

export type SiteData = {
  products: Product[]
  company: CompanyInfo
}
