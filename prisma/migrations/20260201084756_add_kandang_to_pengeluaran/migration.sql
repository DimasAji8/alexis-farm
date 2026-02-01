/*
  Warnings:

  - The primary key for the `mst_jenis_pakan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `mst_jenis_pakan` table. All the data in the column will be lost.
  - The primary key for the `mst_kandang` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `mst_kandang` table. All the data in the column will be lost.
  - The primary key for the `mst_users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `mst_users` table. All the data in the column will be lost.
  - The primary key for the `trx_ayam_masuk` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hargaPerEkor` on the `trx_ayam_masuk` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `trx_ayam_masuk` table. All the data in the column will be lost.
  - You are about to drop the column `kandangId` on the `trx_ayam_masuk` table. All the data in the column will be lost.
  - You are about to drop the column `keterangan` on the `trx_ayam_masuk` table. All the data in the column will be lost.
  - You are about to drop the column `supplier` on the `trx_ayam_masuk` table. All the data in the column will be lost.
  - You are about to drop the column `totalHarga` on the `trx_ayam_masuk` table. All the data in the column will be lost.
  - You are about to drop the column `umurHari` on the `trx_ayam_masuk` table. All the data in the column will be lost.
  - The primary key for the `trx_laporan_bulanan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `trx_laporan_bulanan` table. All the data in the column will be lost.
  - The primary key for the `trx_pembelian_pakan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `trx_pembelian_pakan` table. All the data in the column will be lost.
  - You are about to drop the column `jenisPakanId` on the `trx_pembelian_pakan` table. All the data in the column will be lost.
  - The primary key for the `trx_pengeluaran_operasional` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `trx_pengeluaran_operasional` table. All the data in the column will be lost.
  - The primary key for the `trx_penjualan_telur` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `trx_penjualan_telur` table. All the data in the column will be lost.
  - The primary key for the `trx_produksi_telur` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `beratBagusKg` on the `trx_produksi_telur` table. All the data in the column will be lost.
  - You are about to drop the column `beratTidakBagusKg` on the `trx_produksi_telur` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `trx_produksi_telur` table. All the data in the column will be lost.
  - You are about to drop the column `kandangId` on the `trx_produksi_telur` table. All the data in the column will be lost.
  - The primary key for the `trx_stock_telur` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `trx_stock_telur` table. All the data in the column will be lost.
  - The primary key for the `trx_transaksi_keuangan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `trx_transaksi_keuangan` table. All the data in the column will be lost.
  - You are about to drop the `trx_kematian_record` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `trx_pemakaian_pakan` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id_mst_kandang,tanggal]` on the table `trx_produksi_telur` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_mst_kandang,tanggal]` on the table `trx_stock_telur` will be added. If there are existing duplicate values, this will fail.
  - The required column `id_mst_jenis_pakan` was added to the `mst_jenis_pakan` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id_mst_kandang` was added to the `mst_kandang` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id_mst_users` was added to the `mst_users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `id_mst_kandang` to the `trx_ayam_masuk` table without a default value. This is not possible if the table is not empty.
  - The required column `id_trx_ayam_masuk` was added to the `trx_ayam_masuk` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id_trx_laporan_bulanan` was added to the `trx_laporan_bulanan` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `id_mst_jenis_pakan` to the `trx_pembelian_pakan` table without a default value. This is not possible if the table is not empty.
  - The required column `id_trx_pembelian_pakan` was added to the `trx_pembelian_pakan` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id_trx_pengeluaran_operasional` was added to the `trx_pengeluaran_operasional` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `id_mst_kandang` to the `trx_penjualan_telur` table without a default value. This is not possible if the table is not empty.
  - The required column `id_trx_penjualan_telur` was added to the `trx_penjualan_telur` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `id_mst_kandang` to the `trx_produksi_telur` table without a default value. This is not possible if the table is not empty.
  - The required column `id_trx_produksi_telur` was added to the `trx_produksi_telur` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `id_mst_kandang` to the `trx_stock_telur` table without a default value. This is not possible if the table is not empty.
  - The required column `id_trx_stock_telur` was added to the `trx_stock_telur` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id_trx_transaksi_keuangan` was added to the `trx_transaksi_keuangan` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "trx_ayam_masuk" DROP CONSTRAINT "trx_ayam_masuk_kandangId_fkey";

-- DropForeignKey
ALTER TABLE "trx_kematian_record" DROP CONSTRAINT "trx_kematian_record_kandangId_fkey";

-- DropForeignKey
ALTER TABLE "trx_pemakaian_pakan" DROP CONSTRAINT "trx_pemakaian_pakan_jenisPakanId_fkey";

-- DropForeignKey
ALTER TABLE "trx_pemakaian_pakan" DROP CONSTRAINT "trx_pemakaian_pakan_kandangId_fkey";

-- DropForeignKey
ALTER TABLE "trx_pemakaian_pakan" DROP CONSTRAINT "trx_pemakaian_pakan_pembelianPakanId_fkey";

-- DropForeignKey
ALTER TABLE "trx_pembelian_pakan" DROP CONSTRAINT "trx_pembelian_pakan_jenisPakanId_fkey";

-- DropForeignKey
ALTER TABLE "trx_produksi_telur" DROP CONSTRAINT "trx_produksi_telur_kandangId_fkey";

-- DropIndex
DROP INDEX "trx_ayam_masuk_kandangId_idx";

-- DropIndex
DROP INDEX "trx_pembelian_pakan_jenisPakanId_idx";

-- DropIndex
DROP INDEX "trx_produksi_telur_kandangId_idx";

-- DropIndex
DROP INDEX "trx_produksi_telur_kandangId_tanggal_key";

-- AlterTable
ALTER TABLE "mst_jenis_pakan" DROP CONSTRAINT "mst_jenis_pakan_pkey",
DROP COLUMN "id",
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "id_mst_jenis_pakan" TEXT NOT NULL,
ADD COLUMN     "updated_by" TEXT,
ADD CONSTRAINT "mst_jenis_pakan_pkey" PRIMARY KEY ("id_mst_jenis_pakan");

-- AlterTable
ALTER TABLE "mst_kandang" DROP CONSTRAINT "mst_kandang_pkey",
DROP COLUMN "id",
ADD COLUMN     "id_mst_kandang" TEXT NOT NULL,
ADD CONSTRAINT "mst_kandang_pkey" PRIMARY KEY ("id_mst_kandang");

-- AlterTable
ALTER TABLE "mst_users" DROP CONSTRAINT "mst_users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id_mst_users" TEXT NOT NULL,
ADD CONSTRAINT "mst_users_pkey" PRIMARY KEY ("id_mst_users");

-- AlterTable
ALTER TABLE "trx_ayam_masuk" DROP CONSTRAINT "trx_ayam_masuk_pkey",
DROP COLUMN "hargaPerEkor",
DROP COLUMN "id",
DROP COLUMN "kandangId",
DROP COLUMN "keterangan",
DROP COLUMN "supplier",
DROP COLUMN "totalHarga",
DROP COLUMN "umurHari",
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "id_mst_kandang" TEXT NOT NULL,
ADD COLUMN     "id_trx_ayam_masuk" TEXT NOT NULL,
ADD COLUMN     "updated_by" TEXT,
ADD CONSTRAINT "trx_ayam_masuk_pkey" PRIMARY KEY ("id_trx_ayam_masuk");

-- AlterTable
ALTER TABLE "trx_laporan_bulanan" DROP CONSTRAINT "trx_laporan_bulanan_pkey",
DROP COLUMN "id",
ADD COLUMN     "id_trx_laporan_bulanan" TEXT NOT NULL,
ADD CONSTRAINT "trx_laporan_bulanan_pkey" PRIMARY KEY ("id_trx_laporan_bulanan");

-- AlterTable
ALTER TABLE "trx_pembelian_pakan" DROP CONSTRAINT "trx_pembelian_pakan_pkey",
DROP COLUMN "id",
DROP COLUMN "jenisPakanId",
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "id_mst_jenis_pakan" TEXT NOT NULL,
ADD COLUMN     "id_trx_pembelian_pakan" TEXT NOT NULL,
ADD COLUMN     "updated_by" TEXT,
ADD CONSTRAINT "trx_pembelian_pakan_pkey" PRIMARY KEY ("id_trx_pembelian_pakan");

-- AlterTable
ALTER TABLE "trx_pengeluaran_operasional" DROP CONSTRAINT "trx_pengeluaran_operasional_pkey",
DROP COLUMN "id",
ADD COLUMN     "id_mst_kandang" TEXT,
ADD COLUMN     "id_trx_pengeluaran_operasional" TEXT NOT NULL,
ADD CONSTRAINT "trx_pengeluaran_operasional_pkey" PRIMARY KEY ("id_trx_pengeluaran_operasional");

-- AlterTable
ALTER TABLE "trx_penjualan_telur" DROP CONSTRAINT "trx_penjualan_telur_pkey",
DROP COLUMN "id",
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "id_mst_kandang" TEXT NOT NULL,
ADD COLUMN     "id_trx_penjualan_telur" TEXT NOT NULL,
ADD COLUMN     "updated_by" TEXT,
ADD CONSTRAINT "trx_penjualan_telur_pkey" PRIMARY KEY ("id_trx_penjualan_telur");

-- AlterTable
ALTER TABLE "trx_produksi_telur" DROP CONSTRAINT "trx_produksi_telur_pkey",
DROP COLUMN "beratBagusKg",
DROP COLUMN "beratTidakBagusKg",
DROP COLUMN "id",
DROP COLUMN "kandangId",
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "id_mst_kandang" TEXT NOT NULL,
ADD COLUMN     "id_trx_produksi_telur" TEXT NOT NULL,
ADD COLUMN     "updated_by" TEXT,
ADD CONSTRAINT "trx_produksi_telur_pkey" PRIMARY KEY ("id_trx_produksi_telur");

-- AlterTable
ALTER TABLE "trx_stock_telur" DROP CONSTRAINT "trx_stock_telur_pkey",
DROP COLUMN "id",
ADD COLUMN     "id_mst_kandang" TEXT NOT NULL,
ADD COLUMN     "id_trx_stock_telur" TEXT NOT NULL,
ADD CONSTRAINT "trx_stock_telur_pkey" PRIMARY KEY ("id_trx_stock_telur");

-- AlterTable
ALTER TABLE "trx_transaksi_keuangan" DROP CONSTRAINT "trx_transaksi_keuangan_pkey",
DROP COLUMN "id",
ADD COLUMN     "id_trx_transaksi_keuangan" TEXT NOT NULL,
ADD CONSTRAINT "trx_transaksi_keuangan_pkey" PRIMARY KEY ("id_trx_transaksi_keuangan");

-- DropTable
DROP TABLE "trx_kematian_record";

-- DropTable
DROP TABLE "trx_pemakaian_pakan";

-- CreateTable
CREATE TABLE "trx_kematian_ayam" (
    "id_trx_kematian_ayam" TEXT NOT NULL,
    "id_mst_kandang" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "jumlahMati" INTEGER NOT NULL,
    "keterangan" TEXT,
    "created_by" TEXT,
    "updated_by" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trx_kematian_ayam_pkey" PRIMARY KEY ("id_trx_kematian_ayam")
);

-- CreateTable
CREATE TABLE "trx_pemakaian_pakan_header" (
    "id_trx_pemakaian_pakan_header" TEXT NOT NULL,
    "id_mst_kandang" TEXT NOT NULL,
    "id_mst_jenis_pakan" TEXT NOT NULL,
    "tanggalPakai" TIMESTAMP(3) NOT NULL,
    "jumlahKg" DOUBLE PRECISION NOT NULL,
    "totalBiaya" DOUBLE PRECISION NOT NULL,
    "keterangan" TEXT,
    "created_by" TEXT,
    "updated_by" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trx_pemakaian_pakan_header_pkey" PRIMARY KEY ("id_trx_pemakaian_pakan_header")
);

-- CreateTable
CREATE TABLE "trx_pemakaian_pakan_detail" (
    "id_trx_pemakaian_pakan_detail" TEXT NOT NULL,
    "id_trx_pemakaian_pakan_header" TEXT NOT NULL,
    "id_trx_pembelian_pakan" TEXT NOT NULL,
    "jumlahKg" DOUBLE PRECISION NOT NULL,
    "hargaPerKg" DOUBLE PRECISION NOT NULL,
    "totalBiaya" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trx_pemakaian_pakan_detail_pkey" PRIMARY KEY ("id_trx_pemakaian_pakan_detail")
);

-- CreateIndex
CREATE INDEX "trx_kematian_ayam_id_mst_kandang_idx" ON "trx_kematian_ayam"("id_mst_kandang");

-- CreateIndex
CREATE INDEX "trx_kematian_ayam_tanggal_idx" ON "trx_kematian_ayam"("tanggal");

-- CreateIndex
CREATE INDEX "trx_pemakaian_pakan_header_id_mst_kandang_idx" ON "trx_pemakaian_pakan_header"("id_mst_kandang");

-- CreateIndex
CREATE INDEX "trx_pemakaian_pakan_header_id_mst_jenis_pakan_idx" ON "trx_pemakaian_pakan_header"("id_mst_jenis_pakan");

-- CreateIndex
CREATE INDEX "trx_pemakaian_pakan_header_tanggalPakai_idx" ON "trx_pemakaian_pakan_header"("tanggalPakai");

-- CreateIndex
CREATE INDEX "trx_pemakaian_pakan_detail_id_trx_pemakaian_pakan_header_idx" ON "trx_pemakaian_pakan_detail"("id_trx_pemakaian_pakan_header");

-- CreateIndex
CREATE INDEX "trx_pemakaian_pakan_detail_id_trx_pembelian_pakan_idx" ON "trx_pemakaian_pakan_detail"("id_trx_pembelian_pakan");

-- CreateIndex
CREATE INDEX "trx_ayam_masuk_id_mst_kandang_idx" ON "trx_ayam_masuk"("id_mst_kandang");

-- CreateIndex
CREATE INDEX "trx_pembelian_pakan_id_mst_jenis_pakan_idx" ON "trx_pembelian_pakan"("id_mst_jenis_pakan");

-- CreateIndex
CREATE INDEX "trx_pengeluaran_operasional_id_mst_kandang_idx" ON "trx_pengeluaran_operasional"("id_mst_kandang");

-- CreateIndex
CREATE INDEX "trx_penjualan_telur_id_mst_kandang_idx" ON "trx_penjualan_telur"("id_mst_kandang");

-- CreateIndex
CREATE INDEX "trx_produksi_telur_id_mst_kandang_idx" ON "trx_produksi_telur"("id_mst_kandang");

-- CreateIndex
CREATE UNIQUE INDEX "trx_produksi_telur_id_mst_kandang_tanggal_key" ON "trx_produksi_telur"("id_mst_kandang", "tanggal");

-- CreateIndex
CREATE INDEX "trx_stock_telur_id_mst_kandang_idx" ON "trx_stock_telur"("id_mst_kandang");

-- CreateIndex
CREATE UNIQUE INDEX "trx_stock_telur_id_mst_kandang_tanggal_key" ON "trx_stock_telur"("id_mst_kandang", "tanggal");

-- AddForeignKey
ALTER TABLE "trx_ayam_masuk" ADD CONSTRAINT "trx_ayam_masuk_id_mst_kandang_fkey" FOREIGN KEY ("id_mst_kandang") REFERENCES "mst_kandang"("id_mst_kandang") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trx_kematian_ayam" ADD CONSTRAINT "trx_kematian_ayam_id_mst_kandang_fkey" FOREIGN KEY ("id_mst_kandang") REFERENCES "mst_kandang"("id_mst_kandang") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trx_pembelian_pakan" ADD CONSTRAINT "trx_pembelian_pakan_id_mst_jenis_pakan_fkey" FOREIGN KEY ("id_mst_jenis_pakan") REFERENCES "mst_jenis_pakan"("id_mst_jenis_pakan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trx_pemakaian_pakan_header" ADD CONSTRAINT "trx_pemakaian_pakan_header_id_mst_kandang_fkey" FOREIGN KEY ("id_mst_kandang") REFERENCES "mst_kandang"("id_mst_kandang") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trx_pemakaian_pakan_header" ADD CONSTRAINT "trx_pemakaian_pakan_header_id_mst_jenis_pakan_fkey" FOREIGN KEY ("id_mst_jenis_pakan") REFERENCES "mst_jenis_pakan"("id_mst_jenis_pakan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trx_pemakaian_pakan_detail" ADD CONSTRAINT "trx_pemakaian_pakan_detail_id_trx_pemakaian_pakan_header_fkey" FOREIGN KEY ("id_trx_pemakaian_pakan_header") REFERENCES "trx_pemakaian_pakan_header"("id_trx_pemakaian_pakan_header") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trx_pemakaian_pakan_detail" ADD CONSTRAINT "trx_pemakaian_pakan_detail_id_trx_pembelian_pakan_fkey" FOREIGN KEY ("id_trx_pembelian_pakan") REFERENCES "trx_pembelian_pakan"("id_trx_pembelian_pakan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trx_produksi_telur" ADD CONSTRAINT "trx_produksi_telur_id_mst_kandang_fkey" FOREIGN KEY ("id_mst_kandang") REFERENCES "mst_kandang"("id_mst_kandang") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trx_stock_telur" ADD CONSTRAINT "trx_stock_telur_id_mst_kandang_fkey" FOREIGN KEY ("id_mst_kandang") REFERENCES "mst_kandang"("id_mst_kandang") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trx_penjualan_telur" ADD CONSTRAINT "trx_penjualan_telur_id_mst_kandang_fkey" FOREIGN KEY ("id_mst_kandang") REFERENCES "mst_kandang"("id_mst_kandang") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trx_pengeluaran_operasional" ADD CONSTRAINT "trx_pengeluaran_operasional_id_mst_kandang_fkey" FOREIGN KEY ("id_mst_kandang") REFERENCES "mst_kandang"("id_mst_kandang") ON DELETE SET NULL ON UPDATE CASCADE;
