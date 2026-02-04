-- CreateTable
CREATE TABLE "trx_pemasukan" (
    "id_trx_pemasukan" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "kategori" TEXT NOT NULL,
    "jumlah" DOUBLE PRECISION NOT NULL,
    "keterangan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trx_pemasukan_pkey" PRIMARY KEY ("id_trx_pemasukan")
);

-- CreateIndex
CREATE INDEX "trx_pemasukan_tanggal_idx" ON "trx_pemasukan"("tanggal");

-- CreateIndex
CREATE INDEX "trx_pemasukan_kategori_idx" ON "trx_pemasukan"("kategori");
