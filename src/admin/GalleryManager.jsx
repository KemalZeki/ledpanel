import { useState, useEffect, useCallback } from 'react'
import { apiCall } from '../context/AuthContext'
import DataTable from './components/DataTable'
import Modal from './components/Modal'
import { Input, Select, Toggle } from './components/FormField'
import ImageUpload from './components/ImageUpload'
import { Plus, Edit2, Trash2 } from 'lucide-react'

const initialFormData = {
  title: '',
  category: 'Konser',
  image: '',
  size: 'normal',
  sort_order: 0,
  is_active: true,
}

const categoryOptions = [
  { value: 'Konser', label: 'Konser' },
  { value: 'Kurumsal', label: 'Kurumsal' },
  { value: 'Fuar', label: 'Fuar' },
  { value: 'Düğün', label: 'Düğün' },
  { value: 'Outdoor', label: 'Outdoor' },
]

const sizeOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'tall', label: 'Uzun' },
  { value: 'wide', label: 'Geniş' },
]

export default function GalleryManager() {
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
      const res = await apiCall(`gallery.php?page=${page}&limit=20&search=${encodeURIComponent(search)}`)
      if (res.success) { setItems(res.data || []); setTotalPages(res.pages || 1) }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [page, search])

  useEffect(() => { fetchItems() }, [fetchItems])

  const openEdit = (row) => {
    setEditItem(row)
    setFormData({
      title: row.title || '', category: row.category || 'Konser', image: row.image || '',
      size: row.size || 'normal', sort_order: row.sort_order ?? 0, is_active: row.is_active == 1,
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...formData, is_active: formData.is_active ? 1 : 0 }
      if (editItem) {
        const res = await apiCall(`gallery.php?id=${editItem.id}`, { method: 'PUT', body: JSON.stringify(payload) })
        if (res.success) { setShowModal(false); fetchItems() }
      } else {
        const res = await apiCall('gallery.php', { method: 'POST', body: JSON.stringify(payload) })
        if (res.success) { setShowModal(false); fetchItems() }
      }
    } catch (err) { console.error(err) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) return
    try {
      const res = await apiCall(`gallery.php?id=${id}`, { method: 'DELETE' })
      if (res.success) fetchItems()
    } catch (err) { console.error(err) }
  }

  const handleSortChange = (reordered) => setItems(reordered)

  const handleSortSave = async (currentData) => {
    await apiCall('sort.php', {
      method: 'POST',
      body: JSON.stringify({
        table: 'gallery',
        items: currentData.map((item, i) => ({ id: item.id, sort_order: i + 1 })),
      }),
    })
    fetchItems()
  }

  const columns = [
    { header: 'ID', accessor: 'id', className: 'w-14' },
    {
      header: 'Görsel', accessor: 'image',
      render: (row) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#0f172a] border border-white/10 shrink-0">
          {row.image ? <img src={row.image} alt={row.title} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">-</div>}
        </div>
      ),
    },
    { header: 'Başlık', accessor: 'title' },
    { header: 'Kategori', accessor: 'category' },
    {
      header: 'Boyut', accessor: 'size',
      render: (row) => ({ normal: 'Normal', tall: 'Uzun', wide: 'Geniş' }[row.size] || row.size),
    },
    {
      header: 'Durum', accessor: 'is_active',
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
        <h1 className="text-2xl font-bold">Galeri Yönetimi</h1>
        <p className="text-sm text-gray-400 mt-1">Galeri görsellerinizi yönetin — satırları sürükleyerek sıralayabilirsiniz</p>
      </div>

      <DataTable
        columns={columns} data={items} loading={loading} search={search} onSearchChange={setSearch}
        page={page} totalPages={totalPages} onPageChange={setPage}
        sortable onSortChange={handleSortChange} onSortSave={handleSortSave}
        headerActions={
          <button onClick={() => { setEditItem(null); setFormData(initialFormData); setShowModal(true) }}
            className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg transition-colors">
            <Plus className="w-4 h-4" /> Yeni Ekle
          </button>
        }
        actions={(row) => (
          <>
            <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-sky-400 transition-colors"><Edit2 className="w-4 h-4" /></button>
            <button onClick={() => handleDelete(row.id)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
          </>
        )}
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Galeri Düzenle' : 'Yeni Galeri Ekle'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Başlık" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Görsel başlığı" />
            <Select label="Kategori" options={categoryOptions} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
            <div className="sm:col-span-2">
              <ImageUpload label="Görsel" value={formData.image} onChange={(url) => setFormData({ ...formData, image: url })} />
            </div>
            <Select label="Boyut" options={sizeOptions} value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} />
            <div className="sm:col-span-2 flex items-center">
              <Toggle label="Aktif" checked={formData.is_active} onChange={(v) => setFormData({ ...formData, is_active: v })} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">İptal</button>
            <button type="submit" className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg transition-colors">{editItem ? 'Güncelle' : 'Kaydet'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
