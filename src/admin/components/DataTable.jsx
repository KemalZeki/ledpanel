import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Search, Loader2, GripVertical, Save, Check, Undo2 } from 'lucide-react'

export default function DataTable({
  columns, data, loading, search, onSearchChange,
  page, totalPages, onPageChange, actions, emptyMessage = 'Kayıt bulunamadı',
  headerActions, filters,
  sortable = false, onSortChange, onSortSave
}) {
  const [dragIdx, setDragIdx] = useState(null)
  const [overIdx, setOverIdx] = useState(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const originalOrder = useRef(null)
  const dragItem = useRef(null)
  const dragOverItem = useRef(null)

  useEffect(() => {
    if (!hasChanges && data.length > 0) {
      originalOrder.current = data.map(d => d.id)
    }
  }, [data, hasChanges])

  const handleDragStart = (e, index) => {
    dragItem.current = index
    setDragIdx(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }

  const handleDragEnter = (index) => {
    dragOverItem.current = index
    setOverIdx(index)
  }

  const handleDragEnd = () => {
    if (
      dragItem.current === null ||
      dragOverItem.current === null ||
      dragItem.current === dragOverItem.current
    ) {
      setDragIdx(null)
      setOverIdx(null)
      return
    }

    const fromIdx = dragItem.current
    const toIdx = dragOverItem.current

    dragItem.current = null
    dragOverItem.current = null
    setDragIdx(null)
    setOverIdx(null)

    if (onSortChange) {
      const reordered = [...data]
      const [moved] = reordered.splice(fromIdx, 1)
      reordered.splice(toIdx, 0, moved)
      onSortChange(reordered)
      setHasChanges(true)
      setSaved(false)
    }
  }

  const handleSave = async () => {
    if (!onSortSave) return
    setSaving(true)
    try {
      await onSortSave(data)
      setHasChanges(false)
      setSaved(true)
      originalOrder.current = data.map(d => d.id)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (!originalOrder.current || !onSortChange) return
    const restored = originalOrder.current
      .map(id => data.find(d => d.id === id))
      .filter(Boolean)
    onSortChange(restored)
    setHasChanges(false)
  }

  const totalCols = columns.length + (sortable ? 1 : 0) + (actions ? 1 : 0)

  return (
    <div className="bg-[#1e293b] border border-white/10 rounded-2xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-white/10">
        <div className="flex items-center gap-3 flex-wrap">
          {onSearchChange && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Ara..."
                value={search}
                onChange={e => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#0f172a] border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sky-500/50 w-64"
              />
            </div>
          )}
          {filters}
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 animate-pulse">
              <Check className="w-3 h-3" /> Kaydedildi
            </span>
          )}
          {hasChanges && (
            <>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <Undo2 className="w-3.5 h-3.5" /> Geri Al
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Sıralamayı Kaydet
              </button>
            </>
          )}
          {headerActions}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {sortable && <th className="px-2 py-3 w-8"></th>}
              {columns.map((col, i) => (
                <th key={i} className={`px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">İşlemler</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={totalCols} className="px-4 py-12 text-center text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />Yükleniyor...
              </td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={totalCols} className="px-4 py-12 text-center text-gray-400">
                {emptyMessage}
              </td></tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={row.id || i}
                  draggable={sortable}
                  onDragStart={sortable ? (e) => handleDragStart(e, i) : undefined}
                  onDragEnter={sortable ? () => handleDragEnter(i) : undefined}
                  onDragEnd={sortable ? handleDragEnd : undefined}
                  onDragOver={sortable ? (e) => e.preventDefault() : undefined}
                  className={`transition-all ${sortable ? 'cursor-grab active:cursor-grabbing' : ''} ${
                    dragIdx === i
                      ? 'opacity-30 scale-[0.98]'
                      : overIdx === i && dragIdx !== null && dragIdx !== i
                        ? 'bg-sky-500/5 border-l-2 border-l-sky-500'
                        : 'hover:bg-white/[0.02]'
                  }`}
                >
                  {sortable && (
                    <td className="px-2 py-3 w-8">
                      <GripVertical className="w-4 h-4 text-gray-600 mx-auto" />
                    </td>
                  )}
                  {columns.map((col, j) => (
                    <td key={j} className={`px-4 py-3 text-gray-300 ${col.className || ''}`}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
          <span className="text-xs text-gray-400">Sayfa {page} / {totalPages}</span>
          <div className="flex gap-1">
            <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
