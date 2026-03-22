import { useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Briefcase, Monitor, Image, Building2,
  MessageSquare, Settings, LogOut, Menu, X, Mail, ChevronDown,
  Star, Users, BarChart3, ExternalLink, FileText, Activity
} from 'lucide-react'

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/kullanicilar', icon: Users, label: 'Kullanıcılar' },
  { path: '/admin/aktivite', icon: Activity, label: 'Aktivite' },
  { path: '/admin/dosyalar', icon: FileText, label: 'Dosyalar' },
  { path: '/admin/hizmetler', icon: Briefcase, label: 'Hizmetler' },
  { path: '/admin/urunler', icon: Monitor, label: 'Ürünler' },
  { path: '/admin/galeri', icon: Image, label: 'Galeri' },
  { path: '/admin/musteriler', icon: Building2, label: 'Müşteriler' },
  { path: '/admin/yorumlar', icon: Star, label: 'Yorumlar' },
  { path: '/admin/mesajlar', icon: Mail, label: 'Mesajlar' },
  { path: '/admin/istatistikler', icon: BarChart3, label: 'İstatistikler' },
  { path: '/admin/ayarlar', icon: Settings, label: 'Ayarlar' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path
    return location.pathname.startsWith(item.path)
  }

  return (
    <div className="flex h-screen bg-[#0f172a] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1e293b] border-r border-white/5 transform transition-transform duration-300 lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/5">
          <Link to="/admin" className="flex items-center gap-2.5">
            <Monitor className="w-7 h-7 text-sky-400" />
            <div>
              <span className="text-base font-bold">LED<span className="text-sky-400">Ekran</span></span>
              <span className="block text-[9px] text-gray-400 tracking-[0.15em] uppercase -mt-0.5">Admin Panel</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(item)
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/5">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Siteyi Görüntüle
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-[#1e293b]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5">
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden lg:block text-sm text-gray-400">
            {menuItems.find(m => isActive(m))?.label || 'Admin Panel'}
          </div>

          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-xs font-bold">
                {user?.full_name?.[0] || 'A'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium">{user?.full_name}</div>
                <div className="text-xs text-gray-400">{user?.role === 'admin' ? 'Yönetici' : 'Editör'}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-12 z-50 w-48 bg-[#1e293b] border border-white/10 rounded-xl shadow-xl py-1">
                  <Link to="/admin/ayarlar" onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5">
                    <Settings className="w-4 h-4" /> Ayarlar
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5">
                    <LogOut className="w-4 h-4" /> Çıkış Yap
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
