import { prisma } from "@/app/api/db/prisma";

import { requireRole } from "@/app/api/shared/utils/auth-guard";
import { NotFoundError, ValidationError } from "@/app/api/shared/utils/errors";
import type { CreatePemakaianPakanInput, UpdatePemakaianPakanInput } from "./pemakaian.validation";

export class PemakaianPakanService {
  static async getAll() {
    return prisma.pemakaianPakan.findMany({
      orderBy: { tanggalPakai: "asc" },
      include: {
        jenisPakan: { select: { id: true, kode: true, nama: true, satuan: true } },
        kandang: { select: { id: true, kode: true, nama: true } },
        pembelianPakan: { select: { id: true, tanggalBeli: true, hargaPerKg: true } },
      },
    });
  }

  static async create(data: CreatePemakaianPakanInput) {
    const userId = await requireRole(["super_user", "staff"]);
    return prisma.$transaction(async (tx) => {
      const pembelian = await tx.pembelianPakan.findUnique({
        where: { id: data.pembelianPakanId },
      });

      if (!pembelian) {
        throw new NotFoundError("Batch pembelian pakan tidak ditemukan");
      }

      if (pembelian.jenisPakanId !== data.jenisPakanId) {
        throw new ValidationError("Jenis pakan tidak sesuai dengan batch pembelian");
      }

      if (pembelian.sisaStokKg < data.jumlahKg) {
        throw new ValidationError("Stok pakan tidak cukup untuk pemakaian ini");
      }

      const hargaPerKg = data.hargaPerKg ?? pembelian.hargaPerKg;
      const totalBiaya = hargaPerKg * data.jumlahKg;

      const kandang = await tx.kandang.findUnique({ where: { id: data.kandangId } });
      if (!kandang) {
        throw new NotFoundError("Kandang tidak ditemukan");
      }

      const created = await tx.pemakaianPakan.create({
        data: {
          kandangId: data.kandangId,
          jenisPakanId: data.jenisPakanId,
          pembelianPakanId: data.pembelianPakanId,
          tanggalPakai: data.tanggalPakai,
          jumlahKg: data.jumlahKg,
          hargaPerKg,
          totalBiaya,
          keterangan: data.keterangan,
          createdBy: userId,
        },
      });

      await tx.pembelianPakan.update({
        where: { id: data.pembelianPakanId },
        data: { sisaStokKg: pembelian.sisaStokKg - data.jumlahKg },
      });

      return created;
    });
  }

  static async update(id: string, data: UpdatePemakaianPakanInput) {
    const userId = await requireRole(["super_user", "staff"]);
    return prisma.$transaction(async (tx) => {
      const existing = await tx.pemakaianPakan.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundError("Pemakaian pakan tidak ditemukan");
      }

      const targetBatchId = data.pembelianPakanId ?? existing.pembelianPakanId;
      const targetBatch = await tx.pembelianPakan.findUnique({ where: { id: targetBatchId } });
      if (!targetBatch) {
        throw new NotFoundError("Batch pembelian pakan tidak ditemukan");
      }

      const targetJenisPakanId = data.jenisPakanId ?? existing.jenisPakanId;
      if (targetBatch.jenisPakanId !== targetJenisPakanId) {
        throw new ValidationError("Jenis pakan tidak sesuai dengan batch pembelian");
      }

      // Hitung saldo stok jika batch berubah
      if (targetBatchId !== existing.pembelianPakanId) {
        // kembalikan stok ke batch lama
        await tx.pembelianPakan.update({
          where: { id: existing.pembelianPakanId },
          data: { sisaStokKg: { increment: existing.jumlahKg } },
        });
        // pakai stok dari batch baru
        if (targetBatch.sisaStokKg < (data.jumlahKg ?? existing.jumlahKg)) {
          throw new ValidationError("Stok batch baru tidak cukup");
        }
        await tx.pembelianPakan.update({
          where: { id: targetBatchId },
          data: { sisaStokKg: { decrement: data.jumlahKg ?? existing.jumlahKg } },
        });
      } else {
        // batch sama, sesuaikan delta
        const newJumlah = data.jumlahKg ?? existing.jumlahKg;
        const delta = newJumlah - existing.jumlahKg;
        if (delta > 0 && targetBatch.sisaStokKg < delta) {
          throw new ValidationError("Stok batch tidak cukup untuk penyesuaian");
        }
        await tx.pembelianPakan.update({
          where: { id: targetBatchId },
          data: { sisaStokKg: { decrement: delta } },
        });
      }

      const hargaPerKg = data.hargaPerKg ?? existing.hargaPerKg ?? targetBatch.hargaPerKg;
      const jumlahKg = data.jumlahKg ?? existing.jumlahKg;
      const totalBiaya = hargaPerKg * jumlahKg;

      const kandangId = data.kandangId ?? existing.kandangId;
      const kandang = await tx.kandang.findUnique({ where: { id: kandangId } });
      if (!kandang) {
        throw new NotFoundError("Kandang tidak ditemukan");
      }

      return tx.pemakaianPakan.update({
        where: { id },
        data: {
          kandangId,
          jenisPakanId: targetJenisPakanId,
          pembelianPakanId: targetBatchId,
          tanggalPakai: data.tanggalPakai ?? existing.tanggalPakai,
          jumlahKg,
          hargaPerKg,
          totalBiaya,
          keterangan: data.keterangan ?? existing.keterangan,
          updatedBy: userId,
        },
      });
    });
  }
}
