/**
 * Yerel gelistirmede bos birakilir; istekler /api uzerinden gider (Vite proxy).
 * Vercel vb. uretimde PHP API baska bir origin'de ise VITE_API_URL tanimlayin (sonda / yok).
 * Ornek: https://api.siteniz.com veya https://siteniz.com
 */
export function getApiOrigin() {
  const url = import.meta.env.VITE_API_URL
  if (url && typeof url === 'string') return url.replace(/\/$/, '')
  return ''
}

/** Public PHP API tam URL (CORS acik olmali) */
export function publicApiUrl(path) {
  const origin = getApiOrigin()
  const p = path.startsWith('/') ? path : `/${path}`
  return origin ? `${origin}${p}` : p
}

/** Admin paneli icin /api tabani */
export function getAdminApiBase() {
  const o = getApiOrigin()
  return o ? `${o}/api` : '/api'
}
