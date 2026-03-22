import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { publicApiUrl } from '../config/api'
import { AnimatedSection } from '../hooks/useScrollAnimation'
import { X, ZoomIn, Filter } from 'lucide-react'

const fallbackItems = [
  { src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', title: 'Rock Festivali LED Ekran', category: 'Konser', size: 'tall' },
  { src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', title: 'Kurumsal Lansman', category: 'Kurumsal', size: 'normal' },
  { src: 'https://images.unsplash.com/photo-1591115765373-5f9cf1da241c?w=800&q=80', title: 'Teknoloji Fuarı', category: 'Fuar', size: 'normal' },
  { src: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80', title: 'Düğün Dekorasyonu', category: 'Düğün', size: 'wide' },
  { src: 'https://images.unsplash.com/photo-1504509546545-e000b4a62425?w=800&q=80', title: 'Açık Hava Konseri', category: 'Konser', size: 'normal' },
  { src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80', title: 'Kurumsal Toplantı', category: 'Kurumsal', size: 'tall' },
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80', title: 'Billboard Reklam', category: 'Outdoor', size: 'normal' },
  { src: 'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=800&q=80', title: 'Sahne Tasarımı', category: 'Konser', size: 'wide' },
  { src: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80', title: 'Sinema Premieri', category: 'Kurumsal', size: 'normal' },
  { src: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80', title: 'Konferans Salonu', category: 'Kurumsal', size: 'normal' },
  { src: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&q=80', title: 'Stadyum Ekranı', category: 'Outdoor', size: 'tall' },
  { src: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80', title: 'Neon LED Kurulum', category: 'Fuar', size: 'normal' },
]

export default function Gallery() {
  const { t } = useTranslation()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    fetch(publicApiUrl('/api/public.php?entity=gallery'))
      .then(r => r.json())
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setData(res.data)
        } else {
          setData(fallbackItems)
        }
      })
      .catch(() => setData(fallbackItems))
      .finally(() => setLoading(false))
  }, [])

  const categories = ['all', ...Array.from(new Set(data.map(item => item.category).filter(Boolean)))]
  const allLabel = t('gallery.all')

  const filtered = activeCategory === 'all'
    ? data
    : data.filter(item => item.category === activeCategory)

  const displayCategories = categories.map((cat, i) => ({
    key: cat,
    label: cat === 'all' ? allLabel : cat,
  }))

  return (
    <div>
      {/* Hero */}
      <AnimatedSection>
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">{t('gallery.pageTag')}</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold mt-3 mb-6">
                {t('gallery.pageTitle')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  {t('gallery.pageTitleHighlight')}
                </span>
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed">
                {t('gallery.pageDesc')}
              </p>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Filter */}
      <AnimatedSection delay={100}>
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <Filter className="w-4 h-4 text-gray-400 shrink-0" />
              {!loading && displayCategories.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    activeCategory === key
                      ? 'bg-primary text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Gallery Grid */}
      <AnimatedSection delay={150}>
        <section className="py-8 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-20 text-gray-400">{t('common.loading')}</div>
            ) : (
              <>
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                  {filtered.map((item, i) => (
                    <div
                      key={`${item.title}-${i}`}
                      className="group relative rounded-2xl overflow-hidden cursor-pointer break-inside-avoid"
                      onClick={() => setLightbox(item)}
                    >
                      <img
                        src={item.src || item.image}
                        alt={item.title}
                        className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                          (item.size || 'normal') === 'tall' ? 'h-96' : (item.size || 'normal') === 'wide' ? 'h-56' : 'h-72'
                        }`}
                      />
                      <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/60 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-center transform translate-y-4 group-hover:translate-y-0">
                          <ZoomIn className="w-8 h-8 text-white mx-auto mb-3" />
                          <p className="text-white font-semibold">{item.title}</p>
                          <span className="text-primary text-sm">{item.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filtered.length === 0 && (
                  <div className="text-center py-20 text-gray-400">
                    {t('gallery.empty')}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </AnimatedSection>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-dark/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <img
              src={lightbox.src || lightbox.image}
              alt={lightbox.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
            <div className="mt-4 text-center">
              <h3 className="text-xl font-semibold">{lightbox.title}</h3>
              <p className="text-primary text-sm mt-1">{lightbox.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
