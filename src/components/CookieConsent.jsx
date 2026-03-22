import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Cookie, X } from 'lucide-react'

export default function CookieConsent() {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!localStorage.getItem('cookie_consent')) setShow(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setShow(false)
  }

  const decline = () => {
    localStorage.setItem('cookie_consent', 'declined')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in-up">
      <div className="max-w-4xl mx-auto bg-dark-light/95 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Cookie className="w-8 h-8 text-amber-400 shrink-0" />
          <p className="flex-1 text-sm text-gray-300 leading-relaxed">
            {t('cookie.message')}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={decline}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              {t('cookie.decline')}
            </button>
            <button
              onClick={accept}
              className="px-5 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors"
            >
              {t('cookie.accept')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
