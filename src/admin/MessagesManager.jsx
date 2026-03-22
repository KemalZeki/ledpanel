import { useState, useEffect, useCallback } from 'react'
import { apiCall } from '../context/AuthContext'
import DataTable from './components/DataTable'
import Modal from './components/Modal'
import { Textarea, Toggle } from './components/FormField'
import { Eye, Star, Trash2 } from 'lucide-react'

const FILTER_ALL = 'all'
const FILTER_UNREAD = 'unread'
const FILTER_STARRED = 'starred'

export default function MessagesManager() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [detailItem, setDetailItem] = useState(null)
  const [filter, setFilter] = useState(FILTER_ALL)
  const [formData, setFormData] = useState({ is_read: true, is_starred: false, admin_notes: '' })

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      let url = `messages.php?page=${page}&limit=20&search=${encodeURIComponent(search)}`
      if (filter === FILTER_UNREAD) url += '&filter=unread'
      if (filter === FILTER_STARRED) url += '&filter=starred'
      const res = await apiCall(url)
      if (res.success) {
        setItems(res.data || [])
        setTotalPages(res.pages || 1)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, search, filter])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const openDetail = async (row) => {
    setDetailItem(row)
    setFormData({
      is_read: row.is_read == 1,
      is_starred: row.is_starred == 1,
      admin_notes: row.admin_notes || '',
    })
    setShowModal(true)
    if (row.is_read != 1) {
      try {
        await apiCall(`messages.php?id=${row.id}`, {
          method: 'PUT',
          body: JSON.stringify({ is_read: 1 }),
        })
        fetchItems()
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handleToggleStar = async (row) => {
    try {
      const res = await apiCall(`messages.php?id=${row.id}`, {
        method: 'PUT',
        body: JSON.stringify({ is_starred: row.is_starred == 1 ? 0 : 1 }),
      })
      if (res.success) fetchItems()
    } catch (err) {
      console.error(err)
    }
  }

  const handleSaveAdminNotes = async (e) => {
    e.preventDefault()
    if (!detailItem) return
    try {
      const res = await apiCall(`messages.php?id=${detailItem.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
      })
      if (res.success) {
        fetchItems()
        setDetailItem({ ...detailItem, ...formData })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu mesajı silmek istediğinize emin misiniz?')) return
    try {
      const res = await apiCall(`messages.php?id=${id}`, { method: 'DELETE' })
      if (res.success) {
        setShowModal(false)
        fetchItems()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return d.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const columns = [
    { header: 'ID', accessor: 'id', className: 'w-14' },
    {
      header: '',
      accessor: 'is_read',
      className: 'w-8',
      render: (row) => (
        row.is_read != 1 ? (
          <span className="inline-block w-2 h-2 rounded-full bg-sky-500" title="Okunmamış" />
        ) : null
      ),
    },
    { header: 'Ad', accessor: 'name' },
    { header: 'E-posta', accessor: 'email' },
    { header: 'Konu', accessor: 'subject' },
    {
      header: 'Tarih',
      accessor: 'created_at',
      render: (row) => formatDate(row.created_at),
    },
  ]

  const filterButtons = (
    <div className="flex gap-2">
      <button
        onClick={() => setFilter(FILTER_ALL)}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === FILTER_ALL ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'}`}
      >
        Tümü
      </button>
      <button
        onClick={() => setFilter(FILTER_UNREAD)}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === FILTER_UNREAD ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'}`}
      >
        Okunmamış
      </button>
      <button
        onClick={() => setFilter(FILTER_STARRED)}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === FILTER_STARRED ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'}`}
      >
        Yıldızlı
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">İletişim Mesajları</h1>
        <p className="text-sm text-gray-400 mt-1">İletişim formundan gelen mesajları yönetin</p>
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
        filters={filterButtons}
        actions={(row) => (
          <>
            <button
              onClick={() => openDetail(row)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-sky-400 transition-colors"
              title="Görüntüle"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleToggleStar(row)}
              className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${row.is_starred == 1 ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}
              title={row.is_starred == 1 ? 'Yıldızı Kaldır' : 'Yıldızla'}
            >
              <Star className={`w-4 h-4 ${row.is_starred == 1 ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
              title="Sil"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Mesaj Detayı"
        size="lg"
      >
        {detailItem && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block mb-1">Ad</span>
                <span className="text-white">{detailItem.name || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">E-posta</span>
                <span className="text-white">{detailItem.email || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Telefon</span>
                <span className="text-white">{detailItem.phone || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Tarih</span>
                <span className="text-white">{formatDate(detailItem.created_at)}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-500 block mb-1">Konu</span>
                <span className="text-white">{detailItem.subject || '-'}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-500 block mb-1">Mesaj</span>
                <p className="text-white whitespace-pre-wrap">{detailItem.message || '-'}</p>
              </div>
            </div>

            <form onSubmit={handleSaveAdminNotes} className="space-y-4 pt-4 border-t border-white/10">
              <h4 className="text-sm font-medium text-gray-300">Yönetici Notları</h4>
              <div className="flex gap-4 flex-wrap">
                <Toggle
                  label="Okundu"
                  checked={formData.is_read}
                  onChange={(v) => setFormData({ ...formData, is_read: v })}
                />
                <Toggle
                  label="Yıldızlı"
                  checked={formData.is_starred}
                  onChange={(v) => setFormData({ ...formData, is_starred: v })}
                />
              </div>
              <Textarea
                label="Notlar"
                value={formData.admin_notes}
                onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
                placeholder="Yönetici notları..."
                rows={3}
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Kapat
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Kaydet
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(detailItem.id)}
                  className="px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Sil
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  )
}
