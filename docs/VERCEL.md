# Vercel uzerinde yayinlama

Evet, **React (Vite) on yuzu** Vercel ile rahatca yayinlanir. Bu projede **PHP + MySQL API** ayri calistigi icin asagidaki noktalara dikkat edin.

## 1. Projeyi baglama

1. [vercel.com](https://vercel.com) hesabi acin, **Add New Project** ile bu repoyu import edin.
2. Framework: **Vite** (otomatik algilanir).
3. Build: `npm run build`, cikis klasoru: `dist` (varsayilan).

`vercel.json` icindeki **rewrites**, React Router ile `/urunler/1` gibi sayfalarin yenilenince 404 vermemesi icin gerekli.

## 2. API nerede?

Vercel **PHP ve MySQL barindirmaz** (bu projenin XAMPP API’si dogrudan burada calismaz). Secenekler:

| Secenek | Aciklama |
|--------|-----------|
| **A)** Gecici test | Sadece arayuzu test edin; veri cekmez, sayfalar **fallback** icerik gosterir. |
| **B)** API’yi baska yerde | PHP API’yi bir hosting’e (cPanel, VPS, Railway PHP vb.) koyun. |
| **C)** Tam site | Frontend Vercel, API `https://api.alanadiniz.com` gibi bir adreste. |

## 3. Ortam degiskeni (API adresi)

API’yi harici bir URL’ye tasidiginizda Vercel proje ayarlarinda:

**Settings → Environment Variables**

- Ad: `VITE_API_URL`
- Deger: `https://api-sunucunuz.com` (sonda **/** olmadan)

Kaydedin ve **yeniden deploy** edin (`VITE_*` degiskenleri build sirasinda gomulur).

Yerelde `VITE_API_URL` tanimli degilse istekler `/api/...` uzerinden gider (Vite proxy ile XAMPP’a baglanir).

## 4. CORS

Harici API kullanirken `api/config.php` icinde zaten `Access-Control-Allow-Origin: *` var; Vercel domain’inden gelen istekler calisir. Gerekirse guvenlik icin belirli origin’e daraltabilirsiniz.

## 5. Admin paneli

Admin paneli de ayni Vercel build’inde; giris ve yuklemeler icin **aynı** `VITE_API_URL` uzerinden PHP API’nin erisilebilir olmasi gerekir.

---

**Ozet:** Vercel = statik site + istege bagli `VITE_API_URL`. Tam dinamik test icin PHP API’yi internete acik bir sunucuda calistirin ve bu degiskeni ayarlayin.
