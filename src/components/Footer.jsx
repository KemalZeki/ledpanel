import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Monitor, Phone, Mail, MapPin } from 'lucide-react'

const quickLinks = [
  { to: '/', labelKey: 'nav.home' },
  { to: '/hizmetler', labelKey: 'nav.services' },
  { to: '/urunler', labelKey: 'nav.products' },
  { to: '/galeri', labelKey: 'nav.gallery' },
  { to: '/referanslar', labelKey: 'nav.references' },
  { to: '/iletisim', labelKey: 'nav.contact' },
]

const services = [
  { labelKey: 'footer.ledRental' },
  { labelKey: 'footer.ledSales' },
  { labelKey: 'footer.stageSetup' },
  { labelKey: 'footer.techSupport' },
  { labelKey: 'footer.contentMgmt' },
]

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-dark-light border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <Monitor className="w-8 h-8 text-primary" />
              <div>
                <span className="text-lg font-bold">LED<span className="text-primary">Ekran</span></span>
                <span className="block text-[10px] text-gray-400 tracking-[0.2em] uppercase -mt-1">Kiralama</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('footer.desc')}
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-primary text-sm transition-colors duration-200"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">{t('footer.ourServices')}</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {services.map((s, i) => (
                <li key={i}>{t(s.labelKey)}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">{t('footer.contact')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-gray-400 text-sm">+90 (212) 555 00 00</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-gray-400 text-sm">info@ledekran.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-gray-400 text-sm">
                  Maslak, Büyükdere Cad. No:123<br />Sarıyer / İstanbul
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} LEDEkran. {t('footer.rights')}
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-primary transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-primary transition-colors">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
