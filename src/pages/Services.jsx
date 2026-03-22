import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { publicApiUrl } from '../config/api'
import { AnimatedSection } from '../hooks/useScrollAnimation'
import { PageSkeleton } from '../components/LoadingSkeleton'
import {
  Monitor, Music, Building2, Presentation, PartyPopper,
  Megaphone, Tv, ArrowRight, CheckCircle2, Truck, Wrench, Lightbulb
} from 'lucide-react'

const iconMap = { Music, Building2, Presentation, PartyPopper, Megaphone, Monitor, Tv }
const getIcon = (name) => iconMap[name] || Monitor

const PROCESS_ICONS = [Lightbulb, Monitor, Truck, Wrench]

export default function Services() {
  const { t } = useTranslation()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(publicApiUrl('/api/public.php?entity=services'))
      .then(r => r.json())
      .then(res => {
        if (res.success && Array.isArray(res.data)) {
          setServices(res.data)
        } else {
          setServices([
            { title: 'Konser & Festival LED Ekran', description: 'Büyük ölçekli açık hava konser ve festivaller için dev LED ekranlar.', icon: 'Music', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', features: 'Dev boyut seçenekleri,Hava koşullarına dayanıklı,Yüksek parlaklık' },
            { title: 'Kurumsal Etkinlikler', description: 'Toplantı, seminer, ürün lansmanı ve gala geceleriniz için yüksek çözünürlüklü indoor LED paneller.', icon: 'Building2', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', features: 'P2.5 yüksek çözünürlük,Sessiz çalışma,Kolay içerik yönetimi' },
            { title: 'Fuar & Sergi Standları', description: 'Fuar standınızı rakiplerinizden öne çıkaracak dikkat çekici LED çözümler.', icon: 'Presentation', image: 'https://images.unsplash.com/photo-1591115765373-5f9cf1da241c?w=800&q=80', features: 'Modüler tasarım,Hızlı kurulum,Özel boyut üretimi' },
            { title: 'Düğün & Özel Organizasyon', description: 'Özel günlerinize görsel şölen katacak LED ekran ve dekor çözümleri.', icon: 'PartyPopper', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80', features: 'Atmosfer aydınlatma,Video duvar,Canlı yayın desteği' },
            { title: 'Reklam & Tanıtım', description: 'Mağaza vitrini, AVM ve açık alan reklam ekranları ile markanızı parlak gösterin.', icon: 'Megaphone', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80', features: '7/24 çalışma,Uzaktan içerik yönetimi,Enerji tasarruflu' },
            { title: 'Sahne & TV Prodüksiyon', description: 'TV setleri, sahne tasarımı ve canlı yayınlar için profesyonel LED çözümler.', icon: 'Monitor', image: 'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=800&q=80', features: 'Kamera dostu piksel aralığı,Yüksek yenileme hızı,Renk kalibrasyonu' },
          ])
        }
      })
      .catch(() => {
        setServices([
          { title: 'Konser & Festival LED Ekran', description: 'Büyük ölçekli açık hava konser ve festivaller için dev LED ekranlar.', icon: 'Music', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', features: 'Dev boyut seçenekleri,Hava koşullarına dayanıklı,Yüksek parlaklık' },
          { title: 'Kurumsal Etkinlikler', description: 'Toplantı, seminer, ürün lansmanı ve gala geceleriniz için yüksek çözünürlüklü indoor LED paneller.', icon: 'Building2', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', features: 'P2.5 yüksek çözünürlük,Sessiz çalışma,Kolay içerik yönetimi' },
          { title: 'Fuar & Sergi Standları', description: 'Fuar standınızı rakiplerinizden öne çıkaracak dikkat çekici LED çözümler.', icon: 'Presentation', image: 'https://images.unsplash.com/photo-1591115765373-5f9cf1da241c?w=800&q=80', features: 'Modüler tasarım,Hızlı kurulum,Özel boyut üretimi' },
        ])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <PageSkeleton />
  }

  const processSteps = [
    { titleKey: 'services.step1', descKey: 'services.step1Desc' },
    { titleKey: 'services.step2', descKey: 'services.step2Desc' },
    { titleKey: 'services.step3', descKey: 'services.step3Desc' },
    { titleKey: 'services.step4', descKey: 'services.step4Desc' },
  ]

  return (
    <div>
      {/* Hero */}
      <AnimatedSection>
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">{t('services.pageTag')}</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold mt-3 mb-6">
                {t('services.pageTitle')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  {t('services.pageTitleHighlight')}
                </span>
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed">
                {t('services.pageDesc')}
              </p>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {services.map((service, i) => {
              const IconComponent = getIcon(service.icon)
              const featuresList = typeof service.features === 'string'
                ? service.features.split(',').map(f => f.trim()).filter(Boolean)
                : Array.isArray(service.features) ? service.features : []

              return (
                <AnimatedSection key={i} delay={i * 100}>
                  <div
                    className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center`}
                  >
                    <div className="flex-1 w-full">
                      <div className="relative rounded-2xl overflow-hidden h-72 lg:h-96">
                        <img
                          src={service.image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80'}
                          alt={service.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                        <IconComponent className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold mb-4">{service.title}</h3>
                      <p className="text-gray-400 leading-relaxed mb-6">{service.description || service.desc}</p>
                      {featuresList.length > 0 && (
                        <ul className="space-y-3 mb-8">
                          {featuresList.map((f, j) => (
                            <li key={j} className="flex items-center gap-3 text-sm text-gray-300">
                              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}
                      <Link
                        to="/iletisim"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary-light font-medium transition-colors"
                      >
                        {t('services.getDetails')} <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <AnimatedSection delay={200}>
        <section className="py-24 bg-dark-light/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">{t('services.processTag')}</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">{t('services.processTitle')}</h2>
              <p className="text-gray-400">{t('services.processDesc')}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, i) => {
                const StepIcon = PROCESS_ICONS[i] || Monitor
                return (
                  <div key={i} className="relative text-center">
                    {i < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-10 left-[60%] w-[calc(100%-20%)] h-px bg-gradient-to-r from-primary/40 to-transparent" />
                    )}
                    <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
                      <StepIcon className="w-9 h-9 text-primary" />
                      <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{t(step.titleKey)}</h3>
                    <p className="text-sm text-gray-400">{t(step.descKey)}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection delay={100}>
        <section className="py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('services.ctaTitle')}</h2>
            <p className="text-gray-400 mb-8">
              {t('services.ctaDesc')}
            </p>
            <Link
              to="/iletisim"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/25"
            >
              {t('cta.freeQuote')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </AnimatedSection>
    </div>
  )
}
