import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Services from './pages/Services'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Gallery from './pages/Gallery'
import References from './pages/References'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import WhatsAppButton from './components/WhatsAppButton'
import CookieConsent from './components/CookieConsent'

import AdminLayout from './admin/AdminLayout'
import Login from './admin/Login'
import Dashboard from './admin/Dashboard'
import UserManager from './admin/UserManager'
import ActivityLog from './admin/ActivityLog'
import FileManager from './admin/FileManager'
import ServicesManager from './admin/ServicesManager'
import ProductsManager from './admin/ProductsManager'
import GalleryManager from './admin/GalleryManager'
import ClientsManager from './admin/ClientsManager'
import TestimonialsManager from './admin/TestimonialsManager'
import MessagesManager from './admin/MessagesManager'
import StatsManager from './admin/StatsManager'
import SettingsManager from './admin/SettingsManager'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
    </div>
  )
  if (!user) return <Navigate to="/admin/login" replace />
  return children
}

function PublicLayout() {
  return (
    <div className="min-h-screen bg-dark text-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hizmetler" element={<Services />} />
          <Route path="/urunler" element={<Products />} />
          <Route path="/urunler/:id" element={<ProductDetail />} />
          <Route path="/galeri" element={<Gallery />} />
          <Route path="/referanslar" element={<References />} />
          <Route path="/iletisim" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <WhatsAppButton />
        <CookieConsent />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="kullanicilar" element={<UserManager />} />
            <Route path="aktivite" element={<ActivityLog />} />
            <Route path="dosyalar" element={<FileManager />} />
            <Route path="hizmetler" element={<ServicesManager />} />
            <Route path="urunler" element={<ProductsManager />} />
            <Route path="galeri" element={<GalleryManager />} />
            <Route path="musteriler" element={<ClientsManager />} />
            <Route path="yorumlar" element={<TestimonialsManager />} />
            <Route path="mesajlar" element={<MessagesManager />} />
            <Route path="istatistikler" element={<StatsManager />} />
            <Route path="ayarlar" element={<SettingsManager />} />
          </Route>

          {/* Public Routes */}
          <Route path="/*" element={<PublicLayout />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
