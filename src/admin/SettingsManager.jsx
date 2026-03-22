import { useState, useEffect, useCallback } from 'react'
import { apiCall } from '../context/AuthContext'
import { Input } from './components/FormField'
import { Loader2, Save } from 'lucide-react'

const TABS = [
  { id: 'general', label: 'Genel' },
  { id: 'contact', label: 'İletişim' },
  { id: 'social', label: 'Sosyal Medya' },
  { id: 'seo', label: 'SEO' },
]

const GROUP_KEYS = {
  general: ['site_title', 'site_description'],
  contact: ['phone', 'phone2', 'email', 'email2', 'address', 'whatsapp', 'working_hours'],
  social: ['facebook', 'instagram', 'twitter', 'youtube', 'linkedin'],
  seo: ['meta_keywords', 'meta_description'],
}

const LABELS = {
  site_title: 'Site Başlığı',
  site_description: 'Site Açıklaması',
  phone: 'Telefon',
  phone2: 'Telefon 2',
  email: 'E-posta',
  email2: 'E-posta 2',
  address: 'Adres',
  whatsapp: 'WhatsApp',
  working_hours: 'Çalışma Saatleri',
  facebook: 'Facebook',
  instagram: 'Instagram',
  twitter: 'Twitter',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  meta_keywords: 'Meta Anahtar Kelimeler',
  meta_description: 'Meta Açıklama',
}

export default function SettingsManager() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({})

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiCall('settings.php')
      if (res.success) {
        const flat = {}
        if (res.grouped) {
          Object.values(res.grouped).forEach((group) => {
            if (group && typeof group === 'object') {
              Object.assign(flat, group)
            }
          })
        }
        if (res.data && Array.isArray(res.data)) {
          res.data.forEach((s) => {
            if (s.key) flat[s.key] = s.value
          })
        }
        setSettings(flat)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async (tabId) => {
    const keys = GROUP_KEYS[tabId] || []
    const payload = {}
    keys.forEach((k) => {
      if (settings[k] !== undefined) payload[k] = settings[k]
    })
    if (Object.keys(payload).length === 0) return

    setSaving(true)
    try {
      const res = await apiCall('settings.php', {
        method: 'PUT',
        body: JSON.stringify({ settings: payload }),
      })
      if (res.success) {
        fetchSettings()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Site Ayarları</h1>
        <p className="text-sm text-gray-400 mt-1">Site genel ayarlarını yönetin</p>
      </div>

      <div className="bg-[#1e293b] border border-white/10 rounded-2xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-white/10 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-sky-400 border-b-2 border-sky-500 bg-sky-500/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-4 max-w-2xl">
              <Input
                label={LABELS.site_title}
                value={settings.site_title || ''}
                onChange={(e) => updateSetting('site_title', e.target.value)}
                placeholder="Site başlığı"
              />
              <Input
                label={LABELS.site_description}
                value={settings.site_description || ''}
                onChange={(e) => updateSetting('site_description', e.target.value)}
                placeholder="Site açıklaması"
              />
              <div className="pt-4">
                <button
                  onClick={() => handleSave('general')}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Kaydet
                </button>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-4 max-w-2xl">
              <Input
                label={LABELS.phone}
                value={settings.phone || ''}
                onChange={(e) => updateSetting('phone', e.target.value)}
                placeholder="+90 555 000 00 00"
              />
              <Input
                label={LABELS.phone2}
                value={settings.phone2 || ''}
                onChange={(e) => updateSetting('phone2', e.target.value)}
                placeholder="İkinci telefon"
              />
              <Input
                label={LABELS.email}
                type="email"
                value={settings.email || ''}
                onChange={(e) => updateSetting('email', e.target.value)}
                placeholder="info@example.com"
              />
              <Input
                label={LABELS.email2}
                type="email"
                value={settings.email2 || ''}
                onChange={(e) => updateSetting('email2', e.target.value)}
                placeholder="İkinci e-posta"
              />
              <Input
                label={LABELS.address}
                value={settings.address || ''}
                onChange={(e) => updateSetting('address', e.target.value)}
                placeholder="Adres"
              />
              <Input
                label={LABELS.whatsapp}
                value={settings.whatsapp || ''}
                onChange={(e) => updateSetting('whatsapp', e.target.value)}
                placeholder="WhatsApp numarası"
              />
              <Input
                label={LABELS.working_hours}
                value={settings.working_hours || ''}
                onChange={(e) => updateSetting('working_hours', e.target.value)}
                placeholder="Örn: Pazartesi-Cumartesi 09:00-18:00"
              />
              <div className="pt-4">
                <button
                  onClick={() => handleSave('contact')}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Kaydet
                </button>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-4 max-w-2xl">
              <Input
                label={LABELS.facebook}
                value={settings.facebook || ''}
                onChange={(e) => updateSetting('facebook', e.target.value)}
                placeholder="https://facebook.com/..."
              />
              <Input
                label={LABELS.instagram}
                value={settings.instagram || ''}
                onChange={(e) => updateSetting('instagram', e.target.value)}
                placeholder="https://instagram.com/..."
              />
              <Input
                label={LABELS.twitter}
                value={settings.twitter || ''}
                onChange={(e) => updateSetting('twitter', e.target.value)}
                placeholder="https://twitter.com/..."
              />
              <Input
                label={LABELS.youtube}
                value={settings.youtube || ''}
                onChange={(e) => updateSetting('youtube', e.target.value)}
                placeholder="https://youtube.com/..."
              />
              <Input
                label={LABELS.linkedin}
                value={settings.linkedin || ''}
                onChange={(e) => updateSetting('linkedin', e.target.value)}
                placeholder="https://linkedin.com/..."
              />
              <div className="pt-4">
                <button
                  onClick={() => handleSave('social')}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Kaydet
                </button>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-4 max-w-2xl">
              <Input
                label={LABELS.meta_keywords}
                value={settings.meta_keywords || ''}
                onChange={(e) => updateSetting('meta_keywords', e.target.value)}
                placeholder="Anahtar kelimeler (virgülle ayırın)"
              />
              <Input
                label={LABELS.meta_description}
                value={settings.meta_description || ''}
                onChange={(e) => updateSetting('meta_description', e.target.value)}
                placeholder="Meta açıklama (arama sonuçlarında görünür)"
              />
              <div className="pt-4">
                <button
                  onClick={() => handleSave('seo')}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Kaydet
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
