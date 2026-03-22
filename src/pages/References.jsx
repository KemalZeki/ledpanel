import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { publicApiUrl } from '../config/api'
import { AnimatedSection } from '../hooks/useScrollAnimation'
import { Star, Quote, Building2, Music, Award, Users } from 'lucide-react'

const iconMap = {
  award: Award,
  users: Users,
  building: Building2,
  music: Music,
}

const fallbackClients = [
  { name: 'Samsung', category: 'Teknoloji', logo: 'https://cdn.worldvectorlogo.com/logos/samsung-8.svg', website: 'https://samsung.com' },
  { name: 'Coca-Cola', category: 'Sponsor', logo: 'https://cdn.worldvectorlogo.com/logos/coca-cola-4.svg', website: 'https://coca-cola.com' },
  { name: 'Mercedes-Benz', category: 'Otomotiv', logo: 'https://cdn.worldvectorlogo.com/logos/mercedes-benz-9.svg', website: 'https://mercedes-benz.com' },
  { name: 'Vodafone', category: 'Telekom', logo: 'https://cdn.worldvectorlogo.com/logos/vodafone-icon.svg', website: 'https://vodafone.com' },
  { name: 'Nike', category: 'Spor', logo: 'https://cdn.worldvectorlogo.com/logos/nike-3.svg', website: 'https://nike.com' },
  { name: 'Red Bull', category: 'Etkinlik', logo: 'https://cdn.worldvectorlogo.com/logos/red-bull-2.svg', website: 'https://redbull.com' },
  { name: 'Spotify', category: 'Müzik', logo: 'https://cdn.worldvectorlogo.com/logos/spotify-2.svg', website: 'https://spotify.com' },
  { name: 'BMW', category: 'Otomotiv', logo: 'https://cdn.worldvectorlogo.com/logos/bmw-2.svg', website: 'https://bmw.com' },
  { name: 'Adidas', category: 'Spor', logo: 'https://cdn.worldvectorlogo.com/logos/adidas-3.svg', website: 'https://adidas.com' },
  { name: 'Netflix', category: 'Medya', logo: 'https://cdn.worldvectorlogo.com/logos/netflix-4.svg', website: 'https://netflix.com' },
  { name: 'Turkish Airlines', category: 'Havayolu', logo: 'https://cdn.worldvectorlogo.com/logos/turkish-airlines-1.svg', website: 'https://turkishairlines.com' },
  { name: 'Turkcell', category: 'Telekom', logo: 'https://cdn.worldvectorlogo.com/logos/turkcell-1.svg', website: 'https://turkcell.com.tr' },
]

const fallbackTestimonials = [
  { name: 'Ahmet Yılmaz', role: 'Etkinlik Müdürü, MegaEvents', text: 'İstanbul konserinde kullandığımız 120 m² LED ekran muhteşem performans gösterdi. Kurulum ekibi son derece profesyonel ve hızlıydı.', rating: 5, project: 'İstanbul Açık Hava Konseri' },
  { name: 'Elif Kaya', role: 'Pazarlama Direktörü, TechCorp', text: 'Ürün lansmanımız için P2.5 indoor paneller kullandık. Görüntü kalitesi inanılmazdı, katılımcılardan çok olumlu geri dönüşler aldık.', rating: 5, project: 'Ürün Lansmanı' },
  { name: 'Mehmet Demir', role: 'Genel Müdür, ProStage', text: 'Sahne prodüksiyonlarımızda yıllardır LEDEkran ile çalışıyoruz. Ekipman kalitesi ve teknik destek her zaman en üst seviyede.', rating: 5, project: 'Sahne Prodüksiyonu' },
  { name: 'Ayşe Öztürk', role: 'Organizasyon Müdürü, GalaOrg', text: 'Düğün organizasyonlarımızda kullandığımız LED paneller gece görüntüleriyle ortama büyü kattı. Müşterilerimiz çok memnun kaldı.', rating: 5, project: 'Düğün Organizasyonu' },
  { name: 'Can Aktaş', role: 'Fuar Koordinatörü, ExpoCenter', text: 'Uluslararası fuar standımız için kiraladığımız LED ekranlar standımızı en çok dikkat çeken stand haline getirdi. Mükemmel hizmet!', rating: 5, project: 'Uluslararası Fuar' },
  { name: 'Deniz Çelik', role: 'Yapımcı, LiveShow', text: 'TV programımızın set tasarımında kullanılan LED duvarlar prodüksiyon kalitemizi bir üst seviyeye taşıdı.', rating: 5, project: 'TV Set Tasarımı' },
]

