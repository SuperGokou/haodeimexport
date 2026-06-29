'use client'

import {
  Globe2,
  LogIn,
  LogOut,
  Plus,
  Save,
  Sparkles,
  Trash2,
  UploadCloud
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { CompanyInfo, Locale, Product, ProductSpec, ProductTranslation } from '@/lib/types'

type UploadTarget = 'main' | 'gallery'

const uploadAccept = 'image/jpeg,image/png,image/webp'
const maxUploadBytes = 4 * 1024 * 1024
const recommendedImageSize = { width: 1600, height: 1100 }
const consoleApiBase = '/api/hzhd-gate-2601'

type TranslationEditorCopy = {
  name: string
  tagline: string
  description: string
  applications: string
  specs: string
  translationStatus: string
  statusValues: Record<string, string>
}

type AdminCopy = {
  loading: string
  cms: string
  loginTitle: string
  loginIntro: string
  passwordPlaceholder: string
  login: string
  loginFailed: string
  companyName: string
  adminTitle: string
  viewSite: string
  logout: string
  newProduct: string
  editingProduct: string
  untitled: string
  autoTranslate: string
  sku: string
  slug: string
  category: string
  collection: string
  status: string
  statusPublished: string
  statusDraft: string
  featured: string
  mainImage: string
  gallery: string
  uploadMainImage: string
  uploadGalleryImage: string
  uploadHint: string
  uploadingImage: string
  uploadSuccess: string
  uploadFailed: string
  uploadTypeInvalid: string
  uploadTooLarge: string
  uploadSmallNotice: string
  colors: string
  chineseSource: string
  englishTranslation: string
  saveProduct: string
  delete: string
  aiContext: string
  companyInfo: string
  companyHelp: string
  saveCompany: string
  saveTranslateNotice: string
  saveProductNotice: string
  saveFailed: string
  savedProduct: string
  deleteFailed: string
  deleted: string
  savingCompany: string
  savedCompany: string
  companySaveFailed: string
  invalidCompanyJson: string
  translationEditor: TranslationEditorCopy
}

const adminCopy: Record<Locale, AdminCopy> = {
  zh: {
    loading: '加载中...',
    cms: '湖州好德后台',
    loginTitle: '后台登录',
    loginIntro: '使用后台密码更新产品、翻译和公司 AI 客服资料。',
    passwordPlaceholder: '后台密码',
    login: '登录',
    loginFailed: '登录失败',
    companyName: '湖州好德进出口有限公司',
    adminTitle: '产品后台',
    viewSite: '查看网站',
    logout: '退出登录',
    newProduct: '新增产品',
    editingProduct: '正在编辑产品',
    untitled: '未命名面料',
    autoTranslate: 'DeepSeek 自动翻译英文',
    sku: 'SKU',
    slug: 'Slug',
    category: '分类',
    collection: '系列',
    status: '状态',
    statusPublished: '已发布',
    statusDraft: '草稿',
    featured: '首页精选',
    mainImage: '主图 URL',
    gallery: '图库图片 URL，每行一个',
    uploadMainImage: '上传主图',
    uploadGalleryImage: '上传到图库',
    uploadHint: '尺寸提示：建议 1600 x 1100 px 或更大，JPG/PNG/WebP，单张不超过 4MB。',
    uploadingImage: '正在上传...',
    uploadSuccess: '图片已上传，记得保存产品。',
    uploadFailed: '图片上传失败',
    uploadTypeInvalid: '仅支持 JPG、PNG、WebP 图片。',
    uploadTooLarge: '图片太大，请控制在',
    uploadSmallNotice: '图片已上传，但尺寸偏小，建议 1600 x 1100 px 以上。',
    colors: '色卡 hex 值，用逗号分隔',
    chineseSource: '中文内容',
    englishTranslation: '英文翻译',
    saveProduct: '保存产品',
    delete: '删除',
    aiContext: 'AI 客服资料',
    companyInfo: '公司信息',
    companyHelp: '这段 JSON 会用于前台页脚和 DeepSeek 客服提示，请保持准确。',
    saveCompany: '保存公司信息',
    saveTranslateNotice: '正在保存并调用 DeepSeek 翻译...',
    saveProductNotice: '正在保存产品...',
    saveFailed: '保存失败',
    savedProduct: '产品已保存。若已配置 GitHub 持久化，会自动提交数据更新。',
    deleteFailed: '删除失败',
    deleted: '产品已删除。',
    savingCompany: '正在保存公司信息...',
    savedCompany: '公司信息已保存。',
    companySaveFailed: '公司信息保存失败',
    invalidCompanyJson: '公司 JSON 格式不正确。',
    translationEditor: {
      name: '名称',
      tagline: '短标语',
      description: '描述',
      applications: '应用场景，用逗号分隔',
      specs: '规格，每行格式：标签: 内容',
      translationStatus: '翻译状态',
      statusValues: {
        manual: '手动',
        ai: 'AI 翻译',
        stale: '待更新',
        failed: '翻译失败'
      }
    }
  },
  en: {
    loading: 'Loading...',
    cms: 'Huzhou Haode CMS',
    loginTitle: 'Admin Login',
    loginIntro: 'Use the site admin password to update products, translations, and company AI context.',
    passwordPlaceholder: 'Admin password',
    login: 'Login',
    loginFailed: 'Login failed',
    companyName: 'Huzhou Haode Import and Export Co.,Ltd.',
    adminTitle: 'Product Admin',
    viewSite: 'View Site',
    logout: 'Logout',
    newProduct: 'New Product',
    editingProduct: 'Editing product',
    untitled: 'Untitled fabric',
    autoTranslate: 'DeepSeek translate EN',
    sku: 'SKU',
    slug: 'Slug',
    category: 'Category',
    collection: 'Collection',
    status: 'Status',
    statusPublished: 'published',
    statusDraft: 'draft',
    featured: 'Featured on homepage',
    mainImage: 'Main image URL',
    gallery: 'Gallery image URLs, one per line',
    uploadMainImage: 'Upload Main',
    uploadGalleryImage: 'Upload Gallery',
    uploadHint: 'Size guide: 1600 x 1100 px or larger, JPG/PNG/WebP, max 4MB each.',
    uploadingImage: 'Uploading...',
    uploadSuccess: 'Image uploaded. Remember to save the product.',
    uploadFailed: 'Image upload failed',
    uploadTypeInvalid: 'Only JPG, PNG, and WebP images are supported.',
    uploadTooLarge: 'Image is too large. Please keep it under',
    uploadSmallNotice: 'Image uploaded, but it is small. Recommended size is 1600 x 1100 px or larger.',
    colors: 'Color hex values, comma separated',
    chineseSource: 'Chinese Source',
    englishTranslation: 'English Translation',
    saveProduct: 'Save Product',
    delete: 'Delete',
    aiContext: 'AI customer service context',
    companyInfo: 'Company Information',
    companyHelp: 'This JSON feeds the public footer and the DeepSeek customer service prompt. Keep it accurate.',
    saveCompany: 'Save Company Info',
    saveTranslateNotice: 'Saving and translating with DeepSeek...',
    saveProductNotice: 'Saving product...',
    saveFailed: 'Save failed',
    savedProduct: 'Product saved. If GitHub persistence is configured, a data commit was created.',
    deleteFailed: 'Delete failed',
    deleted: 'Product deleted.',
    savingCompany: 'Saving company information...',
    savedCompany: 'Company information saved.',
    companySaveFailed: 'Company save failed',
    invalidCompanyJson: 'Company JSON is invalid.',
    translationEditor: {
      name: 'Name',
      tagline: 'Tagline',
      description: 'Description',
      applications: 'Applications, comma separated',
      specs: 'Specs, one per line as Label: Value',
      translationStatus: 'Translation status',
      statusValues: {
        manual: 'manual',
        ai: 'AI translated',
        stale: 'stale',
        failed: 'failed'
      }
    }
  }
}

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
  const [locale, setLocale] = useState<Locale>('zh')
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [draft, setDraft] = useState<Product>(createEmptyProduct())
  const [companyJson, setCompanyJson] = useState('')
  const [autoTranslate, setAutoTranslate] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingTarget, setUploadingTarget] = useState<UploadTarget | null>(null)
  const [notice, setNotice] = useState('')
  const t = adminCopy[locale]

  const selectedIsExisting = useMemo(
    () => Boolean(draft.id && products.some((product) => product.id === draft.id)),
    [draft.id, products]
  )

  useEffect(() => {
    checkSession()
  }, [])

  async function checkSession() {
    const response = await fetch(`${consoleApiBase}/session`)
    const data = await response.json()
    setAuthenticated(Boolean(data.authenticated))
    if (data.authenticated) {
      await Promise.all([loadProducts(), loadCompany()])
    }
  }

  async function login(event: React.FormEvent) {
    event.preventDefault()
    setNotice('')
    const response = await fetch(`${consoleApiBase}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      setNotice(data.error || t.loginFailed)
      return
    }

    setAuthenticated(true)
    await Promise.all([loadProducts(), loadCompany()])
  }

  async function logout() {
    await fetch(`${consoleApiBase}/logout`, { method: 'POST' })
    setAuthenticated(false)
    setProducts([])
  }

  async function loadProducts() {
    const response = await fetch(`${consoleApiBase}/products`)
    if (!response.ok) return
    const data = await response.json()
    setProducts(data.products)
    if (data.products?.[0]) setDraft(data.products[0])
  }

  async function loadCompany() {
    const response = await fetch(`${consoleApiBase}/company`)
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

  async function uploadImage(event: React.ChangeEvent<HTMLInputElement>, target: UploadTarget) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file || uploadingTarget) return

    if (!uploadAccept.split(',').includes(file.type)) {
      setNotice(t.uploadTypeInvalid)
      return
    }

    if (file.size > maxUploadBytes) {
      setNotice(`${t.uploadTooLarge} ${formatFileSize(maxUploadBytes)}.`)
      return
    }

    const dimensions = await readImageDimensions(file).catch(() => null)
    const isSmall =
      dimensions &&
      (dimensions.width < recommendedImageSize.width || dimensions.height < recommendedImageSize.height)

    setUploadingTarget(target)
    setNotice(t.uploadingImage)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch(`${consoleApiBase}/uploads`, {
        method: 'POST',
        body: formData
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.url) {
        setNotice(data.error || t.uploadFailed)
        return
      }

      setDraft((current) => {
        if (target === 'main') {
          return {
            ...current,
            image: data.url,
            gallery: current.gallery.includes(data.url) ? current.gallery : [data.url, ...current.gallery]
          }
        }

        return {
          ...current,
          gallery: current.gallery.includes(data.url) ? current.gallery : [...current.gallery, data.url]
        }
      })
      setNotice(isSmall ? t.uploadSmallNotice : t.uploadSuccess)
    } catch {
      setNotice(t.uploadFailed)
    } finally {
      setUploadingTarget(null)
    }
  }

  async function saveProduct(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    setNotice(autoTranslate ? t.saveTranslateNotice : t.saveProductNotice)

    const endpoint = selectedIsExisting ? `${consoleApiBase}/products/${draft.id}` : `${consoleApiBase}/products`
    const response = await fetch(endpoint, {
      method: selectedIsExisting ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: draft, autoTranslate })
    })

    const data = await response.json().catch(() => ({}))
    setSaving(false)

    if (!response.ok) {
      setNotice(data.error || t.saveFailed)
      return
    }

    setNotice(t.savedProduct)
    await loadProducts()
    setDraft(data.product)
  }

  async function deleteProduct() {
    if (!selectedIsExisting) return
    setSaving(true)
    const response = await fetch(`${consoleApiBase}/products/${draft.id}`, { method: 'DELETE' })
    setSaving(false)
    if (!response.ok) {
      setNotice(t.deleteFailed)
      return
    }
    setNotice(t.deleted)
    await loadProducts()
    setDraft(createEmptyProduct())
  }

  async function saveCompany() {
    setSaving(true)
    setNotice(t.savingCompany)
    try {
      const company = JSON.parse(companyJson) as CompanyInfo
      const response = await fetch(`${consoleApiBase}/company`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company })
      })
      setNotice(response.ok ? t.savedCompany : t.companySaveFailed)
    } catch {
      setNotice(t.invalidCompanyJson)
    } finally {
      setSaving(false)
    }
  }

  if (authenticated === null) {
    return <main className="admin-shell">{t.loading}</main>
  }

  if (!authenticated) {
    return (
      <main className="admin-login">
        <section className="login-card">
          <aside className="login-visual" aria-hidden="true">
            <img src="/images/hero-fabric-rolls.png" alt="" />
            <div className="login-visual-caption">
              <span>HAODE CMS</span>
              <strong>{locale === 'zh' ? '面料后台' : 'Textile Admin'}</strong>
            </div>
          </aside>

          <form onSubmit={login} className="login-panel">
            <div className="login-topbar">
              <div className="login-brand">
                <img src="/images/brand-symbol.png" alt="" aria-hidden="true" />
                <span>
                  <strong>{locale === 'zh' ? '湖州好德' : 'Huzhou Haode'}</strong>
                  <small>{locale === 'zh' ? 'Huzhou Haode' : 'Admin Console'}</small>
                </span>
              </div>
            <button
              className="secondary-button"
              type="button"
              onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
            >
              <Globe2 size={16} />
              {locale === 'zh' ? 'EN' : '中文'}
            </button>
            </div>
            <div className="login-heading">
              <p className="eyebrow">{t.cms}</p>
              <h1>{t.loginTitle}</h1>
              <p>{locale === 'zh' ? '产品、翻译、AI 客服。' : 'Products, translations, AI service.'}</p>
            </div>
            <label className="login-field">
              <span>{t.passwordPlaceholder}</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t.passwordPlaceholder}
              />
            </label>
            <button className="primary-button login-submit" type="submit">
              {t.login}
              <LogIn size={17} />
            </button>
            {notice && <p className="admin-notice">{notice}</p>}
          </form>
        </section>
      </main>
    )
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div className="admin-title-lockup">
          <span className="admin-brand-row">
            <img src="/images/brand-symbol.png" alt="" aria-hidden="true" />
            <span>
              <strong>{locale === 'zh' ? '湖州好德' : 'Huzhou Haode'}</strong>
              <small>{t.companyName}</small>
            </span>
          </span>
          <h1>{t.adminTitle}</h1>
        </div>
        <div className="admin-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
          >
            <Globe2 size={16} />
            {locale === 'zh' ? 'EN' : '中文'}
          </button>
          <a className="secondary-button" href="/">
            {t.viewSite}
          </a>
          <button className="secondary-button" onClick={logout}>
            {t.logout}
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {notice && <p className="admin-notice wide">{notice}</p>}

      <section className="admin-grid">
        <aside className="admin-list">
          <button className="primary-button full" onClick={() => setDraft(createEmptyProduct())}>
            {t.newProduct}
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
                <strong>{product.translations[locale].name || product.translations.zh.name || product.translations.en.name}</strong>
                <small>
                  {product.sku} · {product.status === 'published' ? t.statusPublished : t.statusDraft}
                </small>
              </span>
            </button>
          ))}
        </aside>

        <form className="admin-editor" onSubmit={saveProduct}>
          <div className="editor-toolbar">
            <div>
              <p className="eyebrow">{selectedIsExisting ? t.editingProduct : t.newProduct}</p>
              <h2>{draft.translations[locale].name || draft.translations.zh.name || draft.translations.en.name || t.untitled}</h2>
            </div>
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={autoTranslate}
                onChange={(event) => setAutoTranslate(event.target.checked)}
              />
              <Sparkles size={16} />
              {t.autoTranslate}
            </label>
          </div>

          <div className="form-grid">
            <Field label={t.sku}>
              <input value={draft.sku} onChange={(event) => patchDraft({ sku: event.target.value })} />
            </Field>
            <Field label={t.slug}>
              <input value={draft.slug} onChange={(event) => patchDraft({ slug: event.target.value })} />
            </Field>
            <Field label={t.category}>
              <input value={draft.category} onChange={(event) => patchDraft({ category: event.target.value })} />
            </Field>
            <Field label={t.collection}>
              <input value={draft.collection} onChange={(event) => patchDraft({ collection: event.target.value })} />
            </Field>
            <Field label={t.status}>
              <select
                value={draft.status}
                onChange={(event) => patchDraft({ status: event.target.value as Product['status'] })}
              >
                <option value="published">{t.statusPublished}</option>
                <option value="draft">{t.statusDraft}</option>
              </select>
            </Field>
            <label className="toggle-row in-grid">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(event) => patchDraft({ featured: event.target.checked })}
              />
              {t.featured}
            </label>
          </div>

          <Field label={t.mainImage}>
            <div className="image-url-row">
              <input value={draft.image} onChange={(event) => patchDraft({ image: event.target.value })} />
              <UploadButton
                label={t.uploadMainImage}
                busyLabel={t.uploadingImage}
                busy={uploadingTarget === 'main'}
                disabled={Boolean(uploadingTarget)}
                onChange={(event) => uploadImage(event, 'main')}
              />
            </div>
            <span className="field-hint">{t.uploadHint}</span>
          </Field>

          <Field label={t.gallery}>
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
            <div className="field-action-row">
              <UploadButton
                label={t.uploadGalleryImage}
                busyLabel={t.uploadingImage}
                busy={uploadingTarget === 'gallery'}
                disabled={Boolean(uploadingTarget)}
                onChange={(event) => uploadImage(event, 'gallery')}
              />
            </div>
            <span className="field-hint">{t.uploadHint}</span>
          </Field>

          <Field label={t.colors}>
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
              title={t.chineseSource}
              labels={t.translationEditor}
              value={draft.translations.zh}
              onChange={(patch) => patchTranslation('zh', patch)}
            />
            <TranslationEditor
              title={t.englishTranslation}
              labels={t.translationEditor}
              value={draft.translations.en}
              onChange={(patch) => patchTranslation('en', patch)}
            />
          </div>

          <div className="editor-footer">
            <button className="primary-button" type="submit" disabled={saving}>
              {t.saveProduct}
              <Save size={16} />
            </button>
            {selectedIsExisting && (
              <button className="danger-button" type="button" onClick={deleteProduct} disabled={saving}>
                {t.delete}
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="company-editor">
        <div>
          <p className="eyebrow">{t.aiContext}</p>
          <h2>{t.companyInfo}</h2>
          <p>{t.companyHelp}</p>
        </div>
        <textarea value={companyJson} onChange={(event) => setCompanyJson(event.target.value)} />
        <button className="secondary-button" onClick={saveCompany} disabled={saving}>
          {t.saveCompany}
          <UploadCloud size={16} />
        </button>
      </section>
    </main>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <span>{label}</span>
      {children}
    </div>
  )
}

function UploadButton({
  label,
  busyLabel,
  busy,
  disabled,
  onChange
}: {
  label: string
  busyLabel: string
  busy: boolean
  disabled: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <label className={disabled ? 'upload-button disabled' : 'upload-button'}>
      <UploadCloud size={15} />
      {busy ? busyLabel : label}
      <input type="file" accept={uploadAccept} disabled={disabled} onChange={onChange} />
    </label>
  )
}

function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    const objectUrl = URL.createObjectURL(file)

    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve({ width: image.naturalWidth, height: image.naturalHeight })
    }
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Unable to read image dimensions'))
    }
    image.src = objectUrl
  })
}

function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${Math.round((bytes / 1024 / 1024) * 10) / 10}MB`
  return `${Math.round(bytes / 1024)}KB`
}

function TranslationEditor({
  title,
  labels,
  value,
  onChange
}: {
  title: string
  labels: TranslationEditorCopy
  value: ProductTranslation
  onChange: (patch: Partial<ProductTranslation>) => void
}) {
  const status = value.translationStatus || 'manual'

  return (
    <fieldset className="translation-editor">
      <legend>{title}</legend>
      <Field label={labels.name}>
        <input value={value.name} onChange={(event) => onChange({ name: event.target.value })} />
      </Field>
      <Field label={labels.tagline}>
        <input value={value.tagline} onChange={(event) => onChange({ tagline: event.target.value })} />
      </Field>
      <Field label={labels.description}>
        <textarea
          value={value.description}
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </Field>
      <Field label={labels.applications}>
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
      <Field label={labels.specs}>
        <textarea
          value={formatSpecs(value.specs)}
          onChange={(event) => onChange({ specs: parseSpecs(event.target.value) })}
        />
      </Field>
      <p className="translation-status">
        {labels.translationStatus}: {labels.statusValues[status] || status}
      </p>
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
