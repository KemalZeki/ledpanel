import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getAdminApiBase } from '../config/api'

const AuthContext = createContext(null)

export async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('admin_token')
  const headers = { ...options.headers }

  if (token) headers['Authorization'] = `Bearer ${token}`

  const isFormData = options.body instanceof FormData
  if (!isFormData) headers['Content-Type'] = 'application/json'

  const API = getAdminApiBase()
  const res = await fetch(`${API}/${endpoint}`, { ...options, headers })
  const data = await res.json()

  if (res.status === 401) {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    window.location.href = '/admin/login'
    return data
  }

  return data
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const verify = useCallback(async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const res = await apiCall('auth.php?action=verify')
      if (res.success) {
        setUser(res.data.user)
      } else {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
      }
    } catch {
      localStorage.removeItem('admin_token')
    }
    setLoading(false)
  }, [])

  useEffect(() => { verify() }, [verify])

  const login = async (username, password) => {
    const res = await apiCall('auth.php?action=login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    if (res.success) {
      localStorage.setItem('admin_token', res.data.token)
      localStorage.setItem('admin_user', JSON.stringify(res.data.user))
      setUser(res.data.user)
    }
    return res
  }

  const logout = async () => {
    try { await apiCall('auth.php?action=logout', { method: 'POST' }) } catch {}
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, verify }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
