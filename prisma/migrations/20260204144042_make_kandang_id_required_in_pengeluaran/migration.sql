/*
  Warnings:

  - Made the column `id_mst_kandang` on table `trx_pengeluaran_operasional` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "trx_pengeluaran_operasional" DROP CONSTRAINT "trx_pengeluaran_operasional_id_mst_kandang_fkey";

-- AlterTable
ALTER TABLE "trx_pengeluaran_operasional" ALTER COLUMN "id_mst_kandang" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "trx_pengeluaran_operasional" ADD CONSTRAINT "trx_pengeluaran_operasional_id_mst_kandang_fkey" FOREIGN KEY ("id_mst_kandang") REFERENCES "mst_kandang"("id_mst_kandang") ON DELETE RESTRICT ON UPDATE CASCADE;
