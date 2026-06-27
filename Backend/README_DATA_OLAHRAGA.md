# Sumber & Metodologi Data Olahraga (Nilai MET) — NutriTrack

## Sumber Resmi

Seluruh nilai MET (Metabolic Equivalent of Task) pada seeder (`seed.js`)
bersumber dari:

Ainsworth, B.E., Haskell, W.L., Herrmann, S.D., Willis, E.A., Meckes,
N., Bassett, D.R., Carlson, S.A., Crouter, S.E., Granacher, U., Sims,
S.T., Strath, S.J., Vella, C.A., & Conger, S.A. (2024). 2024 Adult
Compendium of Physical Activities: A third update of the energy costs
of human activities. Diakses dari https://pacompendium.com.

Dokumen tabel lengkap diunduh dari:
https://pacompendium.com/wp-content/uploads/2024/03/1_2024-adult-compendium_1_2024.pdf

Setiap item di `seed.js` mencantumkan field `metCode` (kode 5-digit resmi
pada Compendium, mis. `12020`) dan `metSourceDescription` (deskripsi asli
berbahasa Inggris dari dokumen) sehingga nilai MET dapat ditelusur balik
ke baris sumbernya.

## Catatan Penting: Revisi dari Draf Sebelumnya

Draf seeder olahraga sebelumnya menyertakan sitasi ke 2011 Compendium
of Physical Activities (Ainsworth dkk., 2011), namun nilai MET yang
ditulis sebenarnya adalah estimasi, bukan hasil pengambilan langsung
dari dokumen tersebut. Setelah dicek ulang terhadap tabel resmi
(2024 Adult Compendium, update terbaru dari Compendium yang sama),
ditemukan bahwa lebih dari separuh nilai pada draf lama tidak sesuai
dengan angka resmi. Tabel berikut mencatat revisinya:

| Aktivitas | Kode Resmi | MET Resmi | MET Draf Lama | Status |
|---|---|---|---|---|
| Berjalan Kaki (Santai) | 17160 | 3.5 | 2.8 | Direvisi |
| Berjalan Kaki (Cepat) | 17200 | 4.8 | 4.3 | Direvisi |
| Berlari (Jogging) | 12020 | 7.5 | 7.0 | Direvisi |
| Berlari (Cepat) | 12070 | 11.0 | 11.0 | Sesuai |
| Bersepeda (Santai) | 01010 | 4.0 | 4.0 | Sesuai |
| Bersepeda (Sedang) | 01030 | 8.0 | 8.0 | Sesuai |
| Renang (Gaya Bebas Sedang) | 18240 | 5.8 | 7.0 | Direvisi |
| Senam Aerobik | 02000 | 7.3 | 6.5 | Direvisi |
| Zumba | 02310 | 6.5 | 6.5 | Sesuai |
| Lompat Tali | 15551 | 11.8 | 10.0 | Direvisi |
| Push Up | 02022 | 3.8 | 3.8 | Sesuai |
| Sit Up / Crunch | 02024 | 2.8 | 3.8 | Direvisi |
| Angkat Beban (Ringan) | 02054 | 3.5 | 3.0 | Direvisi |
| Angkat Beban (Sedang) | 02052 | 5.0 | 5.0 | Sesuai |
| Squat | 02052 | 5.0 | 5.0 | Sesuai |
| Yoga | 02175 | 2.3 | 2.5 | Direvisi |
| Pilates | 02105 | 2.8 | 3.0 | Direvisi |
| Stretching | 02101 | 2.3 | 2.3 | Sesuai |
| Badminton | 15030 | 5.5 | 5.5 | Sesuai |
| Futsal / Sepak Bola | 15195 | 7.8 | 7.0 | Direvisi |
| Bola Basket | 15055 | 7.5 | 6.5 | Direvisi |
| Voli | 15720 | 3.0 | 4.0 | Direvisi |

## Catatan Pemilihan Variasi Aktivitas

Compendium memuat banyak variasi untuk satu jenis aktivitas (misalnya
"Jogging" punya lebih dari 10 variasi berdasarkan kecepatan). Untuk
setiap nama aktivitas generik di aplikasi (mis. "Berlari (Jogging)"),
dipilih variasi "general, self-selected pace" sebagai representasi
paling umum, kecuali jika nama aktivitas sudah menyiratkan intensitas
tertentu (mis. "Berjalan Kaki (Cepat)" -> variasi "brisk pace").

## Formula Perhitungan Kalori

Kalori Terbakar = MET x Berat Badan (kg) x Durasi (jam)

`caloriesPerHour` di seeder dihitung dengan asumsi berat badan referensi
70 kg: caloriesPerHour = MET x 70. Pada aplikasi sesungguhnya, backend
(`activity-controller.js`) menghitung ulang menggunakan berat badan
aktual pengguna, bukan nilai referensi ini.

## Cara Menambah Data Olahraga Baru

1. Unduh PDF resmi: https://pacompendium.com/wp-content/uploads/2024/03/1_2024-adult-compendium_1_2024.pdf
2. Cari aktivitas berdasarkan kategori (Major Heading): Bicycling,
   Conditioning Exercise, Running, Sports, Walking, Water Activities, dst
3. Catat kolom Activity Code dan MET Value
4. Tambahkan ke `activityTypes` array di `seed.js`, sertakan `metCode`
   dan `metSourceDescription` untuk menjaga jejak sumber

## Kalimat Acuan untuk BAB III (Metodologi)

"Nilai MET (Metabolic Equivalent of Task) yang digunakan untuk
menghitung estimasi kalori terbakar pada modul aktivitas olahraga
bersumber dari 2024 Adult Compendium of Physical Activities yang
disusun oleh Ainsworth dkk. dan dipublikasikan melalui
pacompendium.com. Setiap jenis olahraga dipetakan ke kode aktivitas
resmi pada dokumen tersebut untuk menjamin validitas nilai MET yang
digunakan dalam perhitungan."

## Daftar Pustaka

Ainsworth, B.E., Haskell, W.L., Herrmann, S.D., Willis, E.A., Meckes,
N., Bassett, D.R., Carlson, S.A., Crouter, S.E., Granacher, U., Sims,
S.T., Strath, S.J., Vella, C.A., & Conger, S.A. (2024). 2024 Adult
Compendium of Physical Activities: A third update of the energy costs
of human activities. Journal of Sport and Health Science.
https://pacompendium.com
