import { useState, useEffect, useCallback } from 'react'
import { apiCall } from '../context/AuthContext'
import DataTable from './components/DataTable'
import Modal from './components/Modal'
import { Input, Select, Textarea, Toggle } from './components/FormField'
import ImageUpload from './components/ImageUpload'
import IconPicker from './components/IconPicker'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import * as LucideIcons from 'lucide-react'

const initialFormData = {
  title: '',
  description: '',
  short_desc: '',
  icon: '',
  image: '',
  features: '',
  sort_order: 0,
  is_active: true,
}

export default function ServicesManager() {
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
      const res = await apiCall(`services.php?page=${page}&limit=20&search=${encodeURIComponent(search)}`)
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
      title: row.title || '',
      description: row.description || '',
      short_desc: row.short_desc || '',
      icon: row.icon || '',
      image: row.image || '',
      features: row.features || '',
      sort_order: row.sort_order ?? 0,
      is_active: row.is_active == 1,
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...formData, is_active: formData.is_active ? 1 : 0 }
      if (editItem) {
        const res = await apiCall(`services.php?id=${editItem.id}`, { method: 'PUT', body: JSON.stringify(payload) })
        if (res.success) { setShowModal(false); fetchItems() }
      } else {
        const res = await apiCall('services.php', { method: 'POST', body: JSON.stringify(payload) })
        if (res.success) { setShowModal(false); fetchItems() }
      }
    } catch (err) { console.error(err) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) return
    try {
      const res = await apiCall(`services.php?id=${id}`, { method: 'DELETE' })
      if (res.success) fetchItems()
    } catch (err) { console.error(err) }
  }

  const handleSortChange = (reordered) => setItems(reordered)

  const handleSortSave = async (currentData) => {
    await apiCall('sort.php', {
      method: 'POST',
      body: JSON.stringify({
        table: 'services',
        items: currentData.map((item, i) => ({ id: item.id, sort_order: i + 1 })),
      }),
    })
    fetchItems()
  }

  const columns = [
    { header: 'ID', accessor: 'id', className: 'w-14' },
    { header: 'Başlık', accessor: 'title' },
    {
      header: 'İkon',
      accessor: 'icon',
      render: (row) => {
        const Icon = row.icon ? LucideIcons[row.icon] : null
        if (!Icon) return <span className="text-gray-500">-</span>
        return (
          <span className="w-8 h-8 flex items-center justify-center bg-sky-500/10 rounded-lg">
            <Icon className="w-4 h-4 text-sky-400" />
          </span>
        )
      },
    },
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
        <h1 className="text-2xl font-bold">Hizmetler Yönetimi</h1>
        <p className="text-sm text-gray-400 mt-1">Hizmetlerinizi yönetin — satırları sürükleyerek sıralayabilirsiniz</p>
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
        sortable
        onSortChange={handleSortChange}
        onSortSave={handleSortSave}
        headerActions={
          <button
            onClick={() => { setEditItem(null); setFormData(initialFormData); setShowModal(true) }}
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Hizmet Düzenle' : 'Yeni Hizmet Ekle'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Başlık" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Hizmet başlığı" />
            <Input label="Kısa Açıklama" value={formData.short_desc} onChange={(e) => setFormData({ ...formData, short_desc: e.target.value })} placeholder="Kısa açıklama" />
            <div className="relative">
              <IconPicker label="İkon" value={formData.icon} onChange={(name) => setFormData({ ...formData, icon: name })} />
            </div>
            <ImageUpload label="Görsel" value={formData.image} onChange={(url) => setFormData({ ...formData, image: url })} />
            <div className="sm:col-span-2 flex items-center">
              <Toggle label="Aktif" checked={formData.is_active} onChange={(v) => setFormData({ ...formData, is_active: v })} />
            </div>
          </div>
          <Textarea label="Açıklama" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Detaylı açıklama" rows={3} />
          <Input label="Özellikler (virgülle ayırın)" value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} placeholder="Özellik 1, Özellik 2, Özellik 3" />
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">İptal</button>
            <button type="submit" className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg transition-colors">{editItem ? 'Güncelle' : 'Kaydet'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
