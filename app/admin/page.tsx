'use client'

import {
  Globe2,
  LogOut,
  Plus,
  Save,
  Sparkles,
  Trash2,
  UploadCloud
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { CompanyInfo, Product, ProductSpec, ProductTranslation } from '@/lib/types'

const emptyTranslation: ProductTranslation = {
  name: '',
  tagline: '',
  description: '',
  applications: [],
  specs: [],
  translationStatus: 'manual'
}

function createEmptyProduct(): Product {
  return {
    id: '',
    slug: '',
    sku: '',
    category: 'Chenille Upholstery',
    status: 'draft',
    featured: false,
    collection: 'New Collection',
    image: '/images/swatch-books.png',
    gallery: ['/images/swatch-books.png'],
    colors: ['#efe8db', '#a8845e', '#2d3c38'],
    updatedAt: new Date().toISOString(),
    translations: {
      en: { ...emptyTranslation },
      zh: { ...emptyTranslation }
    }
  }
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [draft, setDraft] = useState<Product>(createEmptyProduct())
  const [companyJson, setCompanyJson] = useState('')
  const [autoTranslate, setAutoTranslate] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')

  const selectedIsExisting = useMemo(
    () => Boolean(draft.id && products.some((product) => product.id === draft.id)),
    [draft.id, products]
  )

  useEffect(() => {
    checkSession()
  }, [])

  async function checkSession() {
    const response = await fetch('/api/admin/session')
    const data = await response.json()
    setAuthenticated(Boolean(data.authenticated))
    if (data.authenticated) {
      await Promise.all([loadProducts(), loadCompany()])
    }
  }

  async function login(event: React.FormEvent) {
    event.preventDefault()
    setNotice('')
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      setNotice(data.error || 'Login failed')
      return
    }

    setAuthenticated(true)
    await Promise.all([loadProducts(), loadCompany()])
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    setAuthenticated(false)
    setProducts([])
  }

  async function loadProducts() {
    const response = await fetch('/api/admin/products')
    if (!response.ok) return
    const data = await response.json()
    setProducts(data.products)
    if (data.products?.[0]) setDraft(data.products[0])
  }

  async function loadCompany() {
    const response = await fetch('/api/admin/company')
    if (!response.ok) return
    const data = await response.json()
    setCompanyJson(JSON.stringify(data.company, null, 2))
  }

  function patchDraft(patch: Partial<Product>) {
    setDraft((current) => ({ ...current, ...patch }))
  }

  function patchTranslation(locale: 'en' | 'zh', patch: Partial<ProductTranslation>) {
    setDraft((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [locale]: {
          ...current.translations[locale],
          ...patch
        }
      }
    }))
  }

  async function saveProduct(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    setNotice(autoTranslate ? 'Saving and translating with DeepSeek...' : 'Saving product...')

    const endpoint = selectedIsExisting ? `/api/admin/products/${draft.id}` : '/api/admin/products'
    const response = await fetch(endpoint, {
      method: selectedIsExisting ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: draft, autoTranslate })
    })

    const data = await response.json().catch(() => ({}))
    setSaving(false)

    if (!response.ok) {
      setNotice(data.error || 'Save failed')
      return
    }

    setNotice('Product saved. If GitHub persistence is configured, a data commit was created.')
    await loadProducts()
    setDraft(data.product)
  }

  async function deleteProduct() {
    if (!selectedIsExisting) return
    setSaving(true)
    const response = await fetch(`/api/admin/products/${draft.id}`, { method: 'DELETE' })
    setSaving(false)
    if (!response.ok) {
      setNotice('Delete failed')
      return
    }
    setNotice('Product deleted.')
    await loadProducts()
    setDraft(createEmptyProduct())
  }

  async function saveCompany() {
    setSaving(true)
    setNotice('Saving company information...')
    try {
      const company = JSON.parse(companyJson) as CompanyInfo
      const response = await fetch('/api/admin/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company })
      })
      setNotice(response.ok ? 'Company information saved.' : 'Company save failed')
    } catch {
      setNotice('Company JSON is invalid.')
    } finally {
      setSaving(false)
    }
  }

  if (authenticated === null) {
    return <main className="admin-shell">Loading...</main>
  }

  if (!authenticated) {
    return (
      <main className="admin-login">
        <form onSubmit={login} className="login-panel">
          <p className="eyebrow">Huzhou Haode CMS</p>
          <h1>Admin Login</h1>
          <p>Use the site admin password to update products, translations, and company AI context.</p>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Admin password"
          />
          <button className="primary-button" type="submit">
            Login
            <Globe2 size={16} />
          </button>
          {notice && <p className="admin-notice">{notice}</p>}
        </form>
      </main>
    )
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">湖州好德进出口有限公司</p>
          <h1>Product & AI Content Admin</h1>
        </div>
        <div className="admin-actions">
          <a className="secondary-button" href="/">
            View Site
          </a>
          <button className="secondary-button" onClick={logout}>
            Logout
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {notice && <p className="admin-notice wide">{notice}</p>}

      <section className="admin-grid">
        <aside className="admin-list">
          <button className="primary-button full" onClick={() => setDraft(createEmptyProduct())}>
            New Product
            <Plus size={16} />
          </button>
          {products.map((product) => (
            <button
              key={product.id}
              className={draft.id === product.id ? 'admin-list-item active' : 'admin-list-item'}
              onClick={() => setDraft(product)}
            >
              <img src={product.image} alt="" />
              <span>
                <strong>{product.translations.en.name || product.translations.zh.name}</strong>
                <small>{product.sku} · {product.status}</small>
              </span>
            </button>
          ))}
        </aside>

        <form className="admin-editor" onSubmit={saveProduct}>
          <div className="editor-toolbar">
            <div>
              <p className="eyebrow">{selectedIsExisting ? 'Editing product' : 'New product'}</p>
              <h2>{draft.translations.en.name || draft.translations.zh.name || 'Untitled fabric'}</h2>
            </div>
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={autoTranslate}
                onChange={(event) => setAutoTranslate(event.target.checked)}
              />
              <Sparkles size={16} />
              DeepSeek translate EN
            </label>
          </div>

          <div className="form-grid">
            <Field label="SKU">
              <input value={draft.sku} onChange={(event) => patchDraft({ sku: event.target.value })} />
            </Field>
            <Field label="Slug">
              <input value={draft.slug} onChange={(event) => patchDraft({ slug: event.target.value })} />
            </Field>
            <Field label="Category">
              <input value={draft.category} onChange={(event) => patchDraft({ category: event.target.value })} />
            </Field>
            <Field label="Collection">
              <input value={draft.collection} onChange={(event) => patchDraft({ collection: event.target.value })} />
            </Field>
            <Field label="Status">
              <select
                value={draft.status}
                onChange={(event) => patchDraft({ status: event.target.value as Product['status'] })}
              >
                <option value="published">published</option>
                <option value="draft">draft</option>
              </select>
            </Field>
            <label className="toggle-row in-grid">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(event) => patchDraft({ featured: event.target.checked })}
              />
              Featured on homepage
            </label>
          </div>

          <Field label="Main image URL">
            <input value={draft.image} onChange={(event) => patchDraft({ image: event.target.value })} />
          </Field>

          <Field label="Gallery image URLs, one per line">
            <textarea
              value={draft.gallery.join('\n')}
              onChange={(event) =>
                patchDraft({
                  gallery: event.target.value
                    .split('\n')
                    .map((item) => item.trim())
                    .filter(Boolean)
                })
              }
            />
          </Field>

          <Field label="Color hex values, comma separated">
            <input
              value={draft.colors.join(', ')}
              onChange={(event) =>
                patchDraft({
                  colors: event.target.value
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean)
                })
              }
            />
          </Field>

          <div className="translation-grid">
            <TranslationEditor
              title="Chinese Source"
              value={draft.translations.zh}
              onChange={(patch) => patchTranslation('zh', patch)}
            />
            <TranslationEditor
              title="English Translation"
              value={draft.translations.en}
              onChange={(patch) => patchTranslation('en', patch)}
            />
          </div>

          <div className="editor-footer">
            <button className="primary-button" type="submit" disabled={saving}>
              Save Product
              <Save size={16} />
            </button>
            {selectedIsExisting && (
              <button className="danger-button" type="button" onClick={deleteProduct} disabled={saving}>
                Delete
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="company-editor">
        <div>
          <p className="eyebrow">AI customer service context</p>
          <h2>Company Information</h2>
          <p>
            This JSON feeds the public footer and the DeepSeek customer service prompt. Keep it accurate.
          </p>
        </div>
        <textarea value={companyJson} onChange={(event) => setCompanyJson(event.target.value)} />
        <button className="secondary-button" onClick={saveCompany} disabled={saving}>
          Save Company Info
          <UploadCloud size={16} />
        </button>
      </section>
    </main>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  )
}

