import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { publicApiUrl } from '../config/api'
import { AnimatedSection } from '../hooks/useScrollAnimation'
import { PageSkeleton } from '../components/LoadingSkeleton'
import {
  ArrowLeft, ArrowRight, Info, CheckCircle, Monitor,
  Zap, Maximize2, Weight, RefreshCw, Grid3X3, Tag
} from 'lucide-react'

const SPEC_CONFIG = [
  { key: 'pixel', i18nKey: 'products.pixelPitch', icon: Grid3X3, color: 'text-sky-400', bg: 'bg-sky-500/10' },
  { key: 'brightness', i18nKey: 'products.brightness', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { key: 'resolution', i18nKey: 'products.resolution', icon: Monitor, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { key: 'size', i18nKey: 'products.panelSize', icon: Maximize2, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  { key: 'weight', i18nKey: 'products.weight', icon: Weight, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  { key: 'refresh', i18nKey: 'products.refreshRate', icon: RefreshCw, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
]

const FALLBACK_PRODUCTS = [
  { id: 1, name: 'P2.5 Indoor Panel', category: 'indoor', pixel_pitch: '2.5mm', brightness: '1200 nits', resolution: '160x160 piksel', panel_size: '640x640mm', weight: '8.5 kg/panel', refresh_rate: '3840 Hz', best_for: 'Kurumsal etkinlikler, TV stüdyoları', image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&q=80', is_popular: 1, description: 'Yüksek çözünürlüklü iç mekan LED panel. Kurumsal sunumlar, TV stüdyoları ve yakın mesafe görüntüleme için ideal. 2.5mm piksel aralığı ile kristal netliğinde görüntü sunar.' },
  { id: 2, name: 'P3.9 Indoor Panel', category: 'indoor', pixel_pitch: '3.91mm', brightness: '1500 nits', resolution: '128x128 piksel', panel_size: '500x500mm', weight: '7.5 kg/panel', refresh_rate: '3840 Hz', best_for: 'Konferans, seminer, düğün', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80', is_popular: 0, description: 'Çok yönlü iç mekan LED panel. Konferanslar, seminerler ve düğün organizasyonları için mükemmel görüntü kalitesi.' },
  { id: 3, name: 'P3.9 Outdoor Panel', category: 'outdoor', pixel_pitch: '3.91mm', brightness: '5500 nits', resolution: '128x128 piksel', panel_size: '500x500mm', weight: '8.2 kg/panel', refresh_rate: '3840 Hz', best_for: 'Konser, festival, açık hava etkinlik', image: 'https://images.unsplash.com/photo-1504509546545-e000b4a62425?w=600&q=80', is_popular: 1, description: 'Yüksek parlaklıklı dış mekan LED panel. Konserler, festivaller ve büyük açık hava etkinlikleri için tasarlandı. IP65 koruma sınıfı.' },
  { id: 4, name: 'P4.8 Outdoor Panel', category: 'outdoor', pixel_pitch: '4.81mm', brightness: '5500 nits', resolution: '104x104 piksel', panel_size: '500x500mm', weight: '7.8 kg/panel', refresh_rate: '1920 Hz', best_for: 'Fuar, miting, spor etkinliği', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80', is_popular: 0, description: 'Dayanıklı dış mekan LED panel. Fuarlar, mitingler ve spor etkinlikleri için ideal. Hafif yapısı ile kolay kurulum.' },
  { id: 5, name: 'P6 Outdoor Panel', category: 'outdoor', pixel_pitch: '6mm', brightness: '6000 nits', resolution: '80x80 piksel', panel_size: '480x480mm', weight: '7 kg/panel', refresh_rate: '1920 Hz', best_for: 'Reklam ekranları, uzak mesafe', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&q=80', is_popular: 0, description: 'Orta-uzak mesafe dış mekan LED panel. Reklam ve tanıtım ekranları için ekonomik çözüm.' },
  { id: 6, name: 'P10 Outdoor Panel', category: 'outdoor', pixel_pitch: '10mm', brightness: '7000 nits', resolution: '32x32 piksel', panel_size: '320x320mm', weight: '6.5 kg/panel', refresh_rate: '1920 Hz', best_for: 'Billboard, stadyum, büyük alanlar', image: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600&q=80', is_popular: 0, description: 'Büyük alan dış mekan LED panel. Billboardlar, stadyumlar ve geniş açık alanlar için en ekonomik çözüm. 7000 nits parlaklık ile güneş altında bile net görüntü.' },
]

function normalize(p) {
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

export default function ProductDetail() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(publicApiUrl('/api/public.php?entity=products'))
      .then(r => r.json())
      .then(res => {
        const data = (res.success && Array.isArray(res.data) && res.data.length > 0)
          ? res.data
          : FALLBACK_PRODUCTS
        const normalized = data.map(normalize)
        setAllProducts(normalized)
        const found = normalized.find(p => String(p.id) === String(id))
        setProduct(found || null)
      })
      .catch(() => {
        const normalized = FALLBACK_PRODUCTS.map(normalize)
        setAllProducts(normalized)
        setProduct(normalized.find(p => String(p.id) === String(id)) || null)
      })
      .finally(() => setLoading(false))
  }, [id])

  const getCategoryLabel = (category) => {
    const c = (category || '').toLowerCase()
    if (c.includes('indoor') || c.includes('iç')) return t('products.indoor')
    return t('products.outdoor')
  }

  if (loading) return <PageSkeleton />

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold mb-4">{t('products.notFound')}</h2>
        <Link to="/urunler" className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t('products.backToProducts')}
        </Link>
      </div>
    )
  }

  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

  const usageAreas = product.bestFor ? product.bestFor.split(',').map(s => s.trim()).filter(Boolean) : []

  return (
    <div>
      {/* Breadcrumb */}
      <div className="pt-28 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-white transition-colors">{t('nav.home')}</Link>
            <span>/</span>
            <Link to="/urunler" className="hover:text-white transition-colors">{t('nav.products')}</Link>
            <span>/</span>
            <span className="text-gray-300">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Hero */}
      <AnimatedSection>
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Image */}
              <div className="relative group">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/3]">
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  {product.popular && (
                    <div className="absolute top-4 right-4 px-4 py-1.5 bg-primary text-white text-xs font-semibold rounded-full">
                      {t('products.popular')}
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4">
                    <span className="px-4 py-1.5 bg-white/10 backdrop-blur-sm text-sm font-medium rounded-full border border-white/10">
                      {getCategoryLabel(product.category)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    product.category === 'indoor'
                      ? 'bg-sky-500/10 text-sky-400'
                      : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {getCategoryLabel(product.category)}
                  </span>
                  {product.popular && (
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-semibold rounded-full">
                      {t('products.popular')}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">{product.name}</h1>

                {product.description && (
                  <p className="text-gray-400 leading-relaxed mb-8">{product.description}</p>
                )}

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {SPEC_CONFIG.map(spec => {
                    const value = product[spec.key]
                    if (!value) return null
                    const Icon = spec.icon
                    return (
                      <div key={spec.key} className="bg-dark-light/60 border border-white/5 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-7 h-7 rounded-lg ${spec.bg} flex items-center justify-center`}>
                            <Icon className={`w-3.5 h-3.5 ${spec.color}`} />
                          </div>
                          <span className="text-xs text-gray-500">{t(spec.i18nKey)}</span>
                        </div>
                        <p className="text-sm font-semibold text-white ml-9">{value}</p>
                      </div>
                    )
                  })}
                </div>

                {/* Usage Areas */}
                {usageAreas.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" />
                      {t('products.idealUsage')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {usageAreas.map((area, i) => (
                        <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 border border-primary/10 text-primary text-sm rounded-lg">
                          <CheckCircle className="w-3.5 h-3.5" />
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/iletisim"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/25"
                  >
                    {t('products.requestQuote')} <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/urunler"
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-medium rounded-xl transition-all duration-300 border border-white/5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t('products.backToProducts')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <AnimatedSection delay={200}>
          <section className="py-20 bg-dark-light/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold mb-10">{t('products.relatedProducts')}</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedProducts.map((rp, i) => (
                  <AnimatedSection key={rp.id} delay={i * 100}>
                    <Link to={`/urunler/${rp.id}`} className="group block bg-dark/50 border border-white/5 hover:border-primary/20 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1">
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={rp.image || 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&q=80'}
                          alt={rp.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent" />
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">{rp.name}</h3>
                        <p className="text-xs text-gray-500">{rp.pixel} · {rp.brightness}</p>
                      </div>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

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
