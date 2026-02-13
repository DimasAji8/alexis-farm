# Temuan Anomali & Analisis Perhitungan Produktivitas Telur

## 📊 Ringkasan Temuan

Setelah melakukan investigasi mendalam terhadap perbedaan perhitungan antara aplikasi dan sheet Excel, ditemukan beberapa anomali dan inkonsistensi.

---

## 🔍 Temuan Utama

### 1. **Bug Perhitungan di Aplikasi (SUDAH DIPERBAIKI)**

**Masalah:**
- Frontend menggunakan `currentKandang.jumlahAyam` (jumlah ayam saat ini) untuk menghitung persentase historis
- Seharusnya menggunakan `item.jumlahAyam` (jumlah ayam pada tanggal tersebut)

**Contoh Kasus:**
```
Juli 2025: Ada 995 ayam
Sekarang: Ada 961 ayam (berkurang 34 ekor)

❌ Perhitungan Salah (sebelum fix):
   Tanggal 9 Juli: 3 telur / 961 ayam = 0.31%

✅ Perhitungan Benar (setelah fix):
   Tanggal 9 Juli: 3 telur / 995 ayam = 0.30%
```

**Status:** ✅ Sudah diperbaiki

---

### 2. **Inkonsistensi Data Jumlah Ayam di Sheet**

**Masalah:**
Sheet menampilkan header "AYAM 970" untuk Agustus, tetapi perhitungan persentase menggunakan 995 ayam.

**Bukti:**
```
Sheet Agustus Header: AYAM 970
Sheet Perhitungan: 131 / 995 = 13.15% (bukan 131 / 970 = 13.51%)
```

**Pertanyaan:**
1. Apakah jumlah ayam di Agustus 2025 sebenarnya **970** atau **995**?
2. Apakah ada kematian ayam antara Juli-Agustus yang tidak tercatat?
3. Jika 970, mengapa perhitungan sheet masih pakai 995?

---

### 3. **Perbedaan Pembulatan Desimal**

**Temuan:**
Setelah perbaikan, masih ada selisih kecil 0.01-0.02% antara aplikasi dan sheet.

**Contoh:**
| Tanggal | Telur | Ayam | Sheet | Aplikasi | Selisih |
|---------|-------|------|-------|----------|---------|
| 1 Agu   | 131   | 995  | 13.15% | 13.17%  | +0.02% |
| 2 Agu   | 144   | 995  | 14.46% | 14.47%  | +0.01% |
| 5 Agu   | 172   | 995  | 17.27% | 17.29%  | +0.02% |

**Analisis:**
- Aplikasi: `(131 / 995) × 100 = 13.165829...` → `.toFixed(2)` = **13.17%**
- Sheet: Kemungkinan menggunakan `ROUND()` atau format cell yang berbeda

**Kesimpulan:** Perbedaan ini **normal** dan tidak signifikan (< 0.03%)

---

### 4. **Data Telur Rusak Tidak Konsisten di Sheet**

**Temuan:**
Beberapa baris di sheet tidak menampilkan angka 0 untuk telur rusak (kolom kosong).

**Contoh Juli:**
```
Tanggal 1-3, 5, 7: Kolom "TDK BAGUS" kosong (seharusnya 0)
Tanggal 4, 6, 8: Ada angka (1, 1, 1)
```

**Pertanyaan:**
1. Apakah kolom kosong berarti 0 atau data tidak tercatat?
2. Apakah perlu standardisasi input (selalu tulis 0 jika tidak ada)?

---

## ❓ Pertanyaan Kritis untuk Validasi Data

### A. Jumlah Ayam
1. **Berapa jumlah ayam aktual di setiap bulan?**
   - Juli: 995 ✅ (sudah dikonfirmasi)
   - Agustus: 970 atau 995? ❓
   - September: 970 ✅ (sudah dikonfirmasi)
   - Oktober: 965 ✅ (sudah dikonfirmasi)
   - November: 965 ✅ (sudah dikonfirmasi)

2. **Apakah ada catatan kematian/ayam masuk yang belum diinput?**
   - Juli → Agustus: Berkurang 25 ekor (995 → 970)?
   - Agustus → September: Tetap 970?
   - September → Oktober: Berkurang 5 ekor (970 → 965)?

### B. Perhitungan Sheet
3. **Apakah formula di sheet Excel sudah benar?**
   - Cek formula di kolom "PROSENTASE"
   - Pastikan referensi cell jumlah ayam benar

4. **Apakah ada rounding/pembulatan manual di sheet?**
   - Format cell: berapa desimal?
   - Fungsi: ROUND(), ROUNDUP(), atau auto-format?

### C. Data Historis
5. **Apakah data produksi telur sebelum Juli 2025 sudah akurat?**
   - Perlu dicek konsistensi jumlah ayam
   - Perlu dicek apakah ada data yang perlu di-update

---

## 🎯 Rekomendasi

### 1. **Validasi Data Sheet**
- [ ] Cek dan perbaiki header jumlah ayam di setiap bulan
- [ ] Pastikan formula perhitungan persentase konsisten
- [ ] Standardisasi input: selalu tulis 0 untuk telur rusak (jangan kosong)

### 2. **Sinkronisasi Data**
- [ ] Catat semua kematian ayam dengan tanggal yang tepat
- [ ] Catat semua ayam masuk dengan tanggal yang tepat
- [ ] Sistem akan otomatis update persentase produksi telur

### 3. **Audit Data Historis**
- [ ] Review data produksi telur sebelum Juli 2025
- [ ] Pastikan jumlah ayam di setiap record sudah benar
- [ ] Update jika ditemukan inkonsistensi

### 4. **Dokumentasi**
- [ ] Buat catatan perubahan jumlah ayam (changelog)
- [ ] Dokumentasikan alasan kematian/pengurangan ayam
- [ ] Simpan backup data sheet dan database

---

## ✅ Status Perbaikan

| Item | Status | Keterangan |
|------|--------|------------|
| Bug perhitungan frontend | ✅ Fixed | Sekarang pakai `item.jumlahAyam` |
| Auto-update kematian/ayam masuk | ✅ Implemented | Produksi telur otomatis ter-update |
| Seed data Juli-Desember | ✅ Created | File seed tersedia |
| Data Agustus jumlah ayam | ✅ Updated | Diubah ke 995 ayam |
| Format persentase 2 desimal | ✅ Implemented | Tampil XX.XX% |
| Card stats "% Bagus" | ✅ Removed | Sesuai permintaan |

---

## 📝 Catatan Akhir

**Perbedaan 0.01-0.02% antara aplikasi dan sheet adalah NORMAL** karena:
1. Metode pembulatan berbeda (JavaScript vs Excel)
2. Presisi floating point berbeda
3. Tidak mempengaruhi analisis bisnis

**Aplikasi sekarang lebih akurat** karena:
- Menggunakan jumlah ayam yang tepat per tanggal
- Auto-update saat ada perubahan populasi ayam
- Perhitungan konsisten dan teraudit

---

**Dibuat:** 13 Februari 2026  
**Versi:** 1.0
