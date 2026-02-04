import { prisma } from "@/app/api/db/prisma";
import { ValidationError } from "@/app/api/shared/utils/errors";

export async function validateKandangRelations(kandangId: string) {
  const [ayamMasuk, kematian, pemakaianPakan, produksi, stock, penjualan, pengeluaran] = await Promise.all([
    prisma.ayamMasuk.count({ where: { kandangId } }),
    prisma.kematianRecord.count({ where: { kandangId } }),
    prisma.pemakaianPakanHeader.count({ where: { kandangId } }),
    prisma.produksiTelur.count({ where: { kandangId } }),
    prisma.stockTelur.count({ where: { kandangId } }),
    prisma.penjualanTelur.count({ where: { kandangId } }),
    prisma.pengeluaranOperasional.count({ where: { kandangId } }),
  ]);

  if (ayamMasuk > 0 || kematian > 0 || pemakaianPakan > 0 || produksi > 0 || stock > 0 || penjualan > 0 || pengeluaran > 0) {
    throw new ValidationError("Kandang tidak dapat dihapus karena memiliki data transaksi terkait");
  }
}

export async function validateJenisPakanRelations(jenisPakanId: string) {
  const [pembelian, pemakaian] = await Promise.all([
    prisma.pembelianPakan.count({ where: { jenisPakanId } }),
    prisma.pemakaianPakanHeader.count({ where: { jenisPakanId } }),
  ]);

  if (pembelian > 0 || pemakaian > 0) {
    throw new ValidationError("Jenis pakan tidak dapat dihapus karena memiliki data transaksi terkait");
  }
}

export async function validatePembelianPakanRelations(pembelianPakanId: string) {
  const details = await prisma.pemakaianPakanDetail.count({ where: { pembelianPakanId } });

  if (details > 0) {
    throw new ValidationError("Pembelian pakan tidak dapat dihapus karena sudah digunakan dalam pemakaian pakan");
  }
}

export async function validatePemakaianPakanRelations(headerId: string) {
  const details = await prisma.pemakaianPakanDetail.count({ where: { headerId } });

  if (details > 0) {
    throw new ValidationError("Pemakaian pakan tidak dapat dihapus karena memiliki detail transaksi");
  }
}
