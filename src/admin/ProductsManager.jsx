import { useState, useEffect, useCallback } from 'react'
import { apiCall } from '../context/AuthContext'
import DataTable from './components/DataTable'
import Modal from './components/Modal'
import { Input, Select, Textarea, Toggle } from './components/FormField'
import ImageUpload from './components/ImageUpload'
import { Plus, Edit2, Trash2 } from 'lucide-react'

const initialFormData = {
  name: '',
  category: 'indoor',
  pixel_pitch: '',
  brightness: '',
  resolution: '',
  panel_size: '',
  weight: '',
  refresh_rate: '',
  best_for: '',
  description: '',
  image: '',
  is_popular: false,
  is_active: true,
  sort_order: 0,
}

const categoryOptions = [
  { value: 'indoor', label: 'İç Mekan' },
  { value: 'outdoor', label: 'Dış Mekan' },
]

export default function ProductsManager() {
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
      const res = await apiCall(`products.php?page=${page}&limit=20&search=${encodeURIComponent(search)}`)
      if (res.success) {
        setItems(res.data || [])
        setTotalPages(res.pages || 1)
      }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [page, search])

  useEffect(() => { fetchItems() }, [fetchItems])

  const openEdit = (row) => {
    setEditItem(row)
    setFormData({
      name: row.name || '', category: row.category || 'indoor', pixel_pitch: row.pixel_pitch || '',
      brightness: row.brightness || '', resolution: row.resolution || '', panel_size: row.panel_size || '',
      weight: row.weight || '', refresh_rate: row.refresh_rate || '', best_for: row.best_for || '',
      description: row.description || '', image: row.image || '', is_popular: row.is_popular == 1,
      is_active: row.is_active == 1, sort_order: row.sort_order ?? 0,
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...formData, is_popular: formData.is_popular ? 1 : 0, is_active: formData.is_active ? 1 : 0 }
      if (editItem) {
        const res = await apiCall(`products.php?id=${editItem.id}`, { method: 'PUT', body: JSON.stringify(payload) })
        if (res.success) { setShowModal(false); fetchItems() }
      } else {
        const res = await apiCall('products.php', { method: 'POST', body: JSON.stringify(payload) })
        if (res.success) { setShowModal(false); fetchItems() }
      }
    } catch (err) { console.error(err) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) return
    try {
      const res = await apiCall(`products.php?id=${id}`, { method: 'DELETE' })
      if (res.success) fetchItems()
    } catch (err) { console.error(err) }
  }

  const handleSortChange = (reordered) => setItems(reordered)

  const handleSortSave = async (currentData) => {
    await apiCall('sort.php', {
      method: 'POST',
      body: JSON.stringify({
        table: 'products',
        items: currentData.map((item, i) => ({ id: item.id, sort_order: i + 1 })),
      }),
    })
    fetchItems()
  }

  const columns = [
    { header: 'ID', accessor: 'id', className: 'w-14' },
    { header: 'Ürün Adı', accessor: 'name' },
    {
      header: 'Kategori', accessor: 'category',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.category === 'indoor' ? 'bg-sky-500/10 text-sky-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
          {row.category === 'indoor' ? 'İç Mekan' : 'Dış Mekan'}
        </span>
      ),
    },
    { header: 'Pixel Pitch', accessor: 'pixel_pitch' },
    {
      header: 'Popüler', accessor: 'is_popular',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.is_popular == 1 ? 'bg-amber-500/10 text-amber-400' : 'bg-gray-500/10 text-gray-400'}`}>
          {row.is_popular == 1 ? 'Evet' : 'Hayır'}
        </span>
      ),
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
        <h1 className="text-2xl font-bold">Ürünler Yönetimi</h1>
        <p className="text-sm text-gray-400 mt-1">LED ekran ürünlerinizi yönetin — satırları sürükleyerek sıralayabilirsiniz</p>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'} size="xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Ürün Adı" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ürün adı" />
            <Select label="Kategori" required options={categoryOptions} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
            <Input label="Pixel Pitch" value={formData.pixel_pitch} onChange={(e) => setFormData({ ...formData, pixel_pitch: e.target.value })} placeholder="Örn: P2.5" />
            <Input label="Parlaklık" value={formData.brightness} onChange={(e) => setFormData({ ...formData, brightness: e.target.value })} placeholder="Örn: 8000 nits" />
            <Input label="Çözünürlük" value={formData.resolution} onChange={(e) => setFormData({ ...formData, resolution: e.target.value })} placeholder="Örn: 1920x1080" />
            <Input label="Panel Boyutu" value={formData.panel_size} onChange={(e) => setFormData({ ...formData, panel_size: e.target.value })} placeholder="Örn: 500x500mm" />
            <Input label="Ağırlık" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} placeholder="Örn: 12kg" />
            <Input label="Yenileme Hızı" value={formData.refresh_rate} onChange={(e) => setFormData({ ...formData, refresh_rate: e.target.value })} placeholder="Örn: 3840Hz" />
            <Input label="En İyi Kullanım" value={formData.best_for} onChange={(e) => setFormData({ ...formData, best_for: e.target.value })} placeholder="Örn: Konser, Fuar" />
            <ImageUpload label="Görsel" value={formData.image} onChange={(url) => setFormData({ ...formData, image: url })} />
            <div className="sm:col-span-2 flex items-center gap-6">
              <Toggle label="Popüler" checked={formData.is_popular} onChange={(v) => setFormData({ ...formData, is_popular: v })} />
              <Toggle label="Aktif" checked={formData.is_active} onChange={(v) => setFormData({ ...formData, is_active: v })} />
            </div>
          </div>
          <Textarea label="Açıklama" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Ürün açıklaması" rows={4} />
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">İptal</button>
            <button type="submit" className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg transition-colors">{editItem ? 'Güncelle' : 'Kaydet'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
