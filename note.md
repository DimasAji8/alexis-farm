# Summary Perubahan - 11 Januari 2026

## Fitur Kandang Switcher
- Tambah `KandangSwitcher` di sidebar untuk memilih kandang aktif
- Tambah `KandangProvider` untuk state management kandang yang dipilih
- Tambah `KandangAutoSelect` untuk auto-select kandang pertama (fix mobile)
- Tambah `KandangLoader` untuk loading animation saat pindah kandang
- Semua data (ayam, telur, dll) difilter berdasarkan kandang yang dipilih

## Perubahan API Backend
- Semua endpoint data menerima parameter `kandangId` untuk filter
- Urutan data diubah dari `desc` ke `asc` (tanggal terlama dulu)

## Perubahan Stok Telur
- Logic stok diubah ke **running total** (akumulatif)
- Setiap record = snapshot stok di akhir hari itu
- Script `scripts/recalculate-stock.ts` untuk recalculate data lama
- Tampilan: Stok Awal (dari bulan sebelumnya), Stok Saat Ini
- Tabel menampilkan kolom "Masuk" dari produktivitas
- Satuan hanya kg (butir dihapus)

## Perubahan UI Halaman
### Ayam Masuk & Kematian
- Cards: 6 Bulan Terakhir, Bulan Ini, Ayam Hidup (dari data kandang)
- Kolom kandang dihapus dari tabel (sudah jelas dari switcher)

### Produktivitas Telur
- Cards: Telur Bagus, Telur Rusak, % Bagus, Total Berat, Ayam Hidup
- Kolom kandang dihapus dari tabel

### Stok Telur
- Cards: Stok Awal, Stok Saat Ini
- Tabel: Tanggal, Masuk, Stok

### Penjualan Telur
- Kolom kandang dan harga/kg dihapus dari tabel

## Komponen Baru
- `Loader` - loading animation dengan overlay gelap/blur
- `KandangSwitcher` - dropdown pilih kandang
- `KandangLoader` - wrapper loader untuk pindah kandang
- `KandangAutoSelect` - auto-select kandang pertama
- `KandangOverview` - overview kandang di dashboard

## Fix Bugs
- Hydration error di `DataFilters` (Date mismatch server/client)
- Mobile: kandang tidak ter-select karena sidebar hidden

## Perubahan Schema Prisma
- `StockTelur` dan `PenjualanTelur` punya relasi ke `Kandang`
- Unique constraint `StockTelur`: `[kandangId, tanggal]`

## File Baru
- `app/client/components/common/kandang-switcher.tsx`
- `app/client/components/common/kandang-loader.tsx`
- `app/client/components/common/kandang-auto-select.tsx`
- `app/client/components/common/kandang-overview.tsx`
- `app/client/components/common/dashboard-header.tsx`
- `app/client/components/ui/loader.tsx`
- `app/client/components/ui/popover.tsx`
- `hooks/use-selected-kandang.tsx`
- `scripts/recalculate-stock.ts`
