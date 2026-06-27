# NutriTrack — Frontend

Aplikasi monitoring kalori dan gizi harian berbasis React + Vite + Tailwind CSS.

## Struktur Folder

```
src/
├── api/
│   └── axios.js              # Axios instance + interceptor JWT
├── components/
│   ├── Navbar.jsx            # Header + dark mode toggle + logout
│   ├── MacroCard.jsx         # Kartu ringkasan gizi dengan progress bar
│   ├── CalorieSummaryBar.jsx # Bar kalori efektif (TDEE + olahraga)
│   ├── FoodLogger.jsx        # Form bulk input makanan + daftar log hari ini
│   ├── ActivityTracker.jsx   # Search olahraga + catat log + ringkasan hari ini
│   ├── WeightTrackerModule.jsx # Form berat badan + Recharts line chart
│   └── ProfileIncompleteAlert.jsx
├── hooks/
│   └── useDarkMode.js        # Hook dark mode + localStorage
├── pages/
│   ├── Login.jsx             # Halaman login
│   ├── Register.jsx          # Halaman register (2 langkah)
│   ├── Dashboard.jsx         # Halaman utama (single page dashboard)
│   └── Profile.jsx           # Edit profil + lihat hasil kalkulasi TDEE
└── App.jsx                   # Routing + auth guard
```

## Setup & Menjalankan

```bash
# 1. Install dependencies
npm install

# 2. Jalankan dev server (proxy ke backend di port 5000)
npm run dev
```

Buka http://localhost:5173

## Konfigurasi Proxy

Di `vite.config.js`, semua request `/api/*` diteruskan ke backend:
```
http://localhost:5000
```
Pastikan backend sudah berjalan sebelum membuka frontend.

## Fitur

| Halaman/Komponen   | Fitur                                                      |
|--------------------|------------------------------------------------------------|
| Login              | Login dengan JWT, redirect otomatis                        |
| Register           | 2 langkah: akun → data fisik                              |
| Dashboard          | Ringkasan TDEE, makro, input makanan, olahraga, grafik BB |
| Dark Mode          | Toggle di navbar, disimpan di localStorage                 |
| Re-fetch otomatis  | Data refresh setiap aksi POST berhasil (tanpa reload)      |
| Profile            | Edit profil + lihat hasil kalkulasi BMR & TDEE             |

## Logika Kalori Efektif

```
Kalori Efektif = TDEE + Kalori Terbakar Olahraga
Sisa Kalori    = Kalori Efektif - Kalori Dikonsumsi
```

Jika sisa kalori negatif, ditampilkan dengan warna merah sebagai peringatan.
