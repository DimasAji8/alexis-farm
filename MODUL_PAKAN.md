# Modul Pakan - Dokumentasi

## Overview
Modul pakan menggunakan sistem FIFO (First In First Out) untuk mengelola stok pakan secara global (gudang pusat) dengan pencatatan pemakaian per kandang.

## Fitur Utama

### 1. Pembelian Pakan
- Input pembelian pakan dengan batch
- Setiap pembelian mencatat: tanggal, jenis pakan, jumlah (kg), harga per kg
- Sistem otomatis menghitung total harga dan sisa stok
- Endpoint: `/api/pakan/pembelian`

### 2. Pemakaian Pakan (FIFO)
- Input pemakaian pakan per kandang
- Sistem otomatis mengalokasikan batch FIFO (batch terlama digunakan terlebih dahulu)
- Struktur header + detail untuk audit trail yang jelas
- Endpoint: `/api/pakan/pemakaian`

**Alur FIFO:**
1. User input: kandang, jenis pakan, jumlah kg, tanggal
2. Sistem cari batch dengan tanggal beli paling lama (ASC) yang masih ada stok
3. Sistem alokasikan ke detail (bisa split ke beberapa batch)
4. Sistem kurangi sisa stok batch otomatis
5. Sistem hitung total biaya berdasarkan harga batch yang digunakan

### 3. Rekap Pakan Bulanan
- Rekap per jenis pakan: stok awal, masuk, keluar, stok akhir, total biaya, harga rata-rata
- Rekap per kandang: total pemakaian, biaya, rata-rata harian
- Endpoint: `/api/pakan/rekap?bulan=YYYY-MM`

## Database Schema

### PembelianPakan (Batch)
```prisma
model PembelianPakan {
  id             String
  jenisPakanId   String
  tanggalBeli    DateTime
  jumlahKg       Float
  hargaPerKg     Float
  totalHarga     Float
  sisaStokKg     Float  // Dikurangi saat pemakaian
  keterangan     String?
  details        PemakaianPakanDetail[]
}
```

### PemakaianPakanHeader
```prisma
model PemakaianPakanHeader {
  id           String
  kandangId    String
  jenisPakanId String
  tanggalPakai DateTime
  jumlahKg     Float
  totalBiaya   Float  // Dihitung otomatis dari detail
  keterangan   String?
  details      PemakaianPakanDetail[]
}
```

### PemakaianPakanDetail (FIFO)
```prisma
model PemakaianPakanDetail {
  id               String
  headerId         String
  pembelianPakanId String  // Referensi ke batch
  jumlahKg         Float
  hargaPerKg       Float
  totalBiaya       Float
}
```

## API Endpoints

### Pembelian Pakan
- `GET /api/pakan/pembelian` - List semua pembelian
- `POST /api/pakan/pembelian` - Tambah pembelian baru
- `PUT /api/pakan/pembelian/:id` - Update pembelian
- `GET /api/pakan/pembelian/:id` - Detail pembelian

### Pemakaian Pakan
- `GET /api/pakan/pemakaian` - List semua pemakaian (dengan detail FIFO)
- `POST /api/pakan/pemakaian` - Tambah pemakaian (otomatis FIFO)
- `PUT /api/pakan/pemakaian/:id` - Update pemakaian (re-alokasi FIFO)
- `DELETE /api/pakan/pemakaian/:id` - Hapus pemakaian (kembalikan stok)
- `GET /api/pakan/pemakaian/:id` - Detail pemakaian

### Rekap Pakan
- `GET /api/pakan/rekap?bulan=YYYY-MM` - Rekap bulanan

## Frontend Pages

### 1. Pembelian Pakan (`/client/dashboard/pakan/pembelian`)
- Form input pembelian
- Tabel daftar pembelian dengan sisa stok
- Filter bulan dan jenis pakan

### 2. Pemakaian Pakan (`/client/dashboard/pakan/pemakaian`)
- Form input pemakaian (tanpa pilih batch manual)
- Info stok tersedia dan harga rata-rata
- Tabel dengan detail batch FIFO yang digunakan

### 3. Rekap Pakan (`/client/dashboard/pakan/rekap`)
- KPI: total masuk, keluar, biaya
- Tab rekap per jenis pakan
- Tab rekap per kandang

## Keunggulan Sistem FIFO

1. **Audit Trail Jelas**: Setiap pemakaian tercatat detail batch mana yang digunakan
2. **Harga Akurat**: Biaya dihitung berdasarkan harga batch yang sebenarnya digunakan
3. **Stok Real-time**: Sisa stok batch selalu update otomatis
4. **Tidak Perlu Input Manual**: User tidak perlu pilih batch, sistem otomatis FIFO
5. **Mudah Pelacakan**: Bisa trace dari pemakaian ke batch pembelian

## Catatan Penting

- Stok pakan bersifat **global** (tidak per kandang)
- Pemakaian dicatat **per kandang** untuk analisis
- FIFO **wajib** menggunakan header + detail (tidak ada opsi lain)
- Update pemakaian akan re-alokasi FIFO dari awal
- Delete pemakaian akan mengembalikan stok ke batch
