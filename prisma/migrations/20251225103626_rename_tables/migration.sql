/*
  Warnings:

  - You are about to drop the `AyamMasuk` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JenisPakan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Kandang` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KematianRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LaporanBulanan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PemakaianPakan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PembelianPakan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PengeluaranOperasional` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PenjualanTelur` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProduksiTelur` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StockTelur` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TransaksiKeuangan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AyamMasuk" DROP CONSTRAINT "AyamMasuk_kandangId_fkey";

-- DropForeignKey
ALTER TABLE "KematianRecord" DROP CONSTRAINT "KematianRecord_kandangId_fkey";

-- DropForeignKey
ALTER TABLE "PemakaianPakan" DROP CONSTRAINT "PemakaianPakan_jenisPakanId_fkey";

-- DropForeignKey
ALTER TABLE "PemakaianPakan" DROP CONSTRAINT "PemakaianPakan_kandangId_fkey";

-- DropForeignKey
ALTER TABLE "PemakaianPakan" DROP CONSTRAINT "PemakaianPakan_pembelianPakanId_fkey";

-- DropForeignKey
ALTER TABLE "PembelianPakan" DROP CONSTRAINT "PembelianPakan_jenisPakanId_fkey";

-- DropForeignKey
ALTER TABLE "ProduksiTelur" DROP CONSTRAINT "ProduksiTelur_kandangId_fkey";

-- DropTable
DROP TABLE "AyamMasuk";

-- DropTable
DROP TABLE "JenisPakan";

-- DropTable
DROP TABLE "Kandang";

-- DropTable
DROP TABLE "KematianRecord";

-- DropTable
DROP TABLE "LaporanBulanan";

-- DropTable
DROP TABLE "PemakaianPakan";

-- DropTable
DROP TABLE "PembelianPakan";

-- DropTable
DROP TABLE "PengeluaranOperasional";

-- DropTable
DROP TABLE "PenjualanTelur";

-- DropTable
DROP TABLE "ProduksiTelur";

-- DropTable
DROP TABLE "StockTelur";

-- DropTable
DROP TABLE "TransaksiKeuangan";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "mst_users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'staff',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mst_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mst_kandang" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "lokasi" TEXT,
    "jumlahAyam" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'aktif',
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mst_kandang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mst_jenis_pakan" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "satuan" TEXT NOT NULL DEFAULT 'KG',
    "keterangan" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mst_jenis_pakan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trx_ayam_masuk" (
    "id" TEXT NOT NULL,
    "kandangId" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "jumlahAyam" INTEGER NOT NULL,
    "umurHari" INTEGER,
    "hargaPerEkor" DOUBLE PRECISION,
    "totalHarga" DOUBLE PRECISION,
    "supplier" TEXT,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trx_ayam_masuk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trx_kematian_record" (
    "id" TEXT NOT NULL,
    "kandangId" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "jumlahMati" INTEGER NOT NULL,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trx_kematian_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trx_pembelian_pakan" (
    "id" TEXT NOT NULL,
    "jenisPakanId" TEXT NOT NULL,
    "tanggalBeli" TIMESTAMP(3) NOT NULL,
    "jumlahKg" DOUBLE PRECISION NOT NULL,
    "hargaPerKg" DOUBLE PRECISION NOT NULL,
    "totalHarga" DOUBLE PRECISION NOT NULL,
    "sisaStokKg" DOUBLE PRECISION NOT NULL,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trx_pembelian_pakan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trx_pemakaian_pakan" (
    "id" TEXT NOT NULL,
    "kandangId" TEXT NOT NULL,
    "jenisPakanId" TEXT NOT NULL,
    "pembelianPakanId" TEXT NOT NULL,
    "tanggalPakai" TIMESTAMP(3) NOT NULL,
    "jumlahKg" DOUBLE PRECISION NOT NULL,
    "hargaPerKg" DOUBLE PRECISION NOT NULL,
    "totalBiaya" DOUBLE PRECISION NOT NULL,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trx_pemakaian_pakan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trx_produksi_telur" (
    "id" TEXT NOT NULL,
    "kandangId" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "jumlahBagusButir" INTEGER NOT NULL DEFAULT 0,
    "beratBagusKg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "jumlahTidakBagusButir" INTEGER NOT NULL DEFAULT 0,
    "beratTidakBagusKg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalButir" INTEGER NOT NULL,
    "totalKg" DOUBLE PRECISION NOT NULL,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trx_produksi_telur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trx_stock_telur" (
    "id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "stockButir" INTEGER NOT NULL,
    "stockKg" DOUBLE PRECISION NOT NULL,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trx_stock_telur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trx_penjualan_telur" (
    "id" TEXT NOT NULL,
    "nomorTransaksi" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "pembeli" TEXT NOT NULL,
    "jumlahButir" INTEGER NOT NULL,
    "beratKg" DOUBLE PRECISION NOT NULL,
    "hargaPerKg" DOUBLE PRECISION NOT NULL,
    "totalHarga" DOUBLE PRECISION NOT NULL,
    "saldoAwal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "uangMasuk" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "uangKeluar" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "saldoAkhir" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "metodeBayar" TEXT,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trx_penjualan_telur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trx_transaksi_keuangan" (
    "id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "jenis" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "jumlah" DOUBLE PRECISION NOT NULL,
    "keterangan" TEXT,
    "referensiId" TEXT,
    "referensiType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trx_transaksi_keuangan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trx_pengeluaran_operasional" (
    "id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "kategori" TEXT NOT NULL,
    "jumlah" DOUBLE PRECISION NOT NULL,
    "keterangan" TEXT NOT NULL,
    "bukti" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trx_pengeluaran_operasional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trx_laporan_bulanan" (
    "id" TEXT NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "totalPemasukanTelur" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalPemasukanLain" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalPengeluaranPakan" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalPengeluaranOperasional" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalPengeluaranLain" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalPemasukan" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalPengeluaran" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "labaRugi" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trx_laporan_bulanan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mst_users_username_key" ON "mst_users"("username");

-- CreateIndex
CREATE INDEX "mst_users_username_idx" ON "mst_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "mst_kandang_kode_key" ON "mst_kandang"("kode");

-- CreateIndex
CREATE INDEX "mst_kandang_kode_idx" ON "mst_kandang"("kode");

-- CreateIndex
CREATE INDEX "mst_kandang_status_idx" ON "mst_kandang"("status");

-- CreateIndex
CREATE UNIQUE INDEX "mst_jenis_pakan_kode_key" ON "mst_jenis_pakan"("kode");

-- CreateIndex
CREATE INDEX "mst_jenis_pakan_kode_idx" ON "mst_jenis_pakan"("kode");

-- CreateIndex
CREATE INDEX "trx_ayam_masuk_kandangId_idx" ON "trx_ayam_masuk"("kandangId");

-- CreateIndex
CREATE INDEX "trx_ayam_masuk_tanggal_idx" ON "trx_ayam_masuk"("tanggal");

-- CreateIndex
CREATE INDEX "trx_kematian_record_kandangId_idx" ON "trx_kematian_record"("kandangId");

-- CreateIndex
CREATE INDEX "trx_kematian_record_tanggal_idx" ON "trx_kematian_record"("tanggal");

-- CreateIndex
CREATE INDEX "trx_pembelian_pakan_jenisPakanId_idx" ON "trx_pembelian_pakan"("jenisPakanId");

-- CreateIndex
CREATE INDEX "trx_pembelian_pakan_tanggalBeli_idx" ON "trx_pembelian_pakan"("tanggalBeli");

-- CreateIndex
CREATE INDEX "trx_pemakaian_pakan_kandangId_idx" ON "trx_pemakaian_pakan"("kandangId");

-- CreateIndex
CREATE INDEX "trx_pemakaian_pakan_jenisPakanId_idx" ON "trx_pemakaian_pakan"("jenisPakanId");

-- CreateIndex
CREATE INDEX "trx_pemakaian_pakan_tanggalPakai_idx" ON "trx_pemakaian_pakan"("tanggalPakai");

-- CreateIndex
CREATE INDEX "trx_produksi_telur_kandangId_idx" ON "trx_produksi_telur"("kandangId");

-- CreateIndex
CREATE INDEX "trx_produksi_telur_tanggal_idx" ON "trx_produksi_telur"("tanggal");

-- CreateIndex
CREATE UNIQUE INDEX "trx_produksi_telur_kandangId_tanggal_key" ON "trx_produksi_telur"("kandangId", "tanggal");

-- CreateIndex
CREATE INDEX "trx_stock_telur_tanggal_idx" ON "trx_stock_telur"("tanggal");

-- CreateIndex
CREATE UNIQUE INDEX "trx_penjualan_telur_nomorTransaksi_key" ON "trx_penjualan_telur"("nomorTransaksi");

-- CreateIndex
CREATE INDEX "trx_penjualan_telur_tanggal_idx" ON "trx_penjualan_telur"("tanggal");

-- CreateIndex
CREATE INDEX "trx_penjualan_telur_pembeli_idx" ON "trx_penjualan_telur"("pembeli");

-- CreateIndex
CREATE INDEX "trx_transaksi_keuangan_tanggal_idx" ON "trx_transaksi_keuangan"("tanggal");

-- CreateIndex
CREATE INDEX "trx_transaksi_keuangan_jenis_idx" ON "trx_transaksi_keuangan"("jenis");

-- CreateIndex
CREATE INDEX "trx_transaksi_keuangan_kategori_idx" ON "trx_transaksi_keuangan"("kategori");

-- CreateIndex
CREATE INDEX "trx_pengeluaran_operasional_tanggal_idx" ON "trx_pengeluaran_operasional"("tanggal");

-- CreateIndex
CREATE INDEX "trx_pengeluaran_operasional_kategori_idx" ON "trx_pengeluaran_operasional"("kategori");

-- CreateIndex
CREATE INDEX "trx_laporan_bulanan_tahun_bulan_idx" ON "trx_laporan_bulanan"("tahun", "bulan");

-- CreateIndex
CREATE UNIQUE INDEX "trx_laporan_bulanan_bulan_tahun_key" ON "trx_laporan_bulanan"("bulan", "tahun");

-- AddForeignKey
ALTER TABLE "trx_ayam_masuk" ADD CONSTRAINT "trx_ayam_masuk_kandangId_fkey" FOREIGN KEY ("kandangId") REFERENCES "mst_kandang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trx_kematian_record" ADD CONSTRAINT "trx_kematian_record_kandangId_fkey" FOREIGN KEY ("kandangId") REFERENCES "mst_kandang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trx_pembelian_pakan" ADD CONSTRAINT "trx_pembelian_pakan_jenisPakanId_fkey" FOREIGN KEY ("jenisPakanId") REFERENCES "mst_jenis_pakan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trx_pemakaian_pakan" ADD CONSTRAINT "trx_pemakaian_pakan_jenisPakanId_fkey" FOREIGN KEY ("jenisPakanId") REFERENCES "mst_jenis_pakan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trx_pemakaian_pakan" ADD CONSTRAINT "trx_pemakaian_pakan_kandangId_fkey" FOREIGN KEY ("kandangId") REFERENCES "mst_kandang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trx_pemakaian_pakan" ADD CONSTRAINT "trx_pemakaian_pakan_pembelianPakanId_fkey" FOREIGN KEY ("pembelianPakanId") REFERENCES "trx_pembelian_pakan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trx_produksi_telur" ADD CONSTRAINT "trx_produksi_telur_kandangId_fkey" FOREIGN KEY ("kandangId") REFERENCES "mst_kandang"("id") ON DELETE CASCADE ON UPDATE CASCADE;
