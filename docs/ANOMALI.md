# DAFTAR ANOMALI EXCEL vs SISTEM

## Tujuan
Dokumentasi perbedaan antara perhitungan Excel dengan sistem untuk evaluasi dan perbaikan.

---

## JUNI 2025

### 1. Perbedaan Pencatatan Pembelian Pakan
**Status:** ✅ By Design (Aplikasi Benar)

**Data:**
- Aplikasi: Rp 106.564.250
- Sheet: Rp 103.605.750
- Selisih: Rp 2.958.500 (2.78%)

**Detail Pembelian Pakan 24 Juni:**
| Jenis | Jumlah | Harga/Kg | Total | Di Sheet Keuangan |
|-------|--------|----------|-------|-------------------|
| Jagung | 320 kg | Rp 5.450 | Rp 1.744.000 | ✅ Ada |
| Katul | 60 kg | Rp 3.400 | Rp 204.000 | ✅ Ada |
| Pardoc | 100 kg | Rp 8.435 | Rp 843.500 | ❌ Tidak ada |
| Konsentrat | 250 kg | Rp 8.460 | Rp 2.115.000 | ❌ Tidak ada |
| **Total** | | | **Rp 4.906.500** | **Rp 1.948.000** |

**Penyebab:**
- Di sheet keuangan: Hanya Jagung & Katul yang dicatat sebagai pengeluaran
- Pardoc & Konsentrat hanya ada di sheet pakan terpisah, tidak masuk sheet keuangan
- Di aplikasi: Semua pembelian pakan otomatis masuk laporan keuangan

**Keputusan:**
- **Aplikasi sudah benar** - Semua pembelian pakan harus masuk laporan keuangan
- Sheet yang kurang lengkap (Pardoc & Konsentrat tidak dicatat di pengeluaran)
- Selisih Rp 2.958.500 = Pardoc (Rp 843.500) + Konsentrat (Rp 2.115.000)

**Catatan:**
- Tidak perlu perbaikan di aplikasi
- Sheet perlu update: tambahkan Pardoc & Konsentrat di pengeluaran 24 Juni

---

## JULI 2025

### 1. Selisih Total Biaya Jagung
**Status:** ⚠️ Belum Resolved

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
- Perbedaan aturan FIFO
- Stok awal harga berbeda
- Pembulatan di Excel

**Catatan:**
- Perlu konfirmasi dari klien tentang aturan FIFO yang digunakan
- Selisih relatif kecil (< 1%)

kalau---

### 2. Selisih Total Penjualan Telur
**Status:** ⚠️ Kesalahan di Excel

**Data:**
- Excel: Rp 656.235
- Aplikasi: Rp 655.420
- Selisih: Rp 815 (0.12%)

**Detail Selisih:**
| Tanggal | Transaksi | Excel (Rp) | Aplikasi (Rp) | Selisih (Rp) |
|---------|-----------|------------|---------------|--------------|
| 20 Jul  | HEPPY 4.6kg × Rp24.400 | 112.500 | 112.240 | -260 |
| Total   | | 656.235 | 655.420 | -815 |

**Kemungkinan Penyebab:**
- Pembulatan di Excel
- Kesalahan input manual
- 4.6 × 24.400 = 112.240 (bukan 112.500)

**Catatan:**
- Aplikasi sudah benar
- Excel perlu diperbaiki

---

## AGUSTUS 2025

### 1. Selisih Total Penjualan Telur
**Status:** ⚠️ Kesalahan di Excel

**Data:**
- Excel: Rp 14.368.400
- Aplikasi: Rp 14.370.900
- Selisih: Rp 2.500 (0.02%)

**Detail Selisih:**
| Tanggal | Transaksi | Excel (Rp) | Aplikasi (Rp) | Selisih (Rp) |
|---------|-----------|------------|---------------|--------------|
| 27 Agu  | MONOT 5kg × Rp22.500 | 110.000 | 112.500 | +2.500 |

**Kemungkinan Penyebab:**
- Kesalahan formula perhitungan di Excel
- 5 kg × Rp 22.500 = Rp 112.500 (bukan Rp 110.000)

**Catatan:**
- Aplikasi sudah benar
- Excel perlu diperbaiki

---

## SEPTEMBER 2025

### 1. Transaksi Tanpa Keterangan
**Status:** ⚠️ Data Tidak Lengkap di Excel

**Data:**
- Tanggal: 8 September 2025
- Deskripsi: (kosong)
- Jumlah: Rp 669.000

**Catatan:**
- Tidak ada keterangan pembeli atau jenis transaksi
- Sudah ditambahkan ke aplikasi sebagai "LAIN-LAIN"
- Perlu konfirmasi dari klien tentang transaksi ini

---

## OKTOBER 2025

### 1. Selisih Penjualan GISMA
**Status:** ⚠️ Perbedaan Perhitungan

**Data:**
- Tanggal: 19 Oktober 2025
- Transaksi: GISMA 255 kg (17 kotak + BUCEK 30rb)
- Excel: Rp 6.813.000 (total termasuk BUCEK)
- Aplikasi: Rp 6.838.500 (GISMA Rp 6.808.500 + BUCEK Rp 30.000)
- Selisih: Rp 25.500 (Aplikasi lebih besar)

**Detail:**
| Item | Excel (Rp) | Aplikasi (Rp) | Selisih (Rp) |
|------|------------|---------------|--------------|
| GISMA 255kg | (tidak terpisah) | 6.808.500 | - |
| BUCEK | (tidak terpisah) | 30.000 | - |
| Total | 6.813.000 | 6.838.500 | +25.500 |

**Kemungkinan Penyebab:**
- Harga per kg berbeda: 255kg × Rp 26.700 = Rp 6.808.500
- Atau Excel menggabungkan GISMA + BUCEK dengan pembulatan
- Perlu konfirmasi harga yang benar

**Catatan:**
- Selisih relatif kecil (0.37%)
- Perlu klarifikasi apakah BUCEK termasuk dalam total GISMA atau terpisah

---

## NOVEMBER 2025

### 1. Kesalahan Perhitungan GISMA
**Status:** ⚠️ Kesalahan di Excel

**Data:**
- Tanggal: 3 November 2025
- Transaksi: GISMA 255 kg × Rp 25.500
- Excel: Rp 6.426.000 ❌
- Aplikasi: Rp 6.502.500 ✅
- Selisih: Rp 76.500

**Kemungkinan Penyebab:**
- Kesalahan perhitungan: 255 × 25.500 = 6.502.500 (bukan 6.426.000)
- Atau harga per kg salah di Excel (seharusnya 25.200, bukan 25.500)
- 255 × 25.200 = 6.426.000

**Catatan:**
- Aplikasi sudah benar
- Excel perlu diperbaiki (harga atau total)

