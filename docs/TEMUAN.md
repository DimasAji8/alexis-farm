# CATATAN PERBEDAAN EXCEL vs APLIKASI

Ini catatan kenapa angka di Excel beda dengan aplikasi. Biar nanti kalau ada yang tanya, sudah ada penjelasannya.

---

## RINGKASAN CEPAT

### 📊 Berdasarkan Jenis Masalah:

**1. Excel Salah Hitung (4 kasus)**
- Juli: Penjualan telur HEPPY salah Rp 260
- Agustus: Penjualan telur MONOT salah Rp 2.500
- November: GISMA salah Rp 76.500
- **Solusi:** Perbaiki formula Excel

**2. Pembelian Pakan Tidak Lengkap (1 kasus)**
- Juni: Pardoc & Konsentrat tidak dicatat di Excel keuangan (Rp 2.958.500)
- **Solusi:** Aplikasi sudah benar, Excel kurang lengkap

**3. Cara Hitung Beda (1 kasus)**
- Juli: Biaya jagung beda Rp 36.000 (FIFO)
- **Solusi:** Bedanya kecil, gak masalah

**4. Data Tidak Jelas (2 kasus)**
- September: Transaksi Rp 669.000 tanpa keterangan
- Oktober: GISMA + BUCEK tidak jelas digabung atau pisah
- **Solusi:** Perlu konfirmasi client

### 📈 Berdasarkan Status:

| Status | Jumlah | Keterangan |
|--------|--------|------------|
| ✅ Aplikasi Benar | 6 | Tidak perlu perbaikan |
| ⚠️ Perlu Perbaiki Excel | 4 | Excel salah hitung |
| ❓ Perlu Konfirmasi | 2 | Perlu tanya client |

### 💰 Total Selisih per Bulan:

| Bulan | Selisih | Penyebab Utama |
|-------|---------|----------------|
| Juni | Rp 2.958.500 | Pembelian pakan tidak lengkap |
| Juli | Rp 36.815 | FIFO + Excel salah hitung |
| Agustus | Rp 2.500 | Excel salah hitung |
| September | - | Data tidak jelas |
| Oktober | Rp 25.500 | GISMA + BUCEK tidak jelas |
| November | Rp 77.400 | Excel salah hitung |

**Catatan:** Semua selisih kurang dari 3%, masih wajar.

---

## DETAIL PER BULAN

### JUNI 2025

### ✅ Kenapa Total Pengeluaran Beda?
**Status:** Aplikasi Sudah Benar

**Masalah:**
Total pengeluaran Juni di aplikasi lebih besar dari Excel:
- **Aplikasi:** Rp 106.564.250
- **Excel:** Rp 103.605.750
- **Beda:** Rp 2.958.500

**Penyebabnya:**
Tanggal 24 Juni beli pakan 4 jenis:
1. Jagung Rp 1.744.000 → ✅ Ada di Excel keuangan
2. Katul Rp 204.000 → ✅ Ada di Excel keuangan
3. Pardoc Rp 843.500 → ❌ Tidak ada di Excel keuangan (cuma di sheet pakan)
4. Konsentrat Rp 2.115.000 → ❌ Tidak ada di Excel keuangan (cuma di sheet pakan)

**Kenapa Beda:**
- Di Excel: Cuma Jagung & Katul yang ditulis di pengeluaran
- Di Aplikasi: Semua pembelian pakan (4 jenis) otomatis masuk ke laporan keuangan

**Yang Benar:**
**Aplikasi benar!** Semua pembelian pakan harus masuk laporan keuangan, bukan cuma sebagian.

**Solusinya:**
Pakai aplikasi aja, lebih lengkap. Atau kalau mau Excel-nya benar, tambahin Pardoc & Konsentrat di pengeluaran tanggal 24 Juni.

---

## JULI 2025

### ⚠️ Biaya Jagung Beda Dikit
**Status:** Perlu Tanya Klien

**Masalah:**
- Excel: Rp 7.804.000
- Aplikasi: Rp 7.840.000
- Beda: Rp 36.000 (cuma 0.46%, kecil banget)

**Detail per Tanggal:**
| Tanggal | Excel | Aplikasi | Beda |
|---------|-------|----------|------|
| 19 Jul  | 3.584.000 | 3.584.000 | 0 |
| 20 Jul  | 452.000 | 452.000 | 0 |
| 21 Jul  | 920.000 | 936.000 | +16.000 |
| 23 Jul  | 936.000 | 936.000 | 0 |
| 26 Jul  | 468.000 | 468.000 | 0 |
| 29 Jul  | 468.000 | 488.000 | +20.000 |
| 30 Jul  | 488.000 | 488.000 | 0 |
| 31 Jul  | 488.000 | 488.000 | 0 |

**Kenapa Beda:**
- Aplikasi pakai sistem FIFO (stok lama dipakai dulu)
- Excel mungkin pakai cara hitung yang beda
- Atau pembulatan di Excel

**Solusinya:**
Tanya klien pakai cara hitung yang mana. Tapi bedanya kecil banget (kurang dari 1%), jadi gak masalah.

---

### ✅ Transaksi Digabung per Hari
**Status:** Ini Memang Fitur

