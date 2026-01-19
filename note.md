# Modul Pakan (Global) - Rincian Konsep dan Pekerjaan

## Konsep Utama
- Stok pakan bersifat **global (gudang pusat)**, bukan per kandang.
- Pemakaian pakan dicatat **per kandang**.
- Stok **tidak diinput manual**. Stok dihitung dari pembelian (masuk) dan pemakaian (keluar).

## Alur Data
1) **Pembelian Pakan (Masuk / Batch)**
   - Input: tanggalBeli, jenisPakanId, jumlahKg, hargaPerKg, keterangan.
   - Sistem buat **batch** dan set:
     - totalHarga = jumlahKg * hargaPerKg
     - sisaStokKg = jumlahKg
   - Stok gudang = sum semua sisaStokKg.

2) **Pemakaian Pakan (Keluar, per kandang)**
   - Input: tanggalPakai, kandangId, jenisPakanId, jumlahKg, keterangan.
   - Sistem memilih batch **FIFO** (tanggalBeli ASC, sisaStokKg > 0).

   ### FIFO (header + detail)
   - Header = 1 transaksi user.
   - Detail = alokasi batch FIFO (bisa lebih dari 1 batch).
   - Lebih rapi untuk audit dan pelacakan sisa batch.

3) **Rekap Pakan (Bulanan)**
   - Ringkasan per jenis pakan:
     - Stok awal, masuk, keluar, stok akhir
     - Total biaya pemakaian
     - Harga rata-rata (weighted)
   - Rekap per kandang:
     - Total pemakaian per kandang
     - Biaya per kandang
     - Rata-rata pemakaian harian

---

## Rincian Backend
### A. Pembelian Pakan
- Endpoint:
  - GET /api/pakan/pembelian
  - POST /api/pakan/pembelian
  - PUT /api/pakan/pembelian/{id}
- Validasi:
  - jumlahKg > 0
  - hargaPerKg > 0
- Efek:
  - Buat batch (sisaStokKg = jumlahKg)
  - totalHarga dihitung otomatis

### B. Pemakaian Pakan (FIFO)
- Endpoint:
  - GET /api/pakan/pemakaian
  - POST /api/pakan/pemakaian
  - PUT /api/pakan/pemakaian/{id}
- Validasi:
  - jumlahKg > 0
  - stok global harus cukup
- FIFO:
  - Ambil batch paling lama (tanggalBeli ASC)
  - Alokasikan ke detail FIFO (bisa split otomatis)
- Efek:
  - Kurangi sisaStokKg batch
  - totalBiaya dihitung otomatis

### C. Rekap Pakan
- Endpoint:
  - GET /api/pakan/rekap?bulan=YYYY-MM
- Output:
  - Per jenis pakan + per kandang + (opsional) harian

### D. Keputusan DB (FIFO)
- **Wajib migrasi (header + detail)**
  - Tambah table: trx_pemakaian_pakan_header
  - Tambah table: trx_pemakaian_pakan_detail
  - Migrasi data lama ke header+detail

---

## Rincian Frontend
### A. Halaman Pembelian Pakan
- Form:
  - tanggalBeli, jenisPakan, jumlahKg, hargaPerKg, keterangan
- Tabel:
  - tanggal, jenis, jumlahKg, harga/kg, total, sisa, keterangan
- Filter:
  - bulan, jenis pakan

### B. Halaman Pemakaian Pakan
- Form (tanpa pilih batch):
  - tanggalPakai, kandang, jenisPakan, jumlahKg, keterangan
- Info tambahan:
  - tampilkan stok global tersisa
  - tampilkan harga/kg yang dipakai (auto dari FIFO)
- Tabel:
  - tanggal, kandang, jenis, jumlahKg, totalBiaya, detail batch FIFO

### C. Halaman Rekap Pakan
- KPI:
  - total masuk, keluar, stok akhir
  - rata-rata harga/kg
- Tabel rekap per jenis
- Tab rekap per kandang
- Grafik harian (opsional)

---

## Catatan Keputusan
- FIFO pemakaian **wajib** menggunakan header + detail (tanpa opsi lain).
    