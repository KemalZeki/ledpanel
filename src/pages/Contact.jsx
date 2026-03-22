import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { publicApiUrl } from '../config/api'
import { AnimatedSection } from '../hooks/useScrollAnimation'
import {
  Phone, Mail, MapPin, Clock, Send, CheckCircle,
  MessageSquare, Building2, User, FileText, Loader2
} from 'lucide-react'

const contactInfo = [
  { icon: Phone, titleKey: 'contact.phone', lines: ['+90 (212) 555 00 00', '+90 (532) 555 00 00'] },
  { icon: Mail, titleKey: 'contact.email', lines: ['info@ledekran.com', 'destek@ledekran.com'] },
  { icon: MapPin, titleKey: 'contact.address', lines: ['Maslak, Büyükdere Cad. No:123', 'Sarıyer / İstanbul'] },
  { icon: Clock, titleKey: 'contact.workingHours', lines: ['Pazartesi - Cumartesi', '09:00 - 18:00'] },
]

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  subject: '',
  event_type: '',
  message: '',
}

export default function Contact() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState(initialFormData)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch(publicApiUrl('/api/public.php?entity=contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
        setFormData(initialFormData)
        setTimeout(() => setSubmitted(false), 5000)
      }
    } catch (_) {}
    setSubmitting(false)
  }

  return (
    <div>
      {/* Hero */}
      <AnimatedSection>
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">{t('contact.pageTag')}</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold mt-3 mb-6">
                {t('contact.pageTitle')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  {t('contact.pageTitleHighlight')}
                </span>
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed">
                {t('contact.pageDesc')}
              </p>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Contact Cards */}
      <AnimatedSection delay={100}>
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {contactInfo.map((info, i) => (
                <div
                  key={i}
                  className="bg-dark-light/50 border border-white/5 rounded-2xl p-6 hover:border-primary/20 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <info.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{t(info.titleKey)}</h3>
                  {info.lines.map((line, j) => (
                    <p key={j} className="text-sm text-gray-400">{line}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Form + Map */}
      <AnimatedSection delay={150}>
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Form */}
              <div className="lg:col-span-3">
                <div className="bg-dark-light/50 border border-white/5 rounded-2xl p-8 sm:p-10">
                  <div className="flex items-center gap-3 mb-8">
                    <MessageSquare className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">{t('contact.formTitle')}</h2>
                  </div>

                  {submitted && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 mb-6">
                      <CheckCircle className="w-5 h-5 shrink-0" />
                      <p className="text-sm">{t('contact.successMessage')}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <User className="w-4 h-4 inline mr-1.5" />{t('contact.nameLabel')} *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder={t('contact.namePlaceholder')}
                          className="w-full px-4 py-3 bg-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <Mail className="w-4 h-4 inline mr-1.5" />{t('contact.emailLabel')} *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder={t('contact.emailPlaceholder')}
                          className="w-full px-4 py-3 bg-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <Phone className="w-4 h-4 inline mr-1.5" />{t('contact.phoneLabel')}
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder={t('contact.phonePlaceholder')}
                          className="w-full px-4 py-3 bg-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <Building2 className="w-4 h-4 inline mr-1.5" />{t('contact.companyLabel')}
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder={t('contact.companyPlaceholder')}
                          className="w-full px-4 py-3 bg-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <FileText className="w-4 h-4 inline mr-1.5" />{t('contact.subjectLabel')} *
                        </label>
                        <select
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm appearance-none"
                        >
                          <option value="">{t('contact.selectSubject')}</option>
                          <option value="kiralama">{t('contact.subjectRental')}</option>
                          <option value="satis">{t('contact.subjectSales')}</option>
                          <option value="teknik">{t('contact.subjectSupport')}</option>
                          <option value="diger">{t('contact.subjectOther')}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">{t('contact.eventTypeLabel')}</label>
                        <select
                          name="event_type"
                          value={formData.event_type}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm appearance-none"
                        >
                          <option value="">{t('contact.selectEvent')}</option>
                          <option value="konser">{t('contact.eventConcert')}</option>
                          <option value="kurumsal">{t('contact.eventCorporate')}</option>
                          <option value="fuar">{t('contact.eventFair')}</option>
                          <option value="dugun">{t('contact.eventWedding')}</option>
                          <option value="reklam">{t('contact.eventAd')}</option>
                          <option value="diger">{t('contact.subjectOther')}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{t('contact.messageLabel')} *</label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={t('contact.messagePlaceholder')}
                        className="w-full px-4 py-3 bg-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {t('contact.sending')}
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          {t('contact.send')}
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Map / Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl overflow-hidden h-80 border border-white/5">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3006.8!2d29.02!3d41.11!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDA2JzM2LjAiTiAyOcKwMDEnMTIuMCJF!5e0!3m2!1str!2str!4v1"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Konum"
                  />
                </div>

                <div className="bg-dark-light/50 border border-white/5 rounded-2xl p-8">
                  <h3 className="font-semibold text-lg mb-4">{t('contact.quickContact')}</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    {t('contact.quickContactDesc')}
                  </p>
                  <div className="space-y-3">
                    <a
                      href="tel:+902125550000"
                      className="flex items-center gap-3 px-5 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-sm font-medium"
                    >
                      <Phone className="w-5 h-5" />
                      +90 (212) 555 00 00
                    </a>
                    <a
                      href="https://wa.me/905325550000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-5 py-3 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-colors text-sm font-medium"
                    >
                      <MessageSquare className="w-5 h-5" />
                      {t('contact.whatsapp')}
                    </a>
                    <a
                      href="mailto:info@ledekran.com"
                      className="flex items-center gap-3 px-5 py-3 rounded-xl bg-accent/10 hover:bg-accent/20 text-accent transition-colors text-sm font-medium"
                    >
                      <Mail className="w-5 h-5" />
                      info@ledekran.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </div>
  )
}
