import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, AlertTriangle } from 'lucide-react'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="relative mb-8">
          <span className="text-[150px] sm:text-[200px] font-black text-white/[0.03] leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <AlertTriangle className="w-12 h-12 text-primary" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t('notFound.title')}</h1>
        <p className="text-gray-400 mb-8">{t('notFound.desc')}</p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/25"
        >
          <Home className="w-5 h-5" />
          {t('notFound.goHome')}
        </Link>
      </div>
    </div>
  )
}
