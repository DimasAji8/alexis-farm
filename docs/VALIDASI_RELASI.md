# Validasi Relasi Data

Sistem validasi untuk mencegah penghapusan data yang memiliki relasi dengan data lain.

## Implementasi

### Utility Function
File: `lib/shared/utils/relation-validator.ts`

Berisi fungsi validasi untuk:
- `validateKandangRelations(kandangId)` - Validasi kandang yang memiliki transaksi
- `validateJenisPakanRelations(jenisPakanId)` - Validasi jenis pakan yang sudah digunakan
- `validatePembelianPakanRelations(pembelianPakanId)` - Validasi pembelian pakan yang sudah terpakai

### Entitas yang Dilindungi

#### 1. Kandang
Tidak dapat dihapus jika memiliki:
- Data ayam masuk
- Data kematian ayam
- Data pemakaian pakan
- Data produksi telur
- Data stock telur
- Data penjualan telur
- Data pengeluaran operasional

#### 2. Jenis Pakan
Tidak dapat dihapus jika memiliki:
- Data pembelian pakan
- Data pemakaian pakan

#### 3. Pembelian Pakan
Tidak dapat dihapus jika sudah digunakan dalam pemakaian pakan

## Response Error

Ketika data tidak dapat dihapus, API akan mengembalikan:
```json
{
  "success": false,
  "message": "Kandang tidak dapat dihapus karena memiliki data transaksi terkait",
  "error": "ValidationError"
}
```

Status code: 400 (Bad Request)
