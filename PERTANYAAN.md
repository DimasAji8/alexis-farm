# PERTANYAAN UNTUK KLIEN

## Masalah: Selisih Biaya Pakan Jagung Bulan Juli 2025

Kami menemukan perbedaan perhitungan biaya pakan antara data Excel dengan sistem:

**Total Biaya Keluar Jagung Juli:**
- Menurut Excel: Rp 7.804.000
- Menurut Sistem: Rp 7.840.000
- **Selisih: Rp 36.000**

---

## Pertanyaan yang Perlu Dikonfirmasi:

### 1. Harga Stok Awal Jagung (1 Juli 2025)

Di Excel tertulis:
```
1 Juli 2025: Stok Awal 80 Kg @ Rp 5.450
```

Tapi saat pemakaian pertama (19 Juli), perhitungannya:
```
19 Juli: Keluar 320 Kg @ Rp 5.550 = Rp 1.776.000
```

**Pertanyaan:**
- Apakah harga stok awal 80 Kg benar **Rp 5.450** atau seharusnya **Rp 5.550**?
- Kalau benar Rp 5.450, kenapa pemakaian 19 Juli tidak pakai stok ini dulu?

---

### 2. Aturan Penggunaan Stok (FIFO)

Sistem menggunakan metode FIFO (First In First Out), artinya:
- Stok yang masuk lebih dulu, dipakai lebih dulu

Contoh:
- Stok awal: 80 Kg @ Rp 5.450 (1 Juli)
- Pembelian: 320 Kg @ Rp 5.550 (5 Juli)
- Pemakaian 19 Juli: 320 Kg

Dengan FIFO, seharusnya:
- Pakai 80 Kg @ Rp 5.450 = Rp 436.000
- Pakai 240 Kg @ Rp 5.550 = Rp 1.332.000
- **Total = Rp 1.768.000**

Tapi di Excel tertulis Rp 1.776.000

**Pertanyaan:**
- Apakah ada aturan khusus dalam penggunaan stok pakan?
- Atau ada stok tertentu yang tidak boleh dipakai dulu?

---

## Yang Perlu Dicek di Excel:

1. **Stok Akhir Juni** - Berapa harga per Kg untuk sisa 80 Kg Jagung?
2. **Pemakaian 19 Juli** - Dari batch mana saja 320 Kg pertama diambil?
3. **Pemakaian 21 Juli** - Biaya Rp 920.000 atau Rp 936.000?
4. **Pemakaian 29 Juli** - Biaya Rp 468.000 atau Rp 488.000?

---

## Mohon Konfirmasi:

Tolong cek kembali data Excel dan konfirmasikan:
1. Harga stok awal 80 Kg Jagung di 1 Juli 2025
2. Apakah ada aturan khusus dalam penggunaan stok pakan
3. Detail perhitungan biaya untuk tanggal 19, 21, dan 29 Juli

Terima kasih!