const defaultStats = [
  { icon: Award, value: '500+', labelKey: 'references.successProjects' },
  { icon: Users, value: '200+', labelKey: 'references.happyClients' },
  { icon: Building2, value: '50+', labelKey: 'references.corporateRef' },
  { icon: Music, value: '100+', labelKey: 'references.concertFest' },
]

export default function References() {
  const { t } = useTranslation()
  const [clients, setClients] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(publicApiUrl('/api/public.php?entity=clients')).then(r => r.json()).catch(() => ({ success: false })),
      fetch(publicApiUrl('/api/public.php?entity=testimonials')).then(r => r.json()).catch(() => ({ success: false })),
      fetch(publicApiUrl('/api/public.php?entity=stats')).then(r => r.json()).catch(() => ({ success: false })),
    ]).then(([clientsRes, testimonialsRes, statsRes]) => {
      if (clientsRes.success && Array.isArray(clientsRes.data) && clientsRes.data.length > 0) {
        setClients(clientsRes.data)
      } else {
        setClients(fallbackClients)
      }
      if (testimonialsRes.success && Array.isArray(testimonialsRes.data) && testimonialsRes.data.length > 0) {
        setTestimonials(testimonialsRes.data)
      } else {
        setTestimonials(fallbackTestimonials)
      }
      if (statsRes.success && Array.isArray(statsRes.data) && statsRes.data.length > 0) {
        const first4 = statsRes.data.slice(0, 4)
        setStats(first4.map((s, i) => ({
          icon: defaultStats[i]?.icon || iconMap[s.icon] || defaultStats[i % 4].icon,
          value: s.value || s.val,
          labelKey: s.labelKey,
          label: s.label,
        })))
      } else {
        setStats(defaultStats)
      }
    }).finally(() => setLoading(false))
  }, [])

  const highlights = stats.length > 0 ? stats : defaultStats

  return (
    <div>
      {/* Hero */}
      <AnimatedSection>
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">{t('references.pageTag')}</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold mt-3 mb-6">
                {t('references.pageTitle')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  {t('references.pageTitleHighlight')}
                </span>
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed">
                {t('references.pageDesc')}
              </p>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Stats */}
      <AnimatedSection delay={100}>
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {highlights.map((h, i) => {
                const IconComp = h.icon
                return (
                <div key={i} className="text-center p-6 rounded-2xl bg-dark-light/50 border border-white/5">
                  <IconComp className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light mb-1">
                    {h.value}
                  </div>
                  <div className="text-sm text-gray-400">
                    {h.labelKey ? t(h.labelKey) : h.label}
                  </div>
                </div>
                )
              })}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Client Logos */}
      <AnimatedSection delay={150}>
        <section className="py-16 bg-dark-light/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-bold mb-12">{t('references.clientsTitle')}</h2>
            {loading ? (
              <div className="text-center py-12 text-gray-400">{t('common.loading')}</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {clients.map((client, i) => {
                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center justify-center p-6 rounded-xl bg-dark-light/50 border border-white/5 hover:border-primary/20 transition-all duration-300 group hover:-translate-y-1"
                    >
                      {client.logo ? (
                        <div className="w-16 h-16 rounded-xl bg-white/90 flex items-center justify-center mb-3 p-2.5 group-hover:bg-white transition-colors">
                          <img
                            src={client.logo}
                            alt={client.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.parentElement.innerHTML = `<span class="text-2xl font-bold text-primary">${(client.name || '')[0]}</span>`
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-3 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                          <span className="text-2xl font-bold text-primary">{(client.name || '')[0]}</span>
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-300 text-center">{client.name}</span>
                      <span className="text-xs text-gray-500 mt-1">{client.category}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection delay={200}>
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">{t('references.testimonialsTag')}</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3">{t('references.testimonialsTitle')}</h2>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-400">{t('common.loading')}</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((tItem, i) => (
                  <div
                    key={i}
                    className="relative bg-dark-light/50 border border-white/5 rounded-2xl p-8 hover:border-primary/20 transition-all duration-300"
                  >
                    <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6" />

                    <div className="flex gap-1 mb-4">
                      {[...Array(tItem.rating || 5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-accent fill-accent" />
                      ))}
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed mb-6">"{tItem.text}"</p>

                    <div className="text-xs text-primary/60 mb-4 uppercase tracking-wider font-medium">
                      {tItem.project}
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                      {tItem.avatar ? (
                        <img src={tItem.avatar} alt={tItem.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white">
                          {(tItem.name || '')[0]}
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
            )}
          </div>
        </section>
      </AnimatedSection>
    </div>
  )
}
