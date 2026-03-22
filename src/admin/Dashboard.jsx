import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiCall } from '../context/AuthContext'
import {
  Mail, MailOpen, Star, Briefcase, Monitor, Image, Building2,
  MessageSquare, TrendingUp, Clock, ArrowRight, Loader2, Eye,
  Users, FileText, Activity, Settings
} from 'lucide-react'

const iconMap = { Briefcase, Monitor, Image, Building2, MessageSquare }

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiCall('dashboard.php').then(res => {
      if (res.success) setData(res.data)
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
    </div>
  )

  if (!data) return <div className="text-center text-gray-400 py-20">Veriler yüklenemedi</div>

  const actionMap = {
    login: 'Giriş yaptı', logout: 'Çıkış yaptı', create: 'Oluşturdu',
    update: 'Güncelledi', delete: 'Sildi', upload: 'Dosya yükledi',
    change_password: 'Şifre değiştirdi',
  }

  const quickLinks = [
    { to: '/admin/kullanicilar', icon: Users, label: 'Kullanıcılar' },
    { to: '/admin/mesajlar', icon: Mail, label: 'Mesajlar' },
    { to: '/admin/dosyalar', icon: FileText, label: 'Dosyalar' },
    { to: '/admin/aktivite', icon: Activity, label: 'Aktivite' },
    { to: '/admin/ayarlar', icon: Settings, label: 'Ayarlar' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Sitenizin genel durumuna bakış</p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        {quickLinks.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white hover:border-sky-500/30 hover:bg-sky-500/5 transition-colors"
          >
            <Icon className="w-4 h-4 text-sky-400" />
            {label}
          </Link>
        ))}
      </div>

      {/* Message Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#1e293b] border border-white/10 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center">
            <Mail className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <div className="text-2xl font-bold">{data.totalMessages}</div>
            <div className="text-xs text-gray-400">Toplam Mesaj</div>
          </div>
        </div>
        <div className="bg-[#1e293b] border border-white/10 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <MailOpen className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-bold">{data.unreadMessages}</div>
            <div className="text-xs text-gray-400">Okunmamış</div>
          </div>
        </div>
        <div className="bg-[#1e293b] border border-white/10 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <Star className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <div className="text-2xl font-bold">{data.starredMessages}</div>
            <div className="text-xs text-gray-400">Yıldızlı</div>
          </div>
        </div>
      </div>

      {/* Monthly Messages Chart */}
      {data.monthlyMessages && data.monthlyMessages.length > 0 && (
        <div className="bg-[#1e293b] border border-white/10 rounded-xl p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sky-400" />Aylık Mesaj Trendi
          </h2>
          <div className="flex items-end gap-2 h-40">
            {data.monthlyMessages.map((m, i) => {
              const maxCount = Math.max(...data.monthlyMessages.map(x => x.count), 1)
              const height = (m.count / maxCount) * 100
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-400">{m.count}</span>
                  <div className="w-full h-24 flex flex-col justify-end">
                    <div className="w-full bg-sky-500/20 rounded-t-md relative" style={{ height: `${Math.max(height, 5)}%` }}>
                      <div className="absolute inset-0 bg-sky-500 rounded-t-md opacity-60" />
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-500">{m.month.split('-')[1]}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Content Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {data.stats.map((s, i) => {
          const Icon = iconMap[s.icon] || Briefcase
          return (
            <div key={i} className="bg-[#1e293b] border border-white/10 rounded-xl p-4 text-center">
              <Icon className="w-5 h-5 text-sky-400 mx-auto mb-2" />
              <div className="text-xl font-bold">{s.count}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <div className="bg-[#1e293b] border border-white/10 rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h2 className="font-semibold flex items-center gap-2"><Mail className="w-4 h-4 text-sky-400" />Son Mesajlar</h2>
            <Link to="/admin/mesajlar" className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1">
              Tümü <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {data.recentMessages.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">Henüz mesaj yok</div>
            ) : data.recentMessages.map(msg => (
              <div key={msg.id} className="px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${msg.is_read == 0 ? 'text-white' : 'text-gray-300'}`}>{msg.name}</span>
                  {msg.is_read == 0 && <span className="w-2 h-2 rounded-full bg-sky-400" />}
                </div>
                <p className="text-xs text-gray-400 truncate">{msg.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-gray-500">{msg.email}</span>
                  <span className="text-[10px] text-gray-600">•</span>
                  <span className="text-[10px] text-gray-500">{new Date(msg.created_at).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#1e293b] border border-white/10 rounded-xl">
          <div className="px-5 py-4 border-b border-white/5">
            <h2 className="font-semibold flex items-center gap-2"><Clock className="w-4 h-4 text-sky-400" />Son Aktiviteler</h2>
          </div>
          <div className="divide-y divide-white/5 max-h-96 overflow-y-auto">
            {data.recentActivities.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">Henüz aktivite yok</div>
            ) : data.recentActivities.map(act => (
              <div key={act.id} className="px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">
                    <span className="font-medium text-white">{act.full_name || act.username}</span>
                    {' '}<span className="text-gray-400">{actionMap[act.action] || act.action}</span>
                    {act.entity_type && <span className="text-sky-400/70 ml-1">({act.entity_type})</span>}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500">{new Date(act.created_at).toLocaleString('tr-TR')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
