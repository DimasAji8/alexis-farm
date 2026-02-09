# Role-Based Access Control (RBAC)

Dokumentasi akses untuk setiap role di aplikasi Alexis Farm Management.

## Role yang Tersedia

1. **super_user** - Super Admin / Owner
2. **manager** - Manager / Supervisor
3. **staff** - Staff Operasional

---

## Detail Akses per Role

### 1. SUPER_USER (Super Admin)

**Akses Penuh:**
- ✅ Manajemen User (CRUD)
- ✅ Semua operasi CRUD di semua modul
- ✅ Delete semua data (termasuk yang tidak bisa dihapus role lain)

**Akses Eksklusif:**
- User management
- Delete jenis pakan
- Delete pemakaian pakan
- Delete pembelian pakan

---

### 2. MANAGER (Supervisor)

**Fokus:** Monitoring, pengelolaan keuangan, dan penjualan

**Akses Penuh (CRUD):**
- ✅ Penjualan Telur
- ✅ Keuangan (Pemasukan, Pengeluaran, Transaksi)
- ✅ Produksi Telur

**Akses Update:**
- ✅ Master Data (Kandang, Jenis Pakan)

**Akses Read-Only:**
- ✅ View semua data operasional
- ✅ Dashboard & laporan

**Tidak Bisa:**
- ❌ Manajemen User
- ❌ Delete master data
- ❌ Input operasional harian (ayam, pakan)

---

### 3. STAFF (Operator Lapangan)

**Fokus:** Input data operasional harian

**Akses Create & Update:**
- ✅ Ayam Masuk
- ✅ Kematian Ayam
- ✅ Kandang (CRUD)
- ✅ Jenis Pakan (Create & Update)
- ✅ Pembelian Pakan (Create & Update)
- ✅ Pemakaian Pakan (Create & Update)
- ✅ Produksi Telur (Create & Update)

**Akses Read-Only:**
- ✅ View data keuangan
- ✅ View penjualan telur
- ✅ Dashboard operasional

**Tidak Bisa:**
- ❌ Keuangan (Pemasukan, Pengeluaran, Transaksi)
- ❌ Penjualan Telur
- ❌ Delete jenis pakan
- ❌ Delete pemakaian pakan
- ❌ Delete pembelian pakan
- ❌ Manajemen User

---

## Ringkasan Akses per Modul

| Modul | Super User | Manager | Staff |
|-------|-----------|---------|-------|
| **User Management** | CRUD | - | - |
| **Kandang** | CRUD | CRU | CRUD |
| **Jenis Pakan** | CRUD | CRU | CR |
| **Ayam Masuk** | CRUD | R | CR |
| **Kematian Ayam** | CRUD | R | CR |
| **Pembelian Pakan** | CRUD | R | CR |
| **Pemakaian Pakan** | CRUD | R | CR |
| **Produksi Telur** | CRUD | CRUD | CR |
| **Penjualan Telur** | CRUD | **CRUD** | **R** |
| **Pemasukan** | CRUD | **CRUD** | **R** |
| **Pengeluaran** | CRUD | **CRUD** | **R** |
| **Transaksi Keuangan** | CRUD | **CRUD** | **R** |
| **Dashboard & Laporan** | Full | Full | Basic |

**Keterangan:**
- C = Create
- R = Read
- U = Update
- D = Delete
- **Bold** = Perubahan dari sistem sebelumnya

---

## Perubahan dari Sistem Sebelumnya

### Manager
- ✅ **Ditambahkan:** Akses penuh ke Penjualan Telur
- ✅ **Ditambahkan:** Akses penuh ke Keuangan (Pemasukan, Pengeluaran, Transaksi)
- ✅ **Ditambahkan:** Akses update Master Data (Kandang, Jenis Pakan)

### Staff
- ❌ **Dihapus:** Akses ke modul Keuangan (Pemasukan, Pengeluaran, Transaksi)
- ❌ **Dihapus:** Akses create/update Penjualan Telur
- ✅ **Dipertahankan:** Fokus ke operasional harian (ayam, pakan, produksi)

---

## File yang Dimodifikasi

1. `app/api/(features)/telur/penjualan/penjualan.service.ts`
2. `app/api/(features)/keuangan/pemasukan/pemasukan.service.ts`
3. `app/api/(features)/keuangan/pengeluaran/pengeluaran.service.ts`
4. `app/api/(features)/keuangan/transaksi/transaksi.service.ts`
5. `app/api/(features)/(master-data)/kandang/kandang.service.ts`
6. `app/api/(features)/(master-data)/jenis-pakan/jenis-pakan.service.ts`

---

## Testing Checklist

### Manager
- [ ] Bisa create/update/delete penjualan telur
- [ ] Bisa create/update/delete pemasukan
- [ ] Bisa create/update/delete pengeluaran
- [ ] Bisa create/update/delete transaksi keuangan
- [ ] Bisa update kandang
- [ ] Bisa update jenis pakan
- [ ] Tidak bisa delete jenis pakan
- [ ] Tidak bisa create ayam masuk/kematian

### Staff
- [ ] Tidak bisa akses menu keuangan (pemasukan, pengeluaran, transaksi)
- [ ] Tidak bisa create/update penjualan telur
- [ ] Bisa view data keuangan (read-only)
- [ ] Bisa create/update ayam masuk
- [ ] Bisa create/update kematian ayam
- [ ] Bisa create/update pembelian pakan
- [ ] Bisa create/update pemakaian pakan
- [ ] Bisa create/update produksi telur

---

**Tanggal Update:** 2026-02-09
**Versi:** 1.0
