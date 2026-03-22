import { useState, useEffect, useCallback } from 'react'
import { apiCall } from '../context/AuthContext'
import { useAuth } from '../context/AuthContext'
import DataTable from './components/DataTable'
import Modal from './components/Modal'
import { Input, Select, Toggle } from './components/FormField'
import { Plus, Edit2, Trash2 } from 'lucide-react'

const initialFormData = {
  username: '',
  email: '',
  password: '',
  full_name: '',
  role: 'editor',
  is_active: true,
}

const roleOptions = [
  { value: 'admin', label: 'Yönetici' },
  { value: 'editor', label: 'Editör' },
]

export default function UserManager() {
  const { user: currentUser } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [formData, setFormData] = useState(initialFormData)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiCall(`users.php?page=${page}&limit=20&search=${encodeURIComponent(search)}`)
      if (res.success) {
        setItems(res.data || [])
        setTotalPages(res.pages || 1)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const openEdit = (row) => {
    setEditItem(row)
    setFormData({
      username: row.username || '',
      email: row.email || '',
      password: '',
      full_name: row.full_name || '',
      role: row.role || 'editor',
      is_active: row.is_active == 1,
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        full_name: formData.full_name,
        role: formData.role,
        is_active: formData.is_active ? 1 : 0,
      }
      if (formData.password) payload.password = formData.password

      if (editItem) {
        const res = await apiCall(`users.php?id=${editItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        if (res.success) {
          setShowModal(false)
          fetchItems()
        }
      } else {
        if (!formData.password) {
          alert('Yeni kullanıcı için şifre zorunludur.')
          return
        }
        const res = await apiCall('users.php', {
          method: 'POST',
          body: JSON.stringify({ ...payload, password: formData.password }),
        })
        if (res.success) {
          setShowModal(false)
          fetchItems()
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    if (currentUser?.id == id) {
      alert('Kendinizi silemezsiniz.')
      return
    }
    if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return
    try {
      const res = await apiCall(`users.php?id=${id}`, { method: 'DELETE' })
      if (res.success) fetchItems()
    } catch (err) {
      console.error(err)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const columns = [
    { header: 'ID', accessor: 'id', className: 'w-14' },
    { header: 'Kullanıcı Adı', accessor: 'username' },
    { header: 'E-posta', accessor: 'email' },
    { header: 'Ad Soyad', accessor: 'full_name' },
    {
      header: 'Rol',
      accessor: 'role',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          row.role === 'admin' ? 'bg-sky-500/10 text-sky-400' : 'bg-purple-500/10 text-purple-400'
        }`}>
          {row.role === 'admin' ? 'Yönetici' : 'Editör'}
        </span>
      ),
    },
    {
      header: 'Son Giriş',
      accessor: 'last_login_at',
      render: (row) => formatDate(row.last_login_at),
    },
    {
      header: 'Durum',
      accessor: 'is_active',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          row.is_active == 1 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {row.is_active == 1 ? 'Aktif' : 'Pasif'}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kullanıcı Yönetimi</h1>
        <p className="text-sm text-gray-400 mt-1">Sistem kullanıcılarını yönetin</p>
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        headerActions={
          <button
            onClick={() => {
              setEditItem(null)
              setFormData(initialFormData)
              setShowModal(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Yeni Kullanıcı
          </button>
        }
        actions={(row) => (
          <>
            <button
              onClick={() => openEdit(row)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-sky-400 transition-colors"
              title="Düzenle"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Sil"
              disabled={currentUser?.id == row.id}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editItem ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Kullanıcı Adı"
            required
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="Kullanıcı adı"
            disabled={!!editItem}
          />
          <Input
            label="E-posta"
            required
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="ornek@email.com"
          />
          <Input
            label={editItem ? 'Yeni Şifre' : 'Şifre'}
            required={!editItem}
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder={editItem ? 'Boş bırakılırsa değişmez' : 'Şifre'}
          />
          <Input
            label="Ad Soyad"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            placeholder="Ad Soyad"
          />
          <Select
            label="Rol"
            options={roleOptions}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
          <Toggle
            label="Aktif"
            checked={formData.is_active}
            onChange={(v) => setFormData({ ...formData, is_active: v })}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {editItem ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
