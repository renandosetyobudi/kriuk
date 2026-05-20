# 🍟 Snack Kriuk - Bisnis Manager

Aplikasi manajemen bisnis snack dengan sistem titip jual. Berfungsi di iPhone/Android sebagai Progressive Web App (PWA).

## ✨ Fitur

- 📊 **Dashboard** — Ringkasan omset, pengeluaran, laba bersih
- 💰 **Keuangan** — Catat transaksi + grafik harian/bulanan
- 🗺️ **Rute & Toko** — Atur jadwal kunjungan per rute
- 📦 **Titip Jual** — Drop barang, tagih saat kunjungan, sistem otomatis hitung sisa & isi ulang
- 📝 **Catatan Harian** — Memo dengan fitur pin
- 🍟 **Produk** — Kelola harga & margin
- 🖨️ **Cetak Bukti** — Print bukti penitipan & pembayaran

Data tersimpan di **localStorage** browser (offline-ready).

---

## 🚀 Cara Deploy ke Vercel (Gratis)

### Langkah 1: Upload ke GitHub

1. Buat akun di [github.com](https://github.com) (kalau belum punya)
2. Klik tombol **"New Repository"** (atau buka https://github.com/new)
3. Isi:
   - **Repository name**: `snack-kriuk`
   - **Public** (centang)
   - Jangan centang "Add README" (karena sudah ada)
4. Klik **Create repository**
5. Di halaman repo kosong, klik **"uploading an existing file"**
6. **Drag & drop semua file & folder** dari folder ini (`snack-kriuk`) ke GitHub
   - ⚠️ JANGAN upload folder `node_modules` jika ada
   - Pastikan upload: `index.html`, `package.json`, `vite.config.js`, folder `src/`, folder `public/`, dan file lainnya
7. Scroll ke bawah, klik **"Commit changes"**

### Langkah 2: Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) → **Sign up dengan GitHub**
2. Klik **"Add New..."** → **"Project"**
3. Pilih repo `snack-kriuk` → klik **Import**
4. Biarkan semua setting default (Vercel auto-detect Vite)
5. Klik **Deploy**
6. Tunggu 1-2 menit ⏳
7. Selesai! Vercel kasih URL seperti `https://snack-kriuk-xyz.vercel.app`

### Langkah 3: Install ke iPhone

1. Buka URL Vercel di **Safari** (HARUS Safari, bukan Chrome)
2. Tap tombol **Share** (kotak dengan panah ke atas) di bawah
3. Scroll ke bawah → tap **"Add to Home Screen"**
4. Beri nama "Snack Kriuk" → tap **Add**
5. 🎉 Ikon muncul di home screen seperti app native!

Tap ikonnya — aplikasi terbuka **fullscreen** tanpa browser bar, persis seperti app dari App Store.

---

## 💻 Menjalankan Lokal (Opsional, butuh komputer)

Kalau mau test di komputer dulu sebelum deploy:

```bash
# Install Node.js dulu dari https://nodejs.org
npm install
npm run dev
```

Lalu buka `http://localhost:5173`

---

## 📱 Update Aplikasi

Setiap kali ada perubahan:
1. Upload file baru ke GitHub (drag & drop, replace file lama)
2. Vercel otomatis deploy ulang ~1 menit
3. Refresh aplikasi di iPhone — versi baru langsung dipakai

---

## 🆘 Bantuan

- Data hilang setelah hapus app? Iya, karena tersimpan di browser lokal. Untuk backup, akan ditambahkan fitur export/import nanti.
- Tidak muncul "Add to Home Screen"? Pastikan pakai **Safari**, bukan Chrome/Brave.
- Vercel build error? Cek file `package.json` tidak hilang saat upload ke GitHub.
