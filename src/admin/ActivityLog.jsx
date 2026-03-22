import { useState, useEffect, useCallback } from 'react'
import { apiCall } from '../context/AuthContext'
import DataTable from './components/DataTable'
import Modal from './components/Modal'
import { Trash2 } from 'lucide-react'

const ACTION_LABELS = {
  login: 'Giriş',
  logout: 'Çıkış',
  create: 'Oluşturma',
  update: 'Güncelleme',
  delete: 'Silme',
  upload: 'Yükleme',
  change_password: 'Şifre Değişikliği',
}

const ACTION_COLORS = {
  create: 'bg-emerald-500/10 text-emerald-400',
  update: 'bg-sky-500/10 text-sky-400',
  delete: 'bg-red-500/10 text-red-400',
  login: 'bg-blue-500/10 text-blue-400',
  logout: 'bg-gray-500/10 text-gray-400',
  upload: 'bg-amber-500/10 text-amber-400',
  change_password: 'bg-purple-500/10 text-purple-400',
}

export default function ActivityLog() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [actionFilter, setActionFilter] = useState('')
  const [detailModal, setDetailModal] = useState(null)
  const [cleaning, setCleaning] = useState(false)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      let url = `activity.php?page=${page}&limit=20&search=${encodeURIComponent(search)}`
      if (actionFilter) url += `&action=${encodeURIComponent(actionFilter)}`
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
  }, [page, search, actionFilter])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleClearOldLogs = async () => {
    if (!confirm('90 günden eski logları silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return
    setCleaning(true)
    try {
      const res = await apiCall('activity.php?days=90', { method: 'DELETE' })
      if (res.success) {
        fetchItems()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setCleaning(false)
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
      second: '2-digit',
    })
  }

  const formatDetails = (details) => {
    if (!details) return null
    try {
      const obj = typeof details === 'string' ? JSON.parse(details) : details
      return JSON.stringify(obj, null, 2)
    } catch {
      return String(details)
    }
  }

  const columns = [
    {
      header: 'Tarih',
      accessor: 'created_at',
      render: (row) => formatDate(row.created_at),
    },
    {
      header: 'Kullanıcı',
      accessor: 'username',
      render: (row) => row.full_name || row.username || '-',
    },
    {
      header: 'İşlem',
      accessor: 'action',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ACTION_COLORS[row.action] || 'bg-gray-500/10 text-gray-400'}`}>
          {ACTION_LABELS[row.action] || row.action}
        </span>
      ),
    },
    { header: 'Tablo', accessor: 'entity_type' },
    { header: 'ID', accessor: 'entity_id', className: 'w-14' },
    {
      header: 'Detay',
      accessor: 'details',
      render: (row) => (
        <button
          onClick={() => setDetailModal(row)}
          className="text-xs text-sky-400 hover:text-sky-300 truncate max-w-[120px] block"
        >
          {row.details ? 'Görüntüle' : '-'}
        </button>
      ),
    },
  ]

  const filterDropdown = (
    <select
      value={actionFilter}
      onChange={(e) => setActionFilter(e.target.value)}
      className="px-3 py-2 bg-[#0f172a] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-sky-500/50"
    >
      <option value="">Tüm İşlemler</option>
      {Object.entries(ACTION_LABELS).map(([val, label]) => (
        <option key={val} value={val}>{label}</option>
      ))}
    </select>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Aktivite Logları</h1>
        <p className="text-sm text-gray-400 mt-1">Sistem aktivitelerini görüntüleyin</p>
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
        filters={filterDropdown}
        headerActions={
          <button
            onClick={handleClearOldLogs}
            disabled={cleaning}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium rounded-lg transition-colors border border-red-500/30 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {cleaning ? 'Temizleniyor...' : 'Eski Logları Temizle'}
          </button>
        }
      />

      <Modal
        isOpen={!!detailModal}
        onClose={() => setDetailModal(null)}
        title="Log Detayı"
        size="lg"
      >
        {detailModal && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block mb-1">Tarih</span>
                <span className="text-white">{formatDate(detailModal.created_at)}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Kullanıcı</span>
                <span className="text-white">{detailModal.full_name || detailModal.username || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">İşlem</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ACTION_COLORS[detailModal.action] || 'bg-gray-500/10 text-gray-400'}`}>
                  {ACTION_LABELS[detailModal.action] || detailModal.action}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Tablo / ID</span>
                <span className="text-white">{detailModal.entity_type || '-'} {detailModal.entity_id ? `#${detailModal.entity_id}` : ''}</span>
              </div>
            </div>
            {detailModal.details && (
              <div>
                <span className="text-gray-500 block mb-2">Detay (JSON)</span>
                <pre className="p-4 bg-[#0f172a] border border-white/10 rounded-lg text-xs text-gray-300 overflow-x-auto max-h-64 overflow-y-auto">
                  {formatDetails(detailModal.details)}
                </pre>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
