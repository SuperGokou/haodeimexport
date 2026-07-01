'use client'

import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Factory,
  Facebook,
  Globe2,
  Instagram,
  Linkedin,
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
  patternCopy: string
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
}

type CatalogMode = 'products' | 'collections'

type ProductCollection = {
  name: string
  products: Product[]
  categories: string[]
  image: string
}

function splitFactValue(value: string) {
  const trimmed = value.trim()
  const match = trimmed.match(/^([\d,.]+k?\+?)\s*(m2|sqm|sq m)?$/i)

  if (!match) return { value: trimmed, unit: '' }

  return {
    value: match[1],
    unit: match[2] ? 'm²' : ''
  }
}

const copy: Record<Locale, Copy> = {
  en: {
    nav: ['Products', 'Collections', 'About', 'Contact'],
    heroKicker: 'Home textile export partner',
    heroTitle: 'Huzhou Haode',
    heroCopy:
      'Main products: brushed microfiber, polyester dyed, polyester satin, Minimatt, taffeta, jacquard fabrics, and African wax-printed fabrics. We also offer diverse finishes – embossing, calendering, pearlescent, anti‑slip, seersucker, sheared jacquard, and plain nylon.',
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
    patternCopy:
      'Layered jacquards, linen-look surfaces, satin sheen, and tactile textures can be coordinated into color-ready directions for sampling.',
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
    colors: 'Colorways'
  },
  zh: {
    nav: ['产品', '系列', '关于我们', '联系'],
    heroKicker: '家纺面料外贸伙伴',
    heroTitle: '湖州好德',
    heroCopy:
      '提供梭织印花染色布、磨毛布、涤纶缎面布、塔夫绸、提花面料及非洲蜡染印花布，从打样、质检到出口交付，服务海外客户。',
    explore: '查看系列',
    samples: '申请样品',
    newArrivals: '新品推荐',
    newArrivalsCopy:
      '为采购商、设计师、批发商和软装制造商准备的精选触感面料，色系稳定，出口服务清晰。',
    collectionKicker: '家纺面料',
    collectionTitle: '产品系列',
    collectionCopy:
      '从家纺磨毛布到涤纶染色布，湖州好德协助客户完成产品开发、配色、手样和出货前检查。',
    viewProduct: '查看产品',
    useCases: '安静质感，适合日常使用',
    useCasesCopy: '柔和肌理、干净色系和实用规格，适用于住宅、酒店及工程软装空间。',
    patterns: '纹样与色彩',
    patternCopy: '提花、仿麻、缎面与肌理纹样可按色系组合，方便客户快速确认打样方向。',
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
    colors: '色系'
  }
}

