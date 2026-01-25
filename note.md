## Instruksi Detail Tambahan (yang belum diimplementasi)
Catatan: bagian ini hanya memuat kebutuhan baru. Hal yang sudah ada di code tidak ditulis ulang.

### A. Menu Pemakaian Pakan - Tambahan
1) Info stok global per jenis pakan (di form tambah)
   - Tujuan: user tahu stok tersisa sebelum input.
   - Data: total sisa stok = sum `sisaStokKg` semua batch pembelian untuk jenis pakan terpilih.
   - Trigger: update saat jenis pakan berubah dan setelah transaksi sukses.
   - UI: teks kecil di bawah select jenis pakan, contoh "Stok tersedia: 160 Kg".
   - Validasi UI: jika stok < jumlah input, tampilkan error dan disable tombol simpan.

2) Preview harga rata-rata FIFO (di form tambah)
   - Tujuan: user tahu estimasi Rp/kg untuk pemakaian yang akan disimpan.
   - Hitung simulasi FIFO tanpa menyimpan ke DB.
   - Data batch: pembelian pakan jenis terpilih dengan `sisaStokKg > 0` urut `tanggalBeli ASC`.
   - Algoritma singkat:
     - sisa = jumlahKgInput
     - totalBiayaSimulasi = 0
     - for batch: ambil = min(sisa, batch.sisaStokKg), totalBiayaSimulasi += ambil * batch.hargaPerKg, sisa -= ambil
     - hargaRata2Simulasi = totalBiayaSimulasi / jumlahKgInput
   - UI: tampilkan "Estimasi harga rata-rata: Rp X/Kg".

3) Kolom biaya per transaksi (opsional, jika ingin mendekati sheet)
   - Tambah kolom "Total Biaya (Rp)" di tabel pemakaian.
   - Nilai: `totalBiaya` dari header pemakaian.
   - Format: `Rp 1.000` (locale id-ID).
   - (Opsional) kolom "Harga rata-rata (Rp/Kg)" = totalBiaya / jumlahKg.

4) Ringkasan biaya bulanan (opsional)
   - Tambah stat "Total Biaya Bulan Terpilih" = sum totalBiaya dari data terfilter.
   - Tambah stat "Total Pemakaian Bulan Terpilih (Kg)" = sum jumlahKg dari data terfilter.

### B. Menu Rekap Pakan - Tambahan
1) Rincian stok harian per jenis pakan (mirip sheet gambar 1)
   - Filter: bulan (wajib), jenis pakan (wajib).
   - Output per tanggal:
     - Tanggal
     - Harga/Kg (pilih salah satu definisi, konsisten):
       a) Harga rata-rata konsumsi hari itu = keluarRp / keluarKg (jika keluar > 0)
       b) Atau harga rata-rata stok akhir = stokAkhirRp / stokAkhirKg (jika stokAkhirKg > 0)
     - Stok Awal (Kg)
     - Masuk (Kg, Rp)
     - Keluar (Kg, Rp)
     - Stok Akhir (Kg, Rp)
   - Rumus kuantitas:
     - stokAwalKg(hari-1) = stokAkhirKg(hari-1)
     - masukKg = total pembelian pada tanggal tsb
     - keluarKg = total pemakaian pada tanggal tsb
     - stokAkhirKg = stokAwalKg + masukKg - keluarKg
   - Rumus rupiah:
     - masukRp = sum totalHarga pembelian tanggal tsb
     - keluarRp = sum totalBiaya pemakaian tanggal tsb
     - stokAkhirRp = sum (sisaKgBatch * hargaPerKgBatch) setelah transaksi hari tsb

2) Cara hitung stokAkhirRp (wajib FIFO historical)
   - Bangun daftar batch pembelian sebelum bulan + dalam bulan (urut tanggalBeli ASC).
   - Simulasikan konsumsi FIFO dari semua pemakaian (urut tanggalPakai ASC).
   - Agar bisa tampil per hari:
     - Loop tanggal dari awal bulan sampai akhir bulan.
     - Pada tiap tanggal:
       - Tambahkan batch pembelian hari itu ke daftar batch.
       - Kurangi batch via pemakaian hari itu (FIFO).
       - Hitung stokAkhirRp = sum sisaKg * hargaPerKg.
   - Catatan: jangan pakai `sisaStokKg` yang ada di DB sebagai historical, karena nilainya adalah stok saat ini.

3) Ringkasan konsumsi ayam (mirip blok "Konsumsi Pakan Ayam" di sheet)
   - Data dasar:
     - totalKeluarBulan = summary.totalKeluar
     - totalBiayaBulan = summary.totalBiaya
     - totalAyam = sum kandang.jumlahAyam (atau input manual jika ingin akurat per periode)
     - jumlahHariBulan = total hari dalam bulan
   - Output:
     - Konsumsi/bulan (Kg) = totalKeluarBulan
     - Konsumsi/hari (Kg) = totalKeluarBulan / jumlahHariBulan
     - Konsumsi/ekor (Kg) = totalKeluarBulan / totalAyam
     - Konsumsi/ekor (Gram) = (totalKeluarBulan * 1000) / totalAyam
     - Rp konsumsi = totalBiayaBulan
     - Rp/Kg konsumsi = totalBiayaBulan / totalKeluarBulan (jika totalKeluarBulan > 0)
   - UI: tampilkan sebagai kartu ringkas di bawah summary.
   - Jika totalAyam = 0, tampilkan "-" dan jangan divide by zero.

