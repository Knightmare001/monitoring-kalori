# Sumber & Metodologi Data Makanan — NutriTrack

## Sumber Resmi

Seluruh data komposisi gizi makanan pada seeder (`seed.js`) bersumber dari:

> Kementerian Kesehatan RI. (2018). *Tabel Komposisi Pangan Indonesia 2017*.
> Direktorat Gizi Masyarakat, Direktorat Jenderal Kesehatan Masyarakat,
> Kementerian Kesehatan Republik Indonesia. ISBN 978-602-416-407-2.

Setiap item di `seed.js` mencantumkan field `tkpiCode` (kode resmi pada
tabel, misal `AP001`) dan `tkpiName` (nama baku sesuai dokumen) sehingga
nilai gizi yang digunakan dapat ditelusur kembali ke halaman sumbernya.

Semua nilai energi, protein, lemak, dan karbohidrat tercatat **per 100
gram BDD (Berat Dapat Dimakan)**, sesuai sistematika penulisan TKPI 2017
(Tabel 3, halaman 3 dokumen).

## Verifikasi Tambahan

Satu nilai (Pepaya, segar — kode ER073) menunjukkan anomali pada PDF
TKPI 2017 (lemak tercatat 12.0g, jumlah yang tidak wajar untuk buah).
Nilai ini disilangkan dengan portal **nilaigizi.com** (yang juga
menampilkan data bersumber TKPI) dan dikoreksi menjadi 0.1g lemak,
sesuai nilai yang konsisten di kedua sumber untuk komponen energi,
protein, dan karbohidratnya.

## Item yang Diganti (Tidak Tercatat di TKPI)

TKPI hanya mencatat bahan pangan tunggal atau olahan dengan metode
standar. Beberapa makanan populer yang **tidak tercantum sebagai item
resmi** karena merupakan hidangan komposit/rumahan non-standar telah
diganti dengan bahan pangan terdekat yang memang tercatat resmi:

| Item Lama (tidak ada di TKPI) | Diganti Menjadi | Alasan |
|---|---|---|
| Nasi Goreng (versi rumahan) | (dihapus) | Hanya tercatat sebagai entri "Buatan Sendiri" di portal pihak ketiga, bukan TKPI resmi |
| Singkong Rebus | Ubi Jalar Manis Segar | TKPI tidak punya entri "singkong rebus" tunggal |
| Brokoli Rebus | Wortel Rebus / Kacang Panjang Segar | Brokoli bukan sayuran yang dicatat TKPI (bukan sayuran tradisional Indonesia) |
| Sayur Sop | (dihapus) | Hidangan komposit, tidak distandarkan |
| Teh Manis | (dihapus) | Minuman olahan rumahan, tidak ada di TKPI |
| Kopi Susu | (dihapus) | Sama seperti di atas |
| Gorengan (generik) | Bakwan Goreng | TKPI mencatat "Bakwan" sebagai item spesifik |
| Mie Goreng | Bihun Goreng Instan | TKPI tidak punya "mie goreng" tapi punya "bihun goreng instan" |
| Bakso | (dihapus) | Hidangan komposit kompleks, tidak distandarkan TKPI |
| Ikan Lele | Ikan Mujahir Goreng / Ikan Tongkol Segar | TKPI tidak mencatat "ikan lele" secara spesifik; mujahir adalah ikan air tawar dengan profil gizi serupa |
| Telur Rebus | (digabung ke Telur Ayam Ras Segar) | TKPI hanya mencatat telur "segar/mentah" dan "dadar/goreng"; secara komposisi gizi, merebus tidak mengubah nilai gizi makro secara signifikan dibanding mentah |

## Cara Menambah Data Baru

Jika ingin menambah item makanan lain dari TKPI:

1. Unduh PDF resmi: https://repository.kemkes.go.id/book/668
2. Cari nama bahan pangan di tabel (terorganisir per kelompok: Serealia,
   Umbi, Kacang-kacangan, Sayuran, Buah, Daging, Ikan, Telur, Susu, dst)
3. Catat kolom: Energi (Kal), Protein (g), Lemak (g),
   Karbohidrat/KH (g) — semua per 100g BDD
4. Tambahkan ke `foods` array di `seed.js` dengan format yang sama,
   sertakan `tkpiCode` dan `tkpiName` untuk menjaga jejak sumber

## Kalimat Acuan untuk BAB III (Metodologi)

"Data komposisi gizi bahan makanan yang digunakan dalam sistem
bersumber dari Tabel Komposisi Pangan Indonesia (TKPI) 2017 yang
diterbitkan oleh Direktorat Gizi Masyarakat, Kementerian Kesehatan
Republik Indonesia. Setiap bahan makanan diambil nilai energi,
protein, lemak, dan karbohidratnya per 100 gram Berat Dapat Dimakan
(BDD), kemudian dimasukkan ke dalam basis data MongoDB melalui proses
seeding. Beberapa hidangan komposit yang tidak tercatat sebagai item
tunggal pada TKPI digantikan dengan bahan pangan terdekat yang
tercatat resmi, demi menjaga validitas data gizi yang ditampilkan."

## Daftar Pustaka

Kementerian Kesehatan RI. (2018). Tabel Komposisi Pangan Indonesia
2017. Jakarta: Direktorat Gizi Masyarakat, Direktorat Jenderal
Kesehatan Masyarakat, Kementerian Kesehatan RI.

Ainsworth, B.E., Haskell, W.L., Herrmann, S.D., Meckes, N., Bassett,
D.R., Tudor-Locke, C., Greer, J.L., Vezina, J., Whitt-Glover, M.C., &
Leon, A.S. (2011). 2011 Compendium of Physical Activities: A Second
Update of Codes and MET Values. Medicine & Science in Sports &
Exercise, 43(8), 1575-1581.
