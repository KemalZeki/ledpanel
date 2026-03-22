import { useState, useEffect, useCallback } from 'react'
import { apiCall } from '../context/AuthContext'
import DataTable from './components/DataTable'
import Modal from './components/Modal'
import { Input, Toggle } from './components/FormField'
import { Plus, Edit2, Trash2 } from 'lucide-react'

const initialFormData = {
  label: '',
  value: '',
  icon: '',
  sort_order: 0,
  is_active: true,
}

export default function StatsManager() {
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
      const res = await apiCall(`stats.php?page=${page}&limit=20&search=${encodeURIComponent(search)}`)
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
      label: row.label || '',
      value: row.value || '',
      icon: row.icon || '',
      sort_order: row.sort_order ?? 0,
      is_active: row.is_active == 1,
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        is_active: formData.is_active ? 1 : 0,
      }
      if (editItem) {
        const res = await apiCall(`stats.php?id=${editItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        if (res.success) {
          setShowModal(false)
          fetchItems()
        }
      } else {
        const res = await apiCall('stats.php', {
          method: 'POST',
          body: JSON.stringify(payload),
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
    if (!confirm('Bu istatistiği silmek istediğinize emin misiniz?')) return
    try {
      const res = await apiCall(`stats.php?id=${id}`, { method: 'DELETE' })
      if (res.success) fetchItems()
    } catch (err) {
      console.error(err)
    }
  }

  const columns = [
    { header: 'ID', accessor: 'id', className: 'w-14' },
    { header: 'Etiket', accessor: 'label' },
    { header: 'Değer', accessor: 'value' },
    { header: 'İkon', accessor: 'icon' },
    { header: 'Sıra', accessor: 'sort_order', className: 'w-16' },
    {
      header: 'Durum',
      accessor: 'is_active',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.is_active == 1 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {row.is_active == 1 ? 'Aktif' : 'Pasif'}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">İstatistikler</h1>
        <p className="text-sm text-gray-400 mt-1">Site istatistiklerini yönetin</p>
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
            <Plus className="w-4 h-4" /> Yeni Ekle
          </button>
        }
        actions={(row) => (
          <>
            <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-sky-400 transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={() => handleDelete(row.id)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editItem ? 'İstatistik Düzenle' : 'Yeni İstatistik Ekle'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Etiket"
              required
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="Örn: Mutlu Müşteri"
            />
            <Input
              label="Değer"
              required
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder="Örn: 500+"
            />
            <Input
              label="İkon (metin)"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="Örn: Users, Award"
            />
            <Input
              label="Sıra"
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
            />
            <div className="sm:col-span-2 flex items-center">
              <Toggle
                label="Aktif"
                checked={formData.is_active}
                onChange={(v) => setFormData({ ...formData, is_active: v })}
              />
            </div>
          </div>
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
