


---

## Refactor Backend/Frontend Architecture (27 Januari 2026)

### Target: Pindahkan Semua Kalkulasi dari Frontend ke Backend

**Alasan:**
- Frontend saat ini fetch semua data dan melakukan kalkulasi manual
- Tidak efisien: boros bandwidth, lambat jika data banyak
- Tidak scalable: semakin banyak data, semakin lambat

**Strategi:**
1. Buat endpoint summary di backend untuk setiap modul
2. Backend melakukan query + kalkulasi langsung di database
3. Frontend hanya fetch data yang sudah jadi dan tampilkan

---

### Modul yang Perlu Direfactor:

#### 1. ✅ Pemakaian Pakan (SELESAI)
**Backend:**
- ✅ Endpoint: `GET /api/pakan/pemakaian?type=daily-summary&kandangId=xxx&tanggal=yyyy-mm-dd`
- ✅ Service: `PemakaianPakanService.getDailySummary()`
- ✅ Return: `{ totalStok, totalPemakaian, totalBiaya, perJenisPakan[] }`

**Frontend:**
- ✅ Hapus fetch semua data pemakaian
- ✅ Hapus kalkulasi manual (reduce, filter, map)
- ✅ Langsung pakai data dari endpoint summary

**Hasil:** Data loading lebih cepat, bandwidth hemat, code lebih clean

---

#### 2. ✅ Pembelian Pakan (SELESAI)
**Backend:**
- ✅ Endpoint: `GET /api/pakan/pembelian?type=summary&bulan=yyyy-mm&jenisPakanId=xxx`
- ✅ Service: `PembelianPakanService.getSummary()`
- ✅ Return: `{ totalPembelian, rataRataHargaPerKg, totalStok, totalTransaksi }`

**Frontend:**
- ✅ Hapus kalkulasi manual (reduce untuk sum totalHarga, hargaPerKg, sisaStokKg)
- ✅ Langsung pakai data dari endpoint summary
- ✅ Stats card otomatis update sesuai filter

**Hasil:** Loading lebih cepat, kalkulasi akurat dari database

---

#### 3. ✅ Produktivitas Telur (SELESAI)
**Backend:**
- ✅ Endpoint: `GET /api/telur/produksi?type=summary&kandangId=xxx&bulan=yyyy-mm`
- ✅ Service: `ProduksiTelurService.getSummary()`
- ✅ Return: `{ totalBagus, totalTidakBagus, totalButir, totalKg, rataRataHarian, persentaseHenDay }`

**Frontend:**
- ✅ Hapus kalkulasi manual (reduce untuk sum telur bagus/rusak, total kg)
- ✅ Langsung pakai data dari endpoint summary
- ✅ Stats card otomatis update sesuai filter

**Hasil:** Kalkulasi persentase hen-day akurat dari backend

---

#### 4. ✅ Penjualan Telur (SELESAI)
**Backend:**
- ✅ Endpoint: `GET /api/telur/penjualan?type=summary&kandangId=xxx&bulan=yyyy-mm`
- ✅ Service: `PenjualanTelurService.getSummary()`
- ✅ Return: `{ totalPenjualan, totalBeratKg, rataRataHargaPerKg, totalTransaksi, stokTersedia }`

#### 5. ✅ Ayam Masuk (SELESAI - Backend)
**Backend:**
- ✅ Endpoint: `GET /api/ayam/masuk?type=summary&kandangId=xxx&bulan=yyyy-mm`
- ✅ Service: `AyamMasukService.getSummary()`
- ✅ Return: `{ totalMasuk, totalMasukBulanIni, rataRataPerHari, totalTransaksi }`
- ⏳ Controller & Frontend: Perlu update

#### 6. ✅ Kematian Ayam (SELESAI - Backend)
**Backend:**
- ✅ Endpoint: `GET /api/ayam/kematian?type=summary&kandangId=xxx&bulan=yyyy-mm`
- ✅ Service: `KematianAyamService.getSummary()`
- ✅ Return: `{ totalKematian, totalKematianBulanIni, persentaseKematian, rataRataPerHari }`
- ⏳ Controller & Frontend: Perlu update

---

#### 7. ⏳ Rekap Telur (PENDING)
**Endpoint:** `GET /api/telur/rekap?kandangId=xxx&bulan=yyyy-mm`
**Note:** Endpoint sudah ada, perlu optimasi query

---

### Status Keseluruhan:
- ✅ Selesai Penuh: 6/7 modul (86%) - Pemakaian Pakan, Pembelian Pakan, Produktivitas Telur, Penjualan Telur, Ayam Masuk, Kematian Ayam
- ⏳ Pending: 1/7 modul (14%) - Rekap Telur

**Total Backend Selesai: 6/7 modul (86%)**
**Total Frontend Selesai: 6/7 modul (86%)**

### Next Steps:
1. ✅ Update controller untuk Penjualan Telur, Ayam Masuk, Kematian Ayam - DONE
2. ✅ Update frontend untuk 3 modul tersebut - DONE
3. Optimasi Rekap Telur (sudah ada endpoint, perlu review)

### Catatan:
Backend dan frontend untuk 6 modul sudah selesai dengan method getSummary(). Tinggal:
- Rekap Telur: perlu review dan optimasi query untuk aggregasi data besar
- Estimasi: 1-2 jam untuk optimasi Rekap Telur
