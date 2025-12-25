-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'staff',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kandang" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "lokasi" TEXT,
    "jumlahAyam" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'aktif',
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kandang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JenisPakan" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "satuan" TEXT NOT NULL DEFAULT 'KG',
    "keterangan" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JenisPakan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AyamMasuk" (
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

    CONSTRAINT "AyamMasuk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KematianRecord" (
    "id" TEXT NOT NULL,
    "kandangId" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "jumlahMati" INTEGER NOT NULL,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KematianRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PembelianPakan" (
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

    CONSTRAINT "PembelianPakan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PemakaianPakan" (
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

    CONSTRAINT "PemakaianPakan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProduksiTelur" (
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

    CONSTRAINT "ProduksiTelur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockTelur" (
    "id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "stockButir" INTEGER NOT NULL,
    "stockKg" DOUBLE PRECISION NOT NULL,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockTelur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenjualanTelur" (
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

    CONSTRAINT "PenjualanTelur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransaksiKeuangan" (
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

    CONSTRAINT "TransaksiKeuangan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PengeluaranOperasional" (
    "id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "kategori" TEXT NOT NULL,
    "jumlah" DOUBLE PRECISION NOT NULL,
    "keterangan" TEXT NOT NULL,
    "bukti" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PengeluaranOperasional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaporanBulanan" (
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

    CONSTRAINT "LaporanBulanan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Kandang_kode_key" ON "Kandang"("kode");

-- CreateIndex
CREATE INDEX "Kandang_kode_idx" ON "Kandang"("kode");

-- CreateIndex
CREATE INDEX "Kandang_status_idx" ON "Kandang"("status");

-- CreateIndex
CREATE UNIQUE INDEX "JenisPakan_kode_key" ON "JenisPakan"("kode");

-- CreateIndex
CREATE INDEX "JenisPakan_kode_idx" ON "JenisPakan"("kode");

-- CreateIndex
CREATE INDEX "AyamMasuk_kandangId_idx" ON "AyamMasuk"("kandangId");

-- CreateIndex
CREATE INDEX "AyamMasuk_tanggal_idx" ON "AyamMasuk"("tanggal");

-- CreateIndex
CREATE INDEX "KematianRecord_kandangId_idx" ON "KematianRecord"("kandangId");

-- CreateIndex
CREATE INDEX "KematianRecord_tanggal_idx" ON "KematianRecord"("tanggal");

-- CreateIndex
CREATE INDEX "PembelianPakan_jenisPakanId_idx" ON "PembelianPakan"("jenisPakanId");

-- CreateIndex
CREATE INDEX "PembelianPakan_tanggalBeli_idx" ON "PembelianPakan"("tanggalBeli");

-- CreateIndex
CREATE INDEX "PemakaianPakan_kandangId_idx" ON "PemakaianPakan"("kandangId");

-- CreateIndex
CREATE INDEX "PemakaianPakan_jenisPakanId_idx" ON "PemakaianPakan"("jenisPakanId");

-- CreateIndex
CREATE INDEX "PemakaianPakan_tanggalPakai_idx" ON "PemakaianPakan"("tanggalPakai");

-- CreateIndex
CREATE INDEX "ProduksiTelur_kandangId_idx" ON "ProduksiTelur"("kandangId");

-- CreateIndex
CREATE INDEX "ProduksiTelur_tanggal_idx" ON "ProduksiTelur"("tanggal");

-- CreateIndex
CREATE UNIQUE INDEX "ProduksiTelur_kandangId_tanggal_key" ON "ProduksiTelur"("kandangId", "tanggal");

-- CreateIndex
CREATE INDEX "StockTelur_tanggal_idx" ON "StockTelur"("tanggal");

-- CreateIndex
CREATE UNIQUE INDEX "PenjualanTelur_nomorTransaksi_key" ON "PenjualanTelur"("nomorTransaksi");

-- CreateIndex
CREATE INDEX "PenjualanTelur_tanggal_idx" ON "PenjualanTelur"("tanggal");

-- CreateIndex
CREATE INDEX "PenjualanTelur_pembeli_idx" ON "PenjualanTelur"("pembeli");

-- CreateIndex
CREATE INDEX "TransaksiKeuangan_tanggal_idx" ON "TransaksiKeuangan"("tanggal");

-- CreateIndex
CREATE INDEX "TransaksiKeuangan_jenis_idx" ON "TransaksiKeuangan"("jenis");

-- CreateIndex
CREATE INDEX "TransaksiKeuangan_kategori_idx" ON "TransaksiKeuangan"("kategori");

-- CreateIndex
CREATE INDEX "PengeluaranOperasional_tanggal_idx" ON "PengeluaranOperasional"("tanggal");

-- CreateIndex
CREATE INDEX "PengeluaranOperasional_kategori_idx" ON "PengeluaranOperasional"("kategori");

-- CreateIndex
CREATE INDEX "LaporanBulanan_tahun_bulan_idx" ON "LaporanBulanan"("tahun", "bulan");

-- CreateIndex
CREATE UNIQUE INDEX "LaporanBulanan_bulan_tahun_key" ON "LaporanBulanan"("bulan", "tahun");

-- AddForeignKey
ALTER TABLE "AyamMasuk" ADD CONSTRAINT "AyamMasuk_kandangId_fkey" FOREIGN KEY ("kandangId") REFERENCES "Kandang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KematianRecord" ADD CONSTRAINT "KematianRecord_kandangId_fkey" FOREIGN KEY ("kandangId") REFERENCES "Kandang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PembelianPakan" ADD CONSTRAINT "PembelianPakan_jenisPakanId_fkey" FOREIGN KEY ("jenisPakanId") REFERENCES "JenisPakan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PemakaianPakan" ADD CONSTRAINT "PemakaianPakan_kandangId_fkey" FOREIGN KEY ("kandangId") REFERENCES "Kandang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PemakaianPakan" ADD CONSTRAINT "PemakaianPakan_jenisPakanId_fkey" FOREIGN KEY ("jenisPakanId") REFERENCES "JenisPakan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PemakaianPakan" ADD CONSTRAINT "PemakaianPakan_pembelianPakanId_fkey" FOREIGN KEY ("pembelianPakanId") REFERENCES "PembelianPakan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProduksiTelur" ADD CONSTRAINT "ProduksiTelur_kandangId_fkey" FOREIGN KEY ("kandangId") REFERENCES "Kandang"("id") ON DELETE CASCADE ON UPDATE CASCADE;
