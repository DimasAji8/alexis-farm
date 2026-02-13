# TEMUAN & ANOMALI EXCEL vs SISTEM

## Tujuan
Dokumentasi perbedaan antara perhitungan Excel dengan sistem untuk evaluasi dan perbaikan.

---

## JULI 2025

### ⚠️ ANOMALI 1: Selisih Total Biaya Jagung
**Status:** Perlu Konfirmasi Klien

**Data:**
- Excel: Rp 7.804.000
- Sistem: Rp 7.840.000
- Selisih: Rp 36.000 (0.46%)

**Detail Selisih per Tanggal:**
| Tanggal | Excel (Rp) | Sistem (Rp) | Selisih (Rp) |
|---------|------------|-------------|--------------|
| 19 Jul  | 3.584.000  | 3.584.000   | 0            |
| 20 Jul  | 452.000    | 452.000     | 0            |
| 21 Jul  | 920.000    | 936.000     | +16.000      |
| 23 Jul  | 936.000    | 936.000     | 0            |
| 26 Jul  | 468.000    | 468.000     | 0            |
| 29 Jul  | 468.000    | 488.000     | +20.000      |
| 30 Jul  | 488.000    | 488.000     | 0            |
| 31 Jul  | 488.000    | 488.000     | 0            |

**Kemungkinan Penyebab:**
- Perbedaan aturan FIFO antara Excel dan sistem
- Sistem pakai FIFO strict (stok lama dipakai dulu)
- Excel mungkin pakai aturan berbeda

**Action:** Tanyakan ke klien (lihat PERTANYAAN.md)

---

### ✅ TEMUAN 1: Penggabungan Transaksi per Tanggal
**Status:** By Design (Tidak Perlu Perbaikan)

**Deskripsi:**
- Excel: Menampilkan setiap transaksi terpisah
- Sistem: Menggabungkan transaksi per tanggal

**Contoh:**
```
Excel (19 Juli):
- Transaksi 1: 320 Kg @ 5.550 = 1.776.000
- Transaksi 2: 320 Kg @ 5.650 = 1.808.000

Sistem (19 Juli):
- Total: 640 Kg @ 5.600 (rata-rata) = 3.584.000
```

**Keputusan:**
- Tetap pakai penggabungan per tanggal
- Lebih ringkas dan mudah dibaca
- Total tetap akurat

---

### ✅ TEMUAN 2: Kolom Harga per Kg di Rekap
**Status:** Sudah Diperbaiki

**Deskripsi:**
- Awalnya: Menampilkan harga pemakaian (dari FIFO)
- Sekarang: Prioritas harga pembelian

**Solusi:**
- Kalau ada pembelian → tampilkan harga beli per Kg
- Kalau hanya pemakaian → tampilkan harga pakai per Kg
- Lebih sesuai dengan Excel

---

### ✅ TEMUAN 3: Total Stok Tersedia di Footer
**Status:** Sudah Ditambahkan

**Deskripsi:**
- Footer tabel "Rincian Konsumsi per Jenis Pakan" sekarang menampilkan:
  - Total Konsumsi
  - Total Biaya
  - **Total Stok Tersedia** (baru)

---

## JUNI 2025

### ⚠️ ANOMALI 2: Data Tidak Lengkap
**Status:** Perlu Input Ulang

**Deskripsi:**
- Hanya ada data Jagung (1 transaksi)
- Katul, Pardoc, Konsentrat belum ada data

**Impact:**
- Stok awal Juli untuk Katul, Pardoc, Konsentrat = 0
- Seharusnya ada stok carry-over

**Action:**
- Perlu seed lengkap Juni untuk semua jenis pakan
- Atau konfirmasi ke klien apakah memang tidak ada data

---

## TEMPLATE UNTUK BULAN BERIKUTNYA

### ⚠️/✅ [Nama Temuan]
**Status:** [Perlu Konfirmasi / Sudah Diperbaiki / By Design]

**Data:**
- Excel: [nilai]
- Sistem: [nilai]
- Selisih: [nilai]

**Deskripsi:**
[penjelasan detail]

**Kemungkinan Penyebab:**
- [penyebab 1]
- [penyebab 2]

**Action:**
[apa yang perlu dilakukan]

---

## SUMMARY

| Bulan | Total Temuan | Anomali | Resolved | Pending |
|-------|--------------|---------|----------|---------|
| Juni  | 1            | 1       | 0        | 1       |
| Juli  | 4            | 1       | 3        | 1       |
| **TOTAL** | **5**    | **2**   | **3**    | **2**   |

**Legend:**
- ⚠️ Anomali = Perbedaan yang perlu konfirmasi/perbaikan
- ✅ Temuan = Perbedaan yang sudah dijelaskan/diperbaiki

---

## CATATAN PENTING

1. **Toleransi Selisih:** < 1% dianggap acceptable (karena pembulatan)
2. **Prioritas:** Fokus ke anomali yang selisihnya > 5%
3. **Dokumentasi:** Setiap temuan harus dicatat dengan detail
4. **Review:** Evaluasi setelah semua bulan di-input

---

**Last Updated:** 12 Februari 2026
