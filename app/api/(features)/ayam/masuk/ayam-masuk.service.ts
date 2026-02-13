import { prisma } from "@/app/api/db/prisma";

import { requireRole } from "@/app/api/shared/utils/auth-guard";
import { NotFoundError, ValidationError } from "@/app/api/shared/utils/errors";
import type { CreateAyamMasukInput, UpdateAyamMasukInput } from "./ayam-masuk.validation";

export class AyamMasukService {
  static async getAll(kandangId?: string, bulan?: string) {
    const where: any = kandangId ? { kandangId } : {};
    
    if (bulan) {
      const [year, month] = bulan.split("-");
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      where.tanggal = { gte: startDate, lte: endDate };
    }

    return prisma.ayamMasuk.findMany({
      where,
      orderBy: { tanggal: "asc" },
      include: { kandang: { select: { id: true, kode: true, nama: true } } },
    });
  }

  static async getSummary(kandangId: string, bulan?: string) {
    const where: any = { kandangId };
    
    if (bulan) {
      const [year, month] = bulan.split("-");
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      where.tanggal = { gte: startDate, lte: endDate };
    }

    const data = await prisma.ayamMasuk.findMany({ where });
    
    const totalMasukBulanIni = data.reduce((sum, item) => sum + item.jumlahAyam, 0);
    const jumlahHari = data.length;
    const rataRataPerHari = jumlahHari > 0 ? totalMasukBulanIni / jumlahHari : 0;
    const totalTransaksi = data.length;

    return {
      totalMasuk: totalMasukBulanIni, // Total sesuai filter
      totalMasukBulanIni,
      rataRataPerHari: parseFloat(rataRataPerHari.toFixed(1)),
      totalTransaksi,
    };
  }

  static async create(data: CreateAyamMasukInput) {
    const userId = await requireRole(["super_user", "staff"]);
    return prisma.$transaction(async (tx) => {
      const kandang = await tx.kandang.findUnique({ where: { id: data.kandangId } });
      if (!kandang) {
        throw new NotFoundError("Kandang tidak ditemukan");
      }

      const created = await tx.ayamMasuk.create({
        data: {
          kandangId: data.kandangId,
          tanggal: data.tanggal,
          jumlahAyam: data.jumlahAyam,
          createdBy: userId,
        },
      });

      const newJumlahKandang = kandang.jumlahAyam + data.jumlahAyam;
      await tx.kandang.update({
        where: { id: data.kandangId },
        data: { jumlahAyam: newJumlahKandang },
      });

      // Update semua produksi telur di tanggal yang sama dan setelahnya
      await tx.produksiTelur.updateMany({
        where: {
          kandangId: data.kandangId,
          tanggal: { gte: data.tanggal },
        },
        data: { jumlahAyam: newJumlahKandang },
      });

      return created;
    });
  }

  static async update(id: string, data: UpdateAyamMasukInput) {
    const userId = await requireRole(["super_user", "staff"]);
    return prisma.$transaction(async (tx) => {
      const existing = await tx.ayamMasuk.findUnique({ where: { id } });
      if (!existing) {
        throw new Error("Ayam masuk tidak ditemukan");
      }

      const newKandangId = data.kandangId ?? existing.kandangId;
      const newJumlah = data.jumlahAyam ?? existing.jumlahAyam;

      const oldKandang = await tx.kandang.findUnique({ where: { id: existing.kandangId } });
      if (!oldKandang) {
        throw new NotFoundError("Kandang lama tidak ditemukan");
      }

      const newKandang = await tx.kandang.findUnique({ where: { id: newKandangId } });
      if (!newKandang) {
        throw new NotFoundError("Kandang baru tidak ditemukan");
      }

      if (existing.kandangId === newKandangId) {
        const newJumlahKandang = oldKandang.jumlahAyam - existing.jumlahAyam + newJumlah;
        if (newJumlahKandang < 0) {
          throw new Error("Jumlah ayam tidak boleh negatif");
        }
        await tx.kandang.update({
          where: { id: existing.kandangId },
          data: { jumlahAyam: newJumlahKandang },
        });

        // Update produksi telur di tanggal yang sama dan setelahnya
        await tx.produksiTelur.updateMany({
          where: {
            kandangId: existing.kandangId,
            tanggal: { gte: data.tanggal ?? existing.tanggal },
          },
          data: { jumlahAyam: newJumlahKandang },
        });
      } else {
        const oldJumlahKandang = oldKandang.jumlahAyam - existing.jumlahAyam;
        if (oldJumlahKandang < 0) {
          throw new Error("Jumlah ayam tidak boleh negatif");
        }
        await tx.kandang.update({
          where: { id: existing.kandangId },
          data: { jumlahAyam: oldJumlahKandang },
        });

        // Update produksi telur kandang lama
        await tx.produksiTelur.updateMany({
          where: {
            kandangId: existing.kandangId,
            tanggal: { gte: existing.tanggal },
          },
          data: { jumlahAyam: oldJumlahKandang },
        });

        const newJumlahKandang = newKandang.jumlahAyam + newJumlah;
        await tx.kandang.update({
          where: { id: newKandangId },
          data: { jumlahAyam: newJumlahKandang },
        });

        // Update produksi telur kandang baru
        await tx.produksiTelur.updateMany({
          where: {
            kandangId: newKandangId,
            tanggal: { gte: data.tanggal ?? existing.tanggal },
          },
          data: { jumlahAyam: newJumlahKandang },
        });
      }

      return tx.ayamMasuk.update({
        where: { id },
        data: {
          kandangId: newKandangId,
          tanggal: data.tanggal ?? existing.tanggal,
          jumlahAyam: newJumlah,
          updatedBy: userId,
        },
      });
    });
  }

  static async delete(id: string) {
    await requireRole(["super_user", "staff"]);
    return prisma.$transaction(async (tx) => {
      const existing = await tx.ayamMasuk.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundError("Ayam masuk tidak ditemukan");
      }

      const kandang = await tx.kandang.findUnique({ where: { id: existing.kandangId } });
      if (!kandang) {
        throw new NotFoundError("Kandang tidak ditemukan");
      }

      const newJumlah = kandang.jumlahAyam - existing.jumlahAyam;
      if (newJumlah < 0) {
        throw new ValidationError("Jumlah ayam tidak boleh negatif");
      }

      await tx.kandang.update({
        where: { id: existing.kandangId },
        data: { jumlahAyam: newJumlah },
      });

      // Update produksi telur di tanggal yang sama dan setelahnya
      await tx.produksiTelur.updateMany({
        where: {
          kandangId: existing.kandangId,
          tanggal: { gte: existing.tanggal },
        },
        data: { jumlahAyam: newJumlah },
      });

      return tx.ayamMasuk.delete({ where: { id } });
    });
  }
}
