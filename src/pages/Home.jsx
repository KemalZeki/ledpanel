import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { publicApiUrl } from '../config/api'
import { AnimatedSection } from '../hooks/useScrollAnimation'
import { PageSkeleton } from '../components/LoadingSkeleton'
import {
  Monitor, Zap, Shield, Headphones, ArrowRight,
  Star, ChevronRight, Play, Tv, Settings
} from 'lucide-react'

const FEATURES_CONFIG = [
  { icon: Tv, titleKey: 'features.highRes', descKey: 'features.highResDesc' },
  { icon: Settings, titleKey: 'features.proSetup', descKey: 'features.proSetupDesc' },
  { icon: Shield, titleKey: 'features.reliable', descKey: 'features.reliableDesc' },
  { icon: Headphones, titleKey: 'features.support', descKey: 'features.supportDesc' },
]

export default function Home() {
  const { t } = useTranslation()
  const [stats, setStats] = useState([])
  const [services, setServices] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fallbackStats = [
      { value: '500+', labelKey: 'stats.projects' },
      { value: '12+', labelKey: 'stats.years' },
      { value: '200+', labelKey: 'stats.clients' },
      { value: '7/24', labelKey: 'stats.support' },
    ]

    Promise.all([
      fetch(publicApiUrl('/api/public.php?entity=stats')).then(r => r.json()).catch(() => ({ success: false })),
      fetch(publicApiUrl('/api/public.php?entity=services')).then(r => r.json()).catch(() => ({ success: false })),
      fetch(publicApiUrl('/api/public.php?entity=testimonials')).then(r => r.json()).catch(() => ({ success: false })),
    ]).then(([statsRes, servicesRes, testimonialsRes]) => {
      if (statsRes.success && Array.isArray(statsRes.data) && statsRes.data.length > 0) {
        setStats(statsRes.data.slice(0, 4))
      } else {
        setStats(fallbackStats)
      }
      if (servicesRes.success && Array.isArray(servicesRes.data)) {
        setServices(servicesRes.data.slice(0, 3))
      } else {
        setServices([
          { title: 'Konser & Festival', description: 'Dev LED ekranlar ile binlerce kişiye ulaşın.', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80' },
          { title: 'Kurumsal Etkinlik', description: 'Profesyonel sunumlar için kristal netliğinde görüntü.', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80' },
          { title: 'Fuar & Sergi', description: 'Standınızı LED teknolojisi ile öne çıkarın.', image: 'https://images.unsplash.com/photo-1591115765373-5f9cf1da241c?w=600&q=80' },
        ])
      }
      if (testimonialsRes.success && Array.isArray(testimonialsRes.data)) {
        setTestimonials(testimonialsRes.data.slice(0, 3))
      } else {
        setTestimonials([
          { name: 'Ahmet Yılmaz', role: 'Etkinlik Yöneticisi', text: 'Konserimiz için kiraladığımız LED ekranlar mükemmeldi. Kurulum hızlı, görüntü kalitesi olağanüstüydü.' },
          { name: 'Elif Kaya', role: 'Pazarlama Müdürü', text: 'Fuar standımız için aldığımız hizmet beklentilerimizin çok üzerindeydi. Kesinlikle tavsiye ederim.' },
          { name: 'Mehmet Demir', role: 'Organizasyon Şirketi', text: 'Profesyonel ekip, kaliteli ekipman ve kusursuz destek. Her etkinliğimizde tercihimiz LEDEkran.' },
        ])
      }
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <PageSkeleton />
  }

  const displayStats = stats.length > 0 ? stats : [
    { value: '500+', labelKey: 'stats.projects' },
    { value: '12+', labelKey: 'stats.years' },
    { value: '200+', labelKey: 'stats.clients' },
    { value: '7/24', labelKey: 'stats.support' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-light to-dark" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/[0.02] rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in">
                <Zap className="w-4 h-4" />
                {t('hero.badge')}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-in-up">
                {t('hero.title1')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  {t('hero.titleHighlight')}
                </span>{' '}
                {t('hero.title2')}
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed mb-10 max-w-2xl animate-fade-in-up animation-delay-200">
                {t('hero.subtitle')}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-400">
                <Link
                  to="/iletisim"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5"
                >
                  {t('hero.ctaPrimary')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/galeri"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Play className="w-5 h-5" />
                  {t('hero.ctaSecondary')}
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent" />
      </section>

      {/* Stats */}
      <AnimatedSection>
        <section className="relative -mt-20 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {displayStats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-dark-light/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 text-center hover:border-primary/30 transition-all duration-300"
                >
                  <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label ?? (stat.labelKey ? t(stat.labelKey) : '')}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Features */}
      <AnimatedSection delay={100}>
        <section className="py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">{t('features.sectionTag')}</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
                {t('features.sectionTitle')}
              </h2>
              <p className="text-gray-400">
                {t('features.sectionDesc')}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES_CONFIG.map((f, i) => (
                <div
                  key={i}
                  className="group relative bg-dark-light/50 border border-white/5 rounded-2xl p-8 hover:border-primary/30 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                    <f.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{t(f.titleKey)}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{t(f.descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Services Preview */}
      <AnimatedSection delay={200}>
        <section className="py-24 sm:py-32 bg-dark-light/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-16">
              <div>
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">{t('services.pageTag')}</span>
                <h2 className="text-3xl sm:text-4xl font-bold mt-3">
                  {t('services.homeTitle')}
                </h2>
              </div>
              <Link
                to="/hizmetler"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-light font-medium transition-colors"
              >
                {t('services.viewAll')} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {services.map((s, i) => (
                <div
                  key={i}
                  className="group relative rounded-2xl overflow-hidden h-80 cursor-pointer"
                >
                  <img
                    src={s.image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80'}
                    alt={s.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                    <p className="text-gray-300 text-sm">{s.description ?? s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection delay={100}>
        <section className="py-24 sm:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-xl" />
              <div className="relative bg-dark-light border border-white/10 rounded-3xl p-12 sm:p-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-8">
                  <Monitor className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  {t('cta.title')}
                </h2>
                <p className="text-gray-400 max-w-xl mx-auto mb-8">
                  {t('cta.desc')}
                </p>
                <Link
                  to="/iletisim"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 animate-pulse-glow"
                >
                  {t('cta.button')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Testimonial Preview */}
      <AnimatedSection delay={200}>
        <section className="py-24 sm:py-32 bg-dark-light/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">{t('references.testimonialsTag')}</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3">
                {t('references.testimonialsTitle')}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((tItem, i) => (
                <div
                  key={i}
                  className="bg-dark-light/50 border border-white/5 rounded-2xl p-8 hover:border-primary/20 transition-all duration-300"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-accent fill-accent" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">"{tItem.text}"</p>
                  <div className="flex items-center gap-3">
                    {tItem.avatar ? (
                      <img src={tItem.avatar} alt={tItem.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold">
                        {tItem.name?.[0] || '?'}
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-sm">{tItem.name}</div>
                      <div className="text-xs text-gray-400">{tItem.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/referanslar"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-light font-medium transition-colors"
              >
                {t('references.viewAll')} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </div>
  )
}
