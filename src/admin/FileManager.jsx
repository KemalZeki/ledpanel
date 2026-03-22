import { useState, useEffect, useCallback } from 'react'
import { apiCall } from '../context/AuthContext'
import { File, Trash2, Copy, Loader2, Upload } from 'lucide-react'

const IMAGE_EXT = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp']

function isImage(filename) {
  const ext = filename.split('.').pop()?.toLowerCase()
  return ext ? IMAGE_EXT.includes(ext) : false
}

function formatSize(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function FileManager() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  const fetchFiles = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiCall(`files.php?search=${encodeURIComponent(search)}`)
      if (res.success) {
        setFiles(res.data || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  const uploadFile = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    setUploadProgress({ name: file.name, status: 'uploading' })
    try {
      const res = await apiCall('upload.php', { method: 'POST', body: formData })
      if (res.success) {
        setUploadProgress({ name: file.name, status: 'done' })
        fetchFiles()
      } else {
        setUploadProgress({ name: file.name, status: 'error' })
      }
    } catch (err) {
      console.error(err)
      setUploadProgress({ name: file.name, status: 'error' })
    } finally {
      setTimeout(() => setUploadProgress(null), 2000)
    }
  }

  const handleFiles = (fileList) => {
    if (!fileList?.length) return
    setUploading(true)
    const promises = Array.from(fileList).map(f => uploadFile(f))
    Promise.all(promises).finally(() => setUploading(false))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleDelete = async (filename) => {
    if (!confirm(`"${filename}" dosyasını silmek istediğinize emin misiniz?`)) return
    try {
      const res = await apiCall(`files.php?file=${encodeURIComponent(filename)}`, { method: 'DELETE' })
      if (res.success) fetchFiles()
    } catch (err) {
      console.error(err)
    }
  }

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url)
    // Basit feedback - isteğe bağlı toast eklenebilir
  }

  const getFileUrl = (file) => {
    // API'den gelen url veya varsayılan path
    return file.url || `/uploads/${file.name}`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dosya Yöneticisi</h1>
        <p className="text-sm text-gray-400 mt-1">Dosyaları yükleyin ve yönetin</p>
      </div>

      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragOver ? 'border-sky-500 bg-sky-500/5' : 'border-white/10 hover:border-white/20'
        }`}
      >
        <input
          type="file"
          multiple
          onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
          <Upload className="w-10 h-10 text-gray-400" />
          <span className="text-sm text-gray-400">
            Dosya yüklemek için tıklayın veya sürükleyip bırakın
          </span>
        </label>
        {uploadProgress && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm">
            {uploadProgress.status === 'uploading' && <Loader2 className="w-4 h-4 animate-spin text-sky-400" />}
            <span className={uploadProgress.status === 'error' ? 'text-red-400' : 'text-gray-400'}>
              {uploadProgress.status === 'uploading' && `${uploadProgress.name} yükleniyor...`}
              {uploadProgress.status === 'done' && `${uploadProgress.name} yüklendi`}
              {uploadProgress.status === 'error' && `${uploadProgress.name} yüklenemedi`}
            </span>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <input
          type="text"
          placeholder="Dosya ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-4 pr-4 py-2 bg-[#1e293b] border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sky-500/50"
        />
      </div>

      {/* File Grid */}
      <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
          </div>
        ) : files.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">Dosya bulunamadı</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {files.map((file) => {
              const url = getFileUrl(file)
              const imgFile = isImage(file.name)
              return (
                <div
                  key={file.name}
                  className="bg-[#0f172a] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors group"
                >
                  <div className="aspect-square bg-[#1e293b] flex items-center justify-center relative overflow-hidden">
                    {imgFile ? (
                      <>
                        <img
                          src={url}
                          alt={file.name}
                          className="w-full h-full object-cover relative z-10 bg-[#1e293b]"
                          onError={(e) => { e.target.onerror = null; e.target.classList.add('hidden') }}
                        />
                        <File className="w-12 h-12 text-gray-500 absolute" />
                      </>
                    ) : (
                      <File className="w-12 h-12 text-gray-500" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatSize(file.size)}</p>
                    {file.modified_at && (
                      <p className="text-[10px] text-gray-600 mt-0.5">
                        {new Date(file.modified_at).toLocaleDateString('tr-TR')}
                      </p>
                    )}
                    <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => copyUrl(url)}
                        className="flex-1 p-1.5 rounded-lg bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 text-xs flex items-center justify-center gap-1"
                        title="URL Kopyala"
                      >
                        <Copy className="w-3 h-3" /> Kopyala
                      </button>
                      <button
                        onClick={() => handleDelete(file.name)}
                        className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        title="Sil"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
