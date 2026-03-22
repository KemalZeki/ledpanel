import { useState, useRef } from 'react'
import { apiCall } from '../../context/AuthContext'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'

export default function ImageUpload({ label, value, onChange, accept = 'image/*' }) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await apiCall('upload.php', { method: 'POST', body: formData })
      if (res.success) {
        onChange(res.data?.url || res.url || '')
      }
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleRemove = () => {
    onChange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>}

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-[#0f172a]">
          <img src={value} alt="" className="w-full h-36 object-contain bg-[#0f172a] p-2" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-7 h-7 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center h-36 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
            dragOver
              ? 'border-sky-400 bg-sky-500/10'
              : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
          }`}
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-500 mb-2" />
              <span className="text-xs text-gray-500">Dosya seçin veya sürükleyin</span>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
    </div>
  )
}
