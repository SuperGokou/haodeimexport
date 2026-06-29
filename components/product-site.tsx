'use client'

import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Factory,
  Globe2,
  Mail,
  Menu,
  MessageCircle,
  PackageCheck,
  Search,
  Send,
  ShieldCheck,
  X
} from 'lucide-react'
import { useMemo, useState } from 'react'
import type { CompanyInfo, Locale, Product } from '@/lib/types'

type Copy = {
  nav: string[]
  heroKicker: string
  heroTitle: string
  heroCopy: string
  explore: string
  samples: string
  newArrivals: string
  newArrivalsCopy: string
  collectionKicker: string
  collectionTitle: string
  collectionCopy: string
  viewProduct: string
  useCases: string
  useCasesCopy: string
  patterns: string
  trust: string
  trustCopy: string
  contact: string
  chatTitle: string
  chatIntro: string
  chatPlaceholder: string
  send: string
  close: string
  search: string
  all: string
  specs: string
  applications: string
  colors: string
  admin: string
}

const copy: Record<Locale, Copy> = {
  en: {
    nav: ['Products', 'Collections', 'About', 'Contact'],
    heroKicker: 'Home textile export partner',
    heroTitle: 'Huzhou Haode',
    heroCopy:
      'Premium upholstery, curtain, jacquard, chenille, and linen-look fabrics prepared for sampling, inspection, and international delivery.',
    explore: 'Explore Collections',
    samples: 'Request Samples',
    newArrivals: 'New Arrivals',
    newArrivalsCopy:
      'A curated set of tactile fabrics for buyers, designers, wholesalers, and makers looking for stable colorways and dependable export service.',
    collectionKicker: 'Home textiles',
    collectionTitle: 'Our Collection',
    collectionCopy:
      'From upholstery fabrics to drapery and decorative surfaces, Haode supports product development with coordinated palettes, hand samples, and pre-shipment checks.',
    viewProduct: 'View Product',
    useCases: 'Quiet Luxury, Built For Daily Use',
    useCasesCopy:
      'Soft textures, clean colorways, and practical specifications for residential, hospitality, and contract interiors.',
    patterns: 'Patterns And Colors',
    trust: 'Export Service You Can Check',
    trustCopy:
      'Every inquiry can be matched with fabric options, sample timing, packing details, and QC checkpoints before shipment.',
    contact: 'Contact',
    chatTitle: 'Haode AI Customer Service',
    chatIntro: 'Ask about fabric use, sample matching, MOQ, colorways, or shipping details.',
    chatPlaceholder: 'Type your textile question...',
    send: 'Send',
    close: 'Close',
    search: 'Search fabrics',
    all: 'All',
    specs: 'Specifications',
    applications: 'Applications',
    colors: 'Colorways',
    admin: 'Admin'
  },
  zh: {
    nav: ['产品', '系列', '关于我们', '联系'],
    heroKicker: '家纺面料外贸伙伴',
    heroTitle: '湖州好德',
    heroCopy:
      '提供沙发布、窗帘布、提花、雪尼尔、仿麻及装饰面料，从打样、质检到出口交付，服务海外客户。',
    explore: '查看系列',
    samples: '申请样品',
    newArrivals: '新品推荐',
    newArrivalsCopy:
      '为采购商、设计师、批发商和软装制造商准备的精选触感面料，色系稳定，出口服务清晰。',
    collectionKicker: '家纺面料',
    collectionTitle: '产品系列',
    collectionCopy:
      '从沙发布、窗帘布到装饰面料，湖州好德协助客户完成产品开发、配色、手样和出货前检查。',
    viewProduct: '查看产品',
    useCases: '安静质感，适合日常使用',
    useCasesCopy: '柔和肌理、干净色系和实用规格，适用于住宅、酒店及工程软装空间。',
    patterns: '纹样与色彩',
    trust: '可核验的出口服务',
    trustCopy: '每个询盘都可匹配面料方案、样品周期、包装细节和出货前质检节点。',
    contact: '联系',
    chatTitle: '好德 AI 客服',
    chatIntro: '可咨询面料用途、样品匹配、起订量、色系或运输信息。',
    chatPlaceholder: '请输入您的面料问题...',
    send: '发送',
    close: '关闭',
    search: '搜索面料',
    all: '全部',
    specs: '规格',
    applications: '用途',
    colors: '色系',
    admin: '后台'
  }
}