export default function ProductSite({
  initialProducts,
  company
}: {
  initialProducts: Product[]
  company: CompanyInfo
}) {
  const [locale, setLocale] = useState<Locale>('zh')
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [catalogOpen, setCatalogOpen] = useState<CatalogMode | null>(null)
  const [catalogQuery, setCatalogQuery] = useState('')
  const [catalogFilter, setCatalogFilter] = useState('all')
  const t = copy[locale]
  const companyText = company.translations[locale]
  const companyCapabilities = company.capabilityLabels?.[locale] || company.capabilities
  const patternPalette = ['#efe8db', '#c3ac8f', '#7b8a70', '#5c5144', '#2e3430']
  const socialLinks = [
    { label: 'LinkedIn', icon: <Linkedin size={17} strokeWidth={1.9} /> },
    { label: 'Facebook', icon: <Facebook size={17} strokeWidth={1.9} /> },
    { label: 'Instagram', icon: <Instagram size={17} strokeWidth={1.9} /> },
    {
      label: 'TikTok',
      icon: <img className="footer-social-image" src="/images/social-tiktok.png" alt="" aria-hidden="true" />
    }
  ]

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(initialProducts.map((product) => product.category)))],
    [initialProducts]
  )

  const collections = useMemo<ProductCollection[]>(() => {
    const groups = new Map<string, Product[]>()
    initialProducts.forEach((product) => {
      const key = product.collection || product.category
      groups.set(key, [...(groups.get(key) || []), product])
    })

    return Array.from(groups.entries())
      .map(([name, products]) => ({
        name,
        products,
        categories: Array.from(new Set(products.map((product) => product.category))),
        image: products[0]?.gallery[0] || products[0]?.image || '/images/haode-swatch-books.jpg'
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [initialProducts])

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

  const catalogProducts = useMemo(() => {
    const lower = catalogQuery.trim().toLowerCase()
    return initialProducts.filter((product) => {
      const text = product.translations[locale]
      const matchesFilter = catalogFilter === 'all' || product.category === catalogFilter
      const haystack = [
        text.name,
        text.tagline,
        text.description,
        product.sku,
        product.category,
        product.collection
      ]
        .join(' ')
        .toLowerCase()
      return matchesFilter && (!lower || haystack.includes(lower))
    })
  }, [catalogFilter, catalogQuery, initialProducts, locale])

  const catalogCollections = useMemo(() => {
    const lower = catalogQuery.trim().toLowerCase()
    return collections.filter((collection) => {
      const matchesFilter = catalogFilter === 'all' || collection.name === catalogFilter
      const matchesQuery =
        !lower ||
        collection.name.toLowerCase().includes(lower) ||
        collection.categories.join(' ').toLowerCase().includes(lower) ||
        collection.products.some((product) => {
          const text = product.translations[locale]
          return `${text.name} ${text.tagline} ${product.sku}`.toLowerCase().includes(lower)
        })
      return matchesFilter && matchesQuery
    })
  }, [catalogFilter, catalogQuery, collections, locale])

  const featuredProducts = filteredProducts.filter((product) => product.featured).slice(0, 4)
  const collectionProducts = filteredProducts.slice(0, 3)
  const heroMaterials = useMemo(
    () => Array.from(new Set(initialProducts.map((product) => product.category))).slice(0, 4),
    [initialProducts]
  )

  function openCatalog(mode: CatalogMode) {
    setCatalogOpen(mode)
    setCatalogQuery('')
    setCatalogFilter('all')
    setMenuOpen(false)
  }

  function changeCatalogMode(mode: CatalogMode) {
    setCatalogOpen(mode)
    setCatalogQuery('')
    setCatalogFilter('all')
  }

  function openProduct(product: Product) {
    setCatalogOpen(null)
    setSelectedProduct(product)
  }

  return (
    <main className="site-shell">
      <header className="site-header">
        <div className="utility-bar">
          <a href="#contact" className="utility-link">
            <Mail size={14} />
            {company.email}
          </a>
          <span aria-hidden="true" />
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
            <img className="brand-symbol" src="/images/brand-symbol.png" alt="" aria-hidden="true" />
            <span className="brand-copy">
              <span className="brand-cn">{companyText.shortName}</span>
              <span className="brand-en">{locale === 'zh' ? 'HUZHOU HAODE' : 'Import & Export'}</span>
            </span>
          </a>
          <nav className={menuOpen ? 'nav-links nav-links-open' : 'nav-links'}>
            <button className="icon-button mobile-only close-menu" onClick={() => setMenuOpen(false)}>
              <X size={19} />
            </button>
            <button className="nav-link-button" onClick={() => openCatalog('products')}>
              {t.nav[0]}
            </button>
            <button className="nav-link-button" onClick={() => openCatalog('collections')}>
              {t.nav[1]}
            </button>
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
        <div className="hero-layout">
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
              {company.facts.map((fact) => {
                const displayValue = splitFactValue(fact.value)

                return (
                  <article className="hero-proof-item" key={fact.label}>
                    <span className="hero-proof-value">
                      <strong>{displayValue.value}</strong>
                      {displayValue.unit && <em>{displayValue.unit}</em>}
                    </span>
                    <span className="hero-proof-label">{fact.labels?.[locale] || fact.label}</span>
                  </article>
                )
              })}
            </div>
          </div>
          <figure className="hero-visual">
            <img className="hero-image" src="/images/haode-neutral-fabric-rolls.jpg" alt="" />
            <figcaption className="hero-caption">
              <span>{locale === 'zh' ? '面料方向' : 'Fabric direction'}</span>
              <strong>{heroMaterials.join(' / ')}</strong>
            </figcaption>
          </figure>
        </div>
        <div className="hero-material-bar" aria-label={locale === 'zh' ? '主要面料分类' : 'Primary fabric categories'}>
          {heroMaterials.map((material) => (
            <span key={material}>{material}</span>
          ))}
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
          <img src="/images/haode-showroom-curtains.jpg" alt={locale === 'zh' ? '家纺面料应用空间' : 'Home textile application showroom'} />
        </div>
      </section>

      <section className="pattern-section">
        <div className="pattern-showcase">
          <div className="pattern-copy">
            <p className="eyebrow">{locale === 'zh' ? '纹样开发' : 'Pattern library'}</p>
            <h2>{t.patterns}</h2>
            <p>{t.patternCopy}</p>
            <div className="pattern-palette" aria-label={locale === 'zh' ? '代表性色卡' : 'Representative color palette'}>
              {patternPalette.map((color) => (
                <span key={color} style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
          <div className="pattern-strip">
            <img src="/images/haode-texture-grid.jpg" alt={locale === 'zh' ? '面料纹样与色彩' : 'Fabric patterns and colors'} />
            <span className="pattern-caption">Jacquard / Linen / Satin / Boucle</span>
            <button className="icon-button pattern-next" aria-label="Next pattern">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      <section id="about" className="trust-section">
        <div className="trust-copy">
          <p className="eyebrow">{locale === 'zh' ? '服务能力' : 'Export capability'}</p>
          <h2>{t.trust}</h2>
          <p>{t.trustCopy}</p>
        </div>
        <div className="trust-grid">
          <TrustItem icon={<Factory size={22} />} title={companyCapabilities[0]} />
          <TrustItem icon={<PackageCheck size={22} />} title={companyCapabilities[1]} />
          <TrustItem icon={<ShieldCheck size={22} />} title={companyCapabilities[2]} />
          <TrustItem icon={<Check size={22} />} title={companyCapabilities[3]} />
        </div>
        <img className="trust-image" src="/images/haode-factory-production.jpg" alt={locale === 'zh' ? '面料生产线' : 'Fabric production line'} />
      </section>

      <footer id="contact" className="site-footer">
        <div>
          <h2>{companyText.shortName}</h2>
          <p>{companyText.intro}</p>
          <a className="footer-cta" href={`mailto:${company.email}`}>
            {t.contact}
            <ArrowRight size={15} />
          </a>
          <div className="footer-socials" aria-label={locale === 'zh' ? '社交媒体' : 'Social media'}>
            {socialLinks.map((social) => (
              <span
                className="footer-social-icon"
                key={social.label}
                role="img"
                aria-label={social.label}
                title={social.label}
              >
                {social.icon}
              </span>
            ))}
          </div>
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

      {catalogOpen && (
        <CatalogPanel
          mode={catalogOpen}
          locale={locale}
          t={t}
          allProducts={initialProducts}
          products={catalogProducts}
          categories={categories}
          allCollections={collections}
          collections={catalogCollections}
          query={catalogQuery}
          filter={catalogFilter}
          onQueryChange={setCatalogQuery}
          onFilterChange={setCatalogFilter}
          onModeChange={changeCatalogMode}
          onProductOpen={openProduct}
          onClose={() => setCatalogOpen(null)}
        />
      )}

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

function CatalogPanel({
  mode,
  locale,
  t,
  allProducts,
  products,
  categories,
  allCollections,
  collections,
  query,
  filter,
  onQueryChange,
  onFilterChange,
  onModeChange,
  onProductOpen,
  onClose
}: {
  mode: CatalogMode
  locale: Locale
  t: Copy
  allProducts: Product[]
  products: Product[]
  categories: string[]
  allCollections: ProductCollection[]
  collections: ProductCollection[]
  query: string
  filter: string
  onQueryChange: (value: string) => void
  onFilterChange: (value: string) => void
  onModeChange: (mode: CatalogMode) => void
  onProductOpen: (product: Product) => void
  onClose: () => void
}) {
  const isProducts = mode === 'products'
  const title =
    locale === 'zh'
      ? isProducts
        ? '全部产品'
        : '全部系列'
      : isProducts
        ? 'All Products'
        : 'All Collections'
  const intro =
    locale === 'zh'
      ? isProducts
        ? '按品类、关键词、SKU 快速查找面料，适合后期大量产品持续扩展。'
        : '按系列集中浏览面料组合，每个系列展示代表产品和可延展方向。'
      : isProducts
        ? 'Search by category, keyword, or SKU. Built for a growing product library.'
        : 'Browse textile collections with representative products and coordinated directions.'
  const searchPlaceholder =
    locale === 'zh'
      ? isProducts
        ? '搜索产品、品类、SKU'
        : '搜索系列、品类、产品'
      : isProducts
        ? 'Search product, category, SKU'
        : 'Search collection, category, product'
  const visibleCount = isProducts ? products.length : collections.length
  const totalCount = isProducts ? allProducts.length : allCollections.length
  const countLabel =
    locale === 'zh' ? `${visibleCount} / ${totalCount}` : `${visibleCount} of ${totalCount}`
  const filters = isProducts ? categories : ['all', ...allCollections.map((collection) => collection.name)]

  function filterCount(value: string) {
    if (value === 'all') return isProducts ? allProducts.length : allCollections.length
    if (isProducts) return allProducts.filter((product) => product.category === value).length
    return allCollections.find((collection) => collection.name === value)?.products.length || 0
  }

  return (
    <div className="catalog-backdrop" onClick={onClose}>
      <section
        className="catalog-panel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="catalog-header">
          <div>
            <p className="catalog-kicker">{locale === 'zh' ? '产品目录' : 'Textile Directory'}</p>
            <h2>{title}</h2>
            <p>{intro}</p>
          </div>
          <button className="icon-button catalog-close" onClick={onClose} aria-label={t.close}>
            <X size={20} />
          </button>
        </header>

        <div className="catalog-tabs" aria-label={locale === 'zh' ? '目录类型' : 'Directory type'}>
          <button className={isProducts ? 'active' : ''} onClick={() => onModeChange('products')}>
            {t.nav[0]}
          </button>
          <button className={!isProducts ? 'active' : ''} onClick={() => onModeChange('collections')}>
            {t.nav[1]}
          </button>
        </div>

        <div className="catalog-toolbar">
          <label className="catalog-search">
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder={searchPlaceholder}
            />
          </label>
          <span className="catalog-count">
            {countLabel}
            <small>{locale === 'zh' ? (isProducts ? ' 个产品' : ' 个系列') : isProducts ? ' products' : ' collections'}</small>
          </span>
        </div>

        <div className="catalog-body">
          <aside className="catalog-rail">
            {filters.map((item) => (
              <button
                key={item}
                className={filter === item ? 'catalog-filter active' : 'catalog-filter'}
                onClick={() => onFilterChange(item)}
              >
                <span>{item === 'all' ? t.all : item}</span>
                <small>{filterCount(item)}</small>
              </button>
            ))}
          </aside>

          <div className="catalog-results">
            {isProducts ? (
              products.length ? (
                <div className="catalog-product-grid">
                  {products.map((product) => (
                    <CatalogProductItem
                      key={product.id}
                      product={product}
                      locale={locale}
                      cta={t.viewProduct}
                      onOpen={() => onProductOpen(product)}
                    />
                  ))}
                </div>
              ) : (
                <CatalogEmpty locale={locale} />
              )
            ) : collections.length ? (
              <div className="catalog-collection-grid">
                {collections.map((collection) => (
                  <CatalogCollectionItem
                    key={collection.name}
                    collection={collection}
                    locale={locale}
                    cta={t.viewProduct}
                    onProductOpen={onProductOpen}
                  />
                ))}
              </div>
            ) : (
              <CatalogEmpty locale={locale} />
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function CatalogProductItem({
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
    <button className="catalog-product-card" onClick={onOpen}>
      <img src={product.image} alt={text.name} />
      <span className="catalog-card-copy">
        <small>{product.category} / {product.sku}</small>
        <strong>{text.name}</strong>
        <em>{product.collection}</em>
        <span>{text.tagline}</span>
        <span className="catalog-card-footer">
          <span className="mini-swatches">
            {product.colors.slice(0, 4).map((color) => (
              <i key={color} style={{ backgroundColor: color }} />
            ))}
          </span>
          <b>
            {cta}
            <ArrowRight size={14} />
          </b>
        </span>
      </span>
    </button>
  )
}

function CatalogCollectionItem({
  collection,
  locale,
  cta,
  onProductOpen
}: {
  collection: ProductCollection
  locale: Locale
  cta: string
  onProductOpen: (product: Product) => void
}) {
  const lead = collection.products[0]
  const leadText = lead.translations[locale]
  const countLabel =
    locale === 'zh' ? `${collection.products.length} 个产品` : `${collection.products.length} products`

  return (
    <article className="catalog-collection-card">
      <img src={collection.image} alt={collection.name} />
      <div className="catalog-collection-copy">
        <small>
          {countLabel} / {collection.categories.join(' / ')}
        </small>
        <h3>{collection.name}</h3>
        <p>{leadText.tagline}</p>
        <div className="catalog-mini-list">
          {collection.products.slice(0, 4).map((product) => (
            <button key={product.id} onClick={() => onProductOpen(product)}>
              <span>{product.translations[locale].name}</span>
              <ArrowRight size={13} />
            </button>
          ))}
        </div>
        <button className="catalog-collection-open" onClick={() => onProductOpen(lead)}>
          {cta}
          <ArrowRight size={14} />
        </button>
      </div>
    </article>
  )
}

function CatalogEmpty({ locale }: { locale: Locale }) {
  return (
    <div className="catalog-empty">
      <strong>{locale === 'zh' ? '没有匹配结果' : 'No matching results'}</strong>
      <p>{locale === 'zh' ? '换一个关键词或筛选条件试试。' : 'Try another keyword or filter.'}</p>
    </div>
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