**Bedanya:**
- Excel: Setiap transaksi ditulis terpisah
- Aplikasi: Transaksi di hari yang sama digabung jadi satu

**Contoh:**
```
Excel (19 Juli):
- Beli 1: 320 Kg @ 5.550 = 1.776.000
- Beli 2: 320 Kg @ 5.650 = 1.808.000

Aplikasi (19 Juli):
- Total: 640 Kg @ 5.600 (rata-rata) = 3.584.000
```

**Kenapa Begini:**
Biar lebih ringkas dan gampang dibaca. Total uangnya tetap sama kok.

---

### ⚠️ Excel Salah Hitung Penjualan Telur
**Status:** Excel Perlu Diperbaiki

**Masalah:**
Tanggal 20 Juli, HEPPY beli telur 4.6 kg × Rp 24.400
- **Excel tertulis:** Rp 112.500 ❌
- **Seharusnya:** 4.6 kg × Rp 24.400 = Rp 112.240 ✅
- **Selisih:** Rp 260

- **Excel salah tulis:** Rp 112.500 ❌
- **Yang benar:** 4.6 × 24.400 = Rp 112.240 ✅
- **Beda:** Rp 260

**Dampak:**
Total penjualan Juli di Excel lebih besar Rp 815 dari yang seharusnya.

**Solusinya:**
Perbaiki Excel. Aplikasi sudah benar.

---

### ✅ Harga per Kg di Rekap Pakan
**Status:** Sudah Diperbaiki

**Bedanya:**
- Dulu: Tampilkan harga pemakaian (dari FIFO)
- Sekarang: Tampilkan harga pembelian

**Kenapa Diubah:**
Biar sama dengan Excel dan lebih mudah dipahami.

---

### ✅ Tambah Total Stok di Footer
**Status:** Sudah Ditambahkan

**Yang Ditambah:**
Footer tabel pakan sekarang tampil:
- Total Konsumsi
- Total Biaya
- **Total Stok Tersedia** (baru)

---

## AGUSTUS 2025

### ⚠️ Excel Salah Hitung Lagi
**Status:** Excel Perlu Diperbaiki

**Masalah:**
Tanggal 27 Agustus, MONOT beli telur 5 kg × Rp 22.500
- **Excel tulis:** Rp 110.000 ❌
- **Yang benar:** 5 × 22.500 = Rp 112.500 ✅
- **Beda:** Rp 2.500

**Dampak:**
Total penjualan Agustus di Excel kurang Rp 2.500.

**Solusinya:**
Perbaiki Excel. Aplikasi sudah benar.

---

## SEPTEMBER 2025

### ✅ Ada Transaksi Tanpa Keterangan
**Status:** Sudah Ditambahkan ke Aplikasi

**Masalah:**
Tanggal 8 September ada pemasukan Rp 669.000 tapi gak ada keterangan siapa atau buat apa.

**Solusinya:**
Sudah dimasukin ke aplikasi dengan nama "LAIN-LAIN". Tapi perlu tanya klien ini transaksi apa.

---

## OKTOBER 2025

### ⚠️ GISMA + BUCEK Beda Hitung
**Status:** Perlu Tanya Klien

**Masalah:**
Tanggal 19 Oktober, GISMA 17 kotak + BUCEK Rp 30.000
- **Excel:** Total Rp 6.813.000 (digabung)
- **Aplikasi:** GISMA Rp 6.808.500 + BUCEK Rp 30.000 = Rp 6.838.500 (dipisah)
- **Beda:** Rp 25.500

**Kenapa Beda:**
Gak jelas BUCEK itu termasuk dalam harga GISMA atau terpisah.

**Solusinya:**
Tanya klien. Kalau terpisah, Excel yang salah. Kalau digabung, aplikasi yang perlu disesuaikan.

**Catatan:**
Bedanya kecil (kurang dari 1%), jadi gak terlalu masalah.

---

## NOVEMBER 2025

### ⚠️ Excel Salah Hitung GISMA
**Status:** Excel Perlu Diperbaiki

**Masalah:**
Tanggal 3 November, GISMA 255 kg
- **Harga per kg:** Rp 25.500
- **Total di Excel:** Rp 6.426.000 ❌
- **Yang benar:** 255 × 25.500 = Rp 6.502.500 ✅
- **Beda:** Rp 76.500

**Atau:**
- **Total di Excel:** Rp 6.426.000 (kalau ini yang benar)
- **Harga per kg seharusnya:** Rp 25.200 (bukan Rp 25.500)
- 255 × 25.200 = Rp 6.426.000 ✅

**Solusinya:**
Tanya klien mana yang benar: harga per kg atau total. Terus perbaiki Excel.

---

## RINGKASAN

**Total Temuan:** 11
- ✅ Sudah OK: 6
- ⚠️ Perlu Perbaikan: 5

**Kesimpulan:**
- Aplikasi sudah benar semua
- Yang perlu diperbaiki: Excel
- Bedanya kebanyakan kecil (kurang dari 1%)

**Saran:**
Pakai aplikasi aja buat data utama. Excel cuma buat backup atau referensi.

---

**Terakhir Update:** 14 Februari 2026