function TranslationEditor({
  title,
  value,
  onChange
}: {
  title: string
  value: ProductTranslation
  onChange: (patch: Partial<ProductTranslation>) => void
}) {
  return (
    <fieldset className="translation-editor">
      <legend>{title}</legend>
      <Field label="Name">
        <input value={value.name} onChange={(event) => onChange({ name: event.target.value })} />
      </Field>
      <Field label="Tagline">
        <input value={value.tagline} onChange={(event) => onChange({ tagline: event.target.value })} />
      </Field>
      <Field label="Description">
        <textarea
          value={value.description}
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </Field>
      <Field label="Applications, comma separated">
        <input
          value={value.applications.join(', ')}
          onChange={(event) =>
            onChange({
              applications: event.target.value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean)
            })
          }
        />
      </Field>
      <Field label="Specs, one per line as Label: Value">
        <textarea
          value={formatSpecs(value.specs)}
          onChange={(event) => onChange({ specs: parseSpecs(event.target.value) })}
        />
      </Field>
      <p className="translation-status">Translation status: {value.translationStatus || 'manual'}</p>
    </fieldset>
  )
}

function parseSpecs(value: string): ProductSpec[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split(':')
      return {
        label: label.trim(),
        value: rest.join(':').trim()
      }
    })
    .filter((item) => item.label && item.value)
}

function formatSpecs(specs: ProductSpec[]) {
  return specs.map((spec) => `${spec.label}: ${spec.value}`).join('\n')
}
