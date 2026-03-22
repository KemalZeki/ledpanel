import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { languages } from '../i18n'
import { Menu, X, Monitor, Globe, ChevronDown } from 'lucide-react'

const navLinks = [
  { path: '/', labelKey: 'nav.home' },
  { path: '/hizmetler', labelKey: 'nav.services' },
  { path: '/urunler', labelKey: 'nav.products' },
  { path: '/galeri', labelKey: 'nav.gallery' },
  { path: '/referanslar', labelKey: 'nav.references' },
  { path: '/iletisim', labelKey: 'nav.contact' },
]

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const desktopLangRef = useRef(null)
  const mobileLangRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setLangOpen(false)
  }, [location])

  useEffect(() => {
    const handleClickOutside = (e) => {
      const inDesktop = desktopLangRef.current?.contains(e.target)
      const inMobile = mobileLangRef.current?.contains(e.target)
      if (!inDesktop && !inMobile) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0]

  const handleLangChange = (code) => {
    i18n.changeLanguage(code)
    setLangOpen(false)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-dark/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Monitor className="w-9 h-9 text-primary group-hover:text-accent transition-colors duration-300" />
              <div className="absolute -inset-1 bg-primary/20 rounded-lg blur-sm group-hover:bg-accent/20 transition-colors duration-300" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight">
                LED<span className="text-primary">Ekran</span>
              </span>
              <span className="block text-[10px] text-gray-400 tracking-[0.2em] uppercase -mt-1">
                Kiralama
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.path
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {t(link.labelKey)}
              </Link>
            ))}
            <div className="relative ml-2" ref={desktopLangRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm"
                aria-label="Dil seç"
              >
                <Globe className="w-4 h-4" />
                <span>{currentLang.flag} {currentLang.code.toUpperCase()}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-1 py-2 w-40 bg-dark-light border border-white/10 rounded-xl shadow-xl z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLangChange(lang.code)}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-white/5 transition-colors ${
                        i18n.language === lang.code ? 'text-primary bg-primary/10' : 'text-gray-300'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link
              to="/iletisim"
              className="ml-4 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
            >
              {t('nav.getQuote')}
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <div className="relative" ref={mobileLangRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Dil seç"
              >
                <Globe className="w-5 h-5" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-1 py-2 w-40 bg-dark-light border border-white/10 rounded-xl shadow-xl z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLangChange(lang.code)}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-white/5 transition-colors ${
                        i18n.language === lang.code ? 'text-primary bg-primary/10' : 'text-gray-300'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-dark-light/95 backdrop-blur-md border-t border-white/5 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === link.path
                  ? 'text-primary bg-primary/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {t(link.labelKey)}
            </Link>
          ))}
          <div className="flex flex-wrap gap-2 pt-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLangChange(lang.code)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  i18n.language === lang.code ? 'text-primary bg-primary/10' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.code.toUpperCase()}</span>
              </button>
            ))}
          </div>
          <Link
            to="/iletisim"
            className="block text-center mt-3 px-6 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-all duration-300"
          >
            {t('nav.getQuote')}
          </Link>
        </div>
      </div>
    </nav>
  )
}
