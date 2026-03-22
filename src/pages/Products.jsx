import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { publicApiUrl } from '../config/api'
import { AnimatedSection } from '../hooks/useScrollAnimation'
import { PageSkeleton } from '../components/LoadingSkeleton'
import { ArrowRight, Info, Search, SlidersHorizontal, Grid3X3, List, ChevronDown } from 'lucide-react'

const SPEC_KEYS = [
  { key: 'pixel', i18nKey: 'products.pixelPitch' },
  { key: 'brightness', i18nKey: 'products.brightness' },
  { key: 'resolution', i18nKey: 'products.resolution' },
  { key: 'size', i18nKey: 'products.panelSize' },
  { key: 'weight', i18nKey: 'products.weight' },
  { key: 'refresh', i18nKey: 'products.refreshRate' },
]

const FALLBACK_PRODUCTS = [
  { id: 1, name: 'P2.5 Indoor Panel', category: 'indoor', pixel: '2.5mm', brightness: '1200 nits', resolution: '160x160 piksel', size: '640x640mm', weight: '8.5 kg/panel', refresh: '3840 Hz', bestFor: 'Kurumsal etkinlikler, TV stüdyoları', image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&q=80', popular: true, description: 'Yüksek çözünürlüklü iç mekan LED panel. Kurumsal sunumlar, TV stüdyoları ve yakın mesafe görüntüleme için ideal.' },
  { id: 2, name: 'P3.9 Indoor Panel', category: 'indoor', pixel: '3.91mm', brightness: '1500 nits', resolution: '128x128 piksel', size: '500x500mm', weight: '7.5 kg/panel', refresh: '3840 Hz', bestFor: 'Konferans, seminer, düğün', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80', popular: false, description: 'Çok yönlü iç mekan LED panel. Konferanslar, seminerler ve düğün organizasyonları için mükemmel.' },
  { id: 3, name: 'P3.9 Outdoor Panel', category: 'outdoor', pixel: '3.91mm', brightness: '5500 nits', resolution: '128x128 piksel', size: '500x500mm', weight: '8.2 kg/panel', refresh: '3840 Hz', bestFor: 'Konser, festival, açık hava etkinlik', image: 'https://images.unsplash.com/photo-1504509546545-e000b4a62425?w=600&q=80', popular: true, description: 'Yüksek parlaklıklı dış mekan LED panel. Konserler, festivaller ve büyük açık hava etkinlikleri için tasarlandı.' },
  { id: 4, name: 'P4.8 Outdoor Panel', category: 'outdoor', pixel: '4.81mm', brightness: '5500 nits', resolution: '104x104 piksel', size: '500x500mm', weight: '7.8 kg/panel', refresh: '1920 Hz', bestFor: 'Fuar, miting, spor etkinliği', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80', popular: false, description: 'Dayanıklı dış mekan LED panel. Fuarlar, mitingler ve spor etkinlikleri için ideal çözüm.' },
  { id: 5, name: 'P6 Outdoor Panel', category: 'outdoor', pixel: '6mm', brightness: '6000 nits', resolution: '80x80 piksel', size: '480x480mm', weight: '7 kg/panel', refresh: '1920 Hz', bestFor: 'Reklam ekranları, uzak mesafe', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&q=80', popular: false, description: 'Orta mesafe dış mekan LED panel. Reklam ekranları ve uzak mesafeden izleme gerektiren alanlar için.' },
  { id: 6, name: 'P10 Outdoor Panel', category: 'outdoor', pixel: '10mm', brightness: '7000 nits', resolution: '32x32 piksel', size: '320x320mm', weight: '6.5 kg/panel', refresh: '1920 Hz', bestFor: 'Billboard, stadyum, büyük alanlar', image: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600&q=80', popular: false, description: 'Büyük alan dış mekan LED panel. Billboardlar, stadyumlar ve geniş açık alanlar için en ekonomik çözüm.' },
]

const COMPARISON_ROWS = [
  { labelKey: 'products.pixelPitch', indoorKey: 'products.compareIndoorPixel', outdoorKey: 'products.compareOutdoorPixel' },
  { labelKey: 'products.brightness', indoorKey: 'products.compareIndoorBrightness', outdoorKey: 'products.compareOutdoorBrightness' },
  { labelKey: 'products.waterproof', indoorKey: 'products.compareIndoorWaterproof', outdoorKey: 'products.compareOutdoorWaterproof' },
  { labelKey: 'products.viewDistance', indoorKey: 'products.compareIndoorViewDistance', outdoorKey: 'products.compareOutdoorViewDistance' },
  { labelKey: 'products.usageArea', indoorKey: 'products.compareIndoorUsage', outdoorKey: 'products.compareOutdoorUsage' },
  { labelKey: 'products.energyConsumption', indoorKey: 'products.compareIndoorEnergy', outdoorKey: 'products.compareOutdoorEnergy' },
]

function normalizeProduct(p) {
  return {
    id: p.id,
    name: p.name || p.title,
    category: (p.category || '').toLowerCase(),
    pixel: p.pixel || p.pixel_pitch || p.pixelPitch,
    brightness: p.brightness,
    resolution: p.resolution,
    size: p.size || p.panel_size || p.panelSize,
    weight: p.weight,
    refresh: p.refresh || p.refresh_rate || p.refreshRate,
    bestFor: p.bestFor || p.best_for,
    image: p.image || p.image_url,
    popular: Boolean(p.popular || p.is_popular),
    description: p.description || '',
  }
}

function parsePixel(val) {
  if (!val) return 999
  const match = String(val).match(/[\d.]+/)
  return match ? parseFloat(match[0]) : 999
}

export default function Products() {
  const { t } = useTranslation()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetch(publicApiUrl('/api/public.php?entity=products'))
      .then(r => r.json())
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setProducts(res.data.map(normalizeProduct))
        } else {
          setProducts(FALLBACK_PRODUCTS.map(normalizeProduct))
        }
      })
      .catch(() => setProducts(FALLBACK_PRODUCTS.map(normalizeProduct)))
      .finally(() => setLoading(false))
  }, [])

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))]
    return ['all', ...cats]
  }, [products])

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.bestFor || '').toLowerCase().includes(q) ||
        (p.pixel || '').toLowerCase().includes(q)
      )
    }

    switch (sortBy) {
      case 'name-az': result.sort((a, b) => a.name.localeCompare(b.name)); break
      case 'name-za': result.sort((a, b) => b.name.localeCompare(a.name)); break
      case 'pixel-asc': result.sort((a, b) => parsePixel(a.pixel) - parsePixel(b.pixel)); break
      case 'pixel-desc': result.sort((a, b) => parsePixel(b.pixel) - parsePixel(a.pixel)); break
      default: break
    }

    return result
  }, [products, activeCategory, sortBy, searchQuery])

  const getCategoryLabel = (category) => {
    if (category === 'all') return t('products.all')
    const c = (category || '').toLowerCase()
    if (c.includes('indoor') || c.includes('iç')) return t('products.indoor')
    return t('products.outdoor')
  }

  if (loading) return <PageSkeleton />

  return (
    <div>
      {/* Hero */}
      <AnimatedSection>
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">{t('products.pageTag')}</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold mt-3 mb-6">
                {t('products.pageTitle')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  {t('products.pageTitleHighlight')}
                </span>
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed">{t('products.pageDesc')}</p>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Filters & Search */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection delay={100}>
            <div className="bg-dark-light/50 border border-white/5 rounded-2xl p-5">
              {/* Category tabs */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      activeCategory === cat
                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {getCategoryLabel(cat)}
                    {cat !== 'all' && (
                      <span className="ml-2 text-xs opacity-70">
                        ({products.filter(p => p.category === cat).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Search + Sort row */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={t('products.pixelPitch') + ', ' + t('products.idealUsage') + '...'}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                  >
                    <option value="default">{t('products.sortDefault')}</option>
                    <option value="name-az">{t('products.sortNameAZ')}</option>
                    <option value="name-za">{t('products.sortNameZA')}</option>
                    <option value="pixel-asc">{t('products.sortPixelAsc')}</option>
                    <option value="pixel-desc">{t('products.sortPixelDesc')}</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Results count */}
              <p className="mt-3 text-xs text-gray-500">
                {filteredProducts.length} {t('products.productsFound')}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">{t('products.notFound')}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, i) => (
                <AnimatedSection key={product.id || i} delay={i * 80}>
                  <div className={`group relative bg-dark-light/50 border rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 ${
                    product.popular ? 'border-primary/30' : 'border-white/5 hover:border-primary/20'
                  }`}>
                    {product.popular && (
                      <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                        {t('products.popular')}
                      </div>
                    )}

                    <Link to={`/urunler/${product.id}`} className="block">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={product.image || 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&q=80'}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-light to-transparent" />
                        <span className="absolute bottom-4 left-4 px-3 py-1 bg-white/10 backdrop-blur-sm text-xs font-medium rounded-full border border-white/10">
                          {getCategoryLabel(product.category)}
                        </span>
                      </div>
                    </Link>

                    <div className="p-6">
                      <Link to={`/urunler/${product.id}`}>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                      </Link>
                      {product.bestFor && (
                        <div className="flex items-start gap-2 mb-4">
                          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-400">{product.bestFor}</p>
                        </div>
                      )}

                      <div className="space-y-2 mb-6">
                        {SPEC_KEYS.slice(0, 4).map((spec, j) => {
                          const value = product[spec.key]
                          if (value == null) return null
                          return (
                            <div key={j} className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">{t(spec.i18nKey)}</span>
                              <span className="text-gray-200 font-medium">{value}</span>
                            </div>
                          )
                        })}
                      </div>

                      <div className="flex gap-2">
                        <Link
                          to={`/urunler/${product.id}`}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-medium rounded-xl transition-all duration-300 text-sm border border-white/5"
                        >
                          {t('products.viewDetails')}
                        </Link>
                        <Link
                          to="/iletisim"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary/10 hover:bg-primary text-primary hover:text-white font-medium rounded-xl transition-all duration-300 text-sm"
                        >
                          {t('products.requestQuote')} <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Comparison */}
      <AnimatedSection delay={200}>
        <section className="py-24 bg-dark-light/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">{t('products.compareTag')}</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">{t('products.compareTitle')}</h2>
              <p className="text-gray-400">{t('products.compareDesc')}</p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-dark-light">
                    <th className="px-6 py-4 text-left text-gray-400 font-medium">{t('products.compareFeature')}</th>
                    <th className="px-6 py-4 text-center text-gray-400 font-medium">{t('products.compareIndoor')}</th>
                    <th className="px-6 py-4 text-center text-gray-400 font-medium">{t('products.compareOutdoor')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {COMPARISON_ROWS.map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-gray-300 font-medium">{t(row.labelKey)}</td>
                      <td className="px-6 py-4 text-center text-gray-400">{t(row.indoorKey)}</td>
                      <td className="px-6 py-4 text-center text-gray-400">{t(row.outdoorKey)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection delay={100}>
        <section className="py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('products.ctaTitle')}</h2>
            <p className="text-gray-400 mb-8">{t('products.ctaDesc')}</p>
            <Link
              to="/iletisim"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/25"
            >
              {t('products.ctaButton')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </AnimatedSection>
    </div>
  )
}