export default function ProductSite({
  initialProducts,
  company
}: {
  initialProducts: Product[]
  company: CompanyInfo
}) {
  const [locale, setLocale] = useState<Locale>('en')
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const t = copy[locale]
  const companyText = company.translations[locale]

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(initialProducts.map((product) => product.category)))],
    [initialProducts]
  )

  const filteredProducts = useMemo(() => {
    const lower = query.toLowerCase()
    return initialProducts.filter((product) => {
      const text = product.translations[locale]
      const matchesCategory = category === 'all' || product.category === category
      const matchesQuery =
        !lower ||
        text.name.toLowerCase().includes(lower) ||
        text.tagline.toLowerCase().includes(lower) ||
        product.sku.toLowerCase().includes(lower)
      return matchesCategory && matchesQuery
    })
  }, [category, initialProducts, locale, query])

  const featuredProducts = filteredProducts.filter((product) => product.featured).slice(0, 4)
  const collectionProducts = filteredProducts.slice(0, 3)

  return (
    <main className="site-shell">
      <header className="site-header">
        <div className="utility-bar">
          <a href="#contact" className="utility-link">
            <Mail size={14} />
            {company.email}
          </a>
          <a href="/admin" className="utility-link">
            {t.admin}
          </a>
        </div>
        <div className="nav-bar">
          <button
            className="icon-button mobile-only"
            aria-label="Open navigation"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={20} />
          </button>
          <a href="#top" className="brand-mark" aria-label={companyText.name}>
            <span className="brand-cn">湖州好德</span>
            <span className="brand-en">Huzhou Haode</span>
          </a>
          <nav className={menuOpen ? 'nav-links nav-links-open' : 'nav-links'}>
            <button className="icon-button mobile-only close-menu" onClick={() => setMenuOpen(false)}>
              <X size={19} />
            </button>
            <a href="#products" onClick={() => setMenuOpen(false)}>
              {t.nav[0]}
            </a>
            <a href="#collections" onClick={() => setMenuOpen(false)}>
              {t.nav[1]}
            </a>
            <a href="#about" onClick={() => setMenuOpen(false)}>
              {t.nav[2]}
            </a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>
              {t.nav[3]}
            </a>
          </nav>
          <div className="nav-actions">
            <label className="search-shell">
              <Search size={15} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.search}
              />
            </label>
            <button
              className="language-toggle"
              onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
              aria-label="Switch language"
            >
              <Globe2 size={15} />
              {locale === 'en' ? '中文' : 'EN'}
            </button>
          </div>
        </div>
      </header>

      <section id="top" className="hero-section">
        <img className="hero-image" src="/images/hero-fabric-rolls.png" alt="" />
        <div className="hero-content">
          <p className="eyebrow">{t.heroKicker}</p>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroCopy}</p>
          <div className="hero-actions">
            <a href="#products" className="primary-button">
              {t.explore}
              <ArrowRight size={16} />
            </a>
            <a href="#contact" className="secondary-button">
              {t.samples}
              <PackageCheck size={16} />
            </a>
          </div>
          <div className="hero-proof">
            {company.facts.map((fact) => (
              <span key={fact.label}>
                <strong>{fact.value}</strong>
                {fact.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="section product-section">
        <div className="section-heading centered">
          <h2>{t.newArrivals}</h2>
          <p>{t.newArrivalsCopy}</p>
        </div>
        <div className="filter-row" aria-label="Product category filters">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? 'filter-chip active' : 'filter-chip'}
              onClick={() => setCategory(item)}
            >
              {item === 'all' ? t.all : item}
            </button>
          ))}
        </div>
        <div className="arrival-grid">
          {(featuredProducts.length ? featuredProducts : filteredProducts.slice(0, 4)).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              cta={t.viewProduct}
              onOpen={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      </section>

      <section id="collections" className="collection-band">
        <div className="collection-inner">
          <div className="section-heading light">
            <p className="eyebrow">{t.collectionKicker}</p>
            <h2>{t.collectionTitle}</h2>
            <p>{t.collectionCopy}</p>
          </div>
          <div className="collection-controls" aria-hidden="true">
            <button className="icon-button light-button">
              <ChevronLeft size={22} />
            </button>
            <button className="icon-button light-button">
              <ChevronRight size={22} />
            </button>
          </div>
          <div className="collection-grid">
            {collectionProducts.map((product) => (
              <button
                className="collection-item"
                key={product.id}
                onClick={() => setSelectedProduct(product)}
              >
                <img src={product.gallery[0] || product.image} alt={product.translations[locale].name} />
                <span>{product.collection}</span>
                <small>{product.translations[locale].name}</small>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="split-story">
        <div className="story-copy">
          <p className="eyebrow">{locale === 'zh' ? '应用空间' : 'Application'}</p>
          <h2>{t.useCases}</h2>
          <p>{t.useCasesCopy}</p>
          <a href="#contact" className="outline-button">
            {t.samples}
            <ArrowRight size={16} />
          </a>
        </div>
        <div className="story-image-wrap">
          <img src="/images/showroom-textiles.png" alt={locale === 'zh' ? '家纺面料应用空间' : 'Home textile application showroom'} />
        </div>
      </section>

      <section className="pattern-section">
        <div className="section-heading centered">
          <h2>{t.patterns}</h2>
        </div>
        <div className="pattern-strip">
          <img src="/images/pattern-grid.png" alt={locale === 'zh' ? '面料纹样与色彩' : 'Fabric patterns and colors'} />
          <button className="icon-button pattern-next" aria-label="Next pattern">
            <ChevronRight size={24} />
          </button>
        </div>
      </section>

      <section id="about" className="trust-section">
        <div className="trust-copy">
          <p className="eyebrow">{locale === 'zh' ? '服务能力' : 'Export capability'}</p>
          <h2>{t.trust}</h2>
          <p>{t.trustCopy}</p>
        </div>
        <div className="trust-grid">
          <TrustItem icon={<Factory size={22} />} title={company.capabilities[0]} />
          <TrustItem icon={<PackageCheck size={22} />} title={company.capabilities[1]} />
          <TrustItem icon={<ShieldCheck size={22} />} title={company.capabilities[2]} />
          <TrustItem icon={<Check size={22} />} title={company.capabilities[3]} />
        </div>
        <img className="trust-image" src="/images/quality-control.png" alt={locale === 'zh' ? '面料质检' : 'Fabric quality control'} />
      </section>

      <footer id="contact" className="site-footer">
        <div>
          <h2>{companyText.shortName}</h2>
          <p>{companyText.intro}</p>
          <a className="footer-cta" href={`mailto:${company.email}`}>
            {t.contact}
            <ArrowRight size={15} />
          </a>
        </div>
        <div>
          <h3>{t.nav[0]}</h3>
          {initialProducts.slice(0, 5).map((product) => (
            <button key={product.id} onClick={() => setSelectedProduct(product)}>
              {product.translations[locale].name}
            </button>
          ))}
        </div>
        <div>
          <h3>{t.contact}</h3>
          <p>{company.email}</p>
          <p>{company.phone}</p>
          <p>{company.whatsapp}</p>
          <p>{companyText.address}</p>
        </div>
        <div>
          <h3>{locale === 'zh' ? '服务市场' : 'Markets'}</h3>
          {company.markets.map((market) => (
            <p key={market}>{market}</p>
          ))}
        </div>
      </footer>

      <ChatWidget locale={locale} t={t} />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          locale={locale}
          t={t}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  )
}

function ProductCard({
  product,
  locale,
  cta,
  onOpen
}: {
  product: Product
  locale: Locale
  cta: string
  onOpen: () => void
}) {
  const text = product.translations[locale]
  return (
    <button className="product-card" onClick={onOpen}>
      <img src={product.image} alt={text.name} />
      <span className="product-overlay">
        <strong>{text.name}</strong>
        <small>{text.tagline}</small>
        <em>
          {cta}
          <ArrowRight size={14} />
        </em>
      </span>
    </button>
  )
}

function TrustItem({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="trust-item">
      {icon}
      <span>{title}</span>
    </div>
  )
}

function ProductModal({
  product,
  locale,
  t,
  onClose
}: {
  product: Product
  locale: Locale
  t: Copy
  onClose: () => void
}) {
  const text = product.translations[locale]
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <article className="product-modal" onClick={(event) => event.stopPropagation()}>
        <button className="icon-button modal-close" onClick={onClose} aria-label={t.close}>
          <X size={20} />
        </button>
        <div className="modal-gallery">
          <img src={product.gallery[0] || product.image} alt={text.name} />
        </div>
        <div className="modal-copy">
          <p className="eyebrow">{product.category} · {product.sku}</p>
          <h2>{text.name}</h2>
          <p>{text.description}</p>
          <h3>{t.specs}</h3>
          <dl className="spec-list">
            {text.specs.map((spec) => (
              <div key={`${spec.label}-${spec.value}`}>
                <dt>{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
          <h3>{t.applications}</h3>
          <div className="tag-row">
            {text.applications.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <h3>{t.colors}</h3>
          <div className="swatch-row">
            {product.colors.map((color) => (
              <span key={color} style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}

function ChatWidget({ locale, t }: { locale: Locale; t: Copy }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])

  async function submit() {
    const trimmed = message.trim()
    if (!trimmed || loading) return

    setMessages((current) => [...current, { role: 'user', content: trimmed }])
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale, message: trimmed })
      })
      const data = await response.json()
      setMessages((current) => [
        ...current,
        { role: 'assistant', content: data.answer || 'Please contact our team for details.' }
      ])
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content:
            locale === 'zh'
              ? '暂时无法连接 AI 客服，请通过邮箱联系我们。'
              : 'AI customer service is temporarily unavailable. Please contact us by email.'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button className="chat-launcher" onClick={() => setOpen(true)} aria-label={t.chatTitle}>
        <MessageCircle size={22} />
      </button>
      {open && (
        <aside className="chat-panel">
          <div className="chat-header">
            <div>
              <strong>{t.chatTitle}</strong>
              <span>{t.chatIntro}</span>
            </div>
            <button className="icon-button" onClick={() => setOpen(false)} aria-label={t.close}>
              <X size={18} />
            </button>
          </div>
          <div className="chat-messages">
            {messages.length === 0 && <p className="chat-empty">{t.chatIntro}</p>}
            {messages.map((item, index) => (
              <p key={`${item.role}-${index}`} className={item.role === 'user' ? 'chat-user' : 'chat-ai'}>
                {item.content}
              </p>
            ))}
            {loading && <p className="chat-ai">{locale === 'zh' ? '正在回复...' : 'Thinking...'}</p>}
          </div>
          <div className="chat-input">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') submit()
              }}
              placeholder={t.chatPlaceholder}
            />
            <button className="icon-button send-button" onClick={submit} aria-label={t.send}>
              <Send size={18} />
            </button>
          </div>
        </aside>
      )}
    </>
  )
}