4) Nilai stok akhir per jenis (Rp) (opsional)
   - Untuk tiap jenis pakan pada rekap per jenis:
     - stokAkhirRp = sum sisa batch (kg * hargaPerKg) pada akhir bulan (hasil simulasi FIFO).
   - Tampilkan sebagai kolom tambahan di rekap per jenis.
    


---

## Progress Pekerjaan

### 24 Januari 2026
**Backend:**
- ✅ Tambah method `getRekapHarian()` di RekapPakanService untuk tracking stok harian dengan simulasi FIFO
- ✅ Tambah controller `getRekapHarian()` untuk endpoint rekap harian
- ✅ Update route `/api/pakan/rekap` untuk support parameter `type=harian`
- ✅ Implementasi algoritma FIFO historical untuk menghitung stok akhir (Kg & Rp) per hari

**Frontend - Pemakaian Pakan:**
- ✅ Tambah fetch data pembelian untuk info stok dan preview harga
- ✅ Tambah info stok global saat pilih jenis pakan (contoh: "Stok tersedia: 189.0 Kg")
- ✅ Tambah preview harga rata-rata FIFO sebelum simpan (contoh: "Estimasi harga rata-rata: Rp 25.000/Kg")
- ✅ Hapus input kandang dari form (menggunakan kandang terpilih dari context)
- ✅ Update statistik: hapus total pemakaian, tambah rata-rata harian (Kg & gram), rata-rata per ayam (gram), rata-rata biaya harian

**Frontend - Rekap Pakan:**
- ✅ Redesign halaman rekap pakan dengan 3 tab: Bulanan, Harian, Per Kandang
- ✅ Tab Bulanan: rekap per jenis pakan (stok awal, masuk, keluar, stok akhir, biaya, harga rata-rata)
- ✅ Tab Harian: tabel rincian harian per jenis pakan seperti spreadsheet
  - Kolom: Tanggal, Harga/Kg, Stok Awal, Masuk (Kg), Keluar (Kg), Keluar (Rp), Stok Akhir (Kg), Stok Akhir (Rp)
  - Total di footer dengan rata-rata harga per Kg
- ✅ Tab Per Kandang: rekap pemakaian per kandang (total pemakaian, biaya, rata-rata harian)
- ✅ Tambah card "Konsumsi Pakan Ayam" dengan metrik:
  - Konsumsi/Bulan (Kg & Rp)
  - Konsumsi/Hari (Kg & Rp)
  - Konsumsi/Ekor (Kg & gram)
  - Rp/Kg konsumsi & Rp/ekor
- ✅ Summary cards: Total Masuk, Total Keluar, Total Biaya

**Konsep FIFO:**
- ✅ Sistem sudah menggunakan FIFO (First In First Out) untuk pemakaian pakan
- ✅ Setiap pembelian = batch baru dengan harga berbeda
- ✅ Pemakaian mengambil dari batch paling lama terlebih dahulu
- ✅ Total biaya pemakaian dihitung otomatis dari batch yang diambil (bisa campuran beberapa batch)
- ✅ Tracking stok harian dengan simulasi FIFO untuk menghitung nilai stok akhir (Rp)

**Yang Belum Diimplementasi (untuk besok):**
- ⏳ Kolom biaya per transaksi di tabel pemakaian (opsional)
- ⏳ Ringkasan biaya bulanan di stats pemakaian (opsional)
- ⏳ Nilai stok akhir (Rp) per jenis di rekap bulanan (opsional)

### 19 Januari 2026
**Backend:**
- ✅ Fix bug transaction di pemakaian service (getById dipanggil di dalam transaction)
- ✅ Update useApiList hook untuk auto-fetch data saat mount

**Frontend:**
- ✅ Update form pembelian pakan: field hargaPerKg menggunakan format currency (1000 → 1.000)
- ✅ Hapus default value 0 di semua field number (form kosong saat pertama dibuka)
- ✅ Update FormDialog shared component untuk handle empty number field
- ✅ Redesign halaman pemakaian pakan:
  - Tambah stats card (Total Pemakaian, Rata-rata Per Hari)
  - Tambah filter (Bulan, Kandang, Jenis Pakan)
  - Tambah pagination
  - Hapus kolom biaya (fokus ke data operasional)
  - Hapus detail batch dari tabel (terlalu teknis)
  - Ganti alert dengan toast notification
- ✅ Update stats pembelian pakan: stats card sekarang responsive terhadap filter aktif
- ✅ Konsistensi stats card: semua halaman dengan filter sekarang stats-nya mengikuti data yang difilter

**UI/UX Improvements:**
- Stats card di pembelian pakan: Total Pembelian Bulan Ini, Rata-rata Harga/Kg, Total Stok
- Stats card di pemakaian pakan: Total Pemakaian, Rata-rata Per Hari (keduanya responsive terhadap filter)
- Semua input currency menggunakan format ribuan (1.000, 15.000, dst)
- Placeholder yang lebih informatif di semua form number
