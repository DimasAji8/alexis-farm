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
    
