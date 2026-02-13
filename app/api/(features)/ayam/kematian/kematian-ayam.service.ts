import { prisma } from "@/app/api/db/prisma";

import { requireRole } from "@/app/api/shared/utils/auth-guard";
import { NotFoundError, ValidationError } from "@/app/api/shared/utils/errors";
import type {
  CreateKematianAyamInput,
  UpdateKematianAyamInput,
} from "./kematian-ayam.validation";

export class KematianAyamService {
  static async getAll(kandangId?: string, bulan?: string) {
    const where: any = kandangId ? { kandangId } : {};
    
    if (bulan) {
      const [year, month] = bulan.split("-");
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      where.tanggal = { gte: startDate, lte: endDate };
    }
    
    return prisma.kematianRecord.findMany({
      where,
      orderBy: { tanggal: "asc" },
      include: { kandang: { select: { id: true, kode: true, nama: true, jumlahAyam: true } } },
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

    const data = await prisma.kematianRecord.findMany({ where });
    const kandang = await prisma.kandang.findUnique({ where: { id: kandangId } });
    
    const totalKematianBulanIni = data.reduce((sum, item) => sum + item.jumlahMati, 0);
    const jumlahAyamSekarang = kandang?.jumlahAyam || 0;
    
    // Hitung total kematian keseluruhan untuk persentase
    const allData = await prisma.kematianRecord.findMany({ where: { kandangId } });
    const totalKematianKeseluruhan = allData.reduce((sum, item) => sum + item.jumlahMati, 0);
    const totalAyamAwal = jumlahAyamSekarang + totalKematianKeseluruhan;
    const persentaseKematian = totalAyamAwal > 0 ? (totalKematianKeseluruhan / totalAyamAwal) * 100 : 0;
    
    const jumlahHari = data.length;
    const rataRataPerHari = jumlahHari > 0 ? totalKematianBulanIni / jumlahHari : 0;

    return {
      totalKematian: totalKematianBulanIni, // Total sesuai filter
      totalKematianBulanIni,
      persentaseKematian: parseFloat(persentaseKematian.toFixed(2)),
      rataRataPerHari: parseFloat(rataRataPerHari.toFixed(1)),
    };
  }

  static async create(data: CreateKematianAyamInput) {
    const userId = await requireRole(["super_user", "staff"]);
    return prisma.$transaction(async (tx) => {
      const kandang = await tx.kandang.findUnique({ where: { id: data.kandangId } });
      if (!kandang) {
        throw new NotFoundError("Kandang tidak ditemukan");
      }

      const newJumlah = kandang.jumlahAyam - data.jumlahMati;
      if (newJumlah < 0) {
        throw new Error("Jumlah ayam tidak boleh negatif");
      }

      const created = await tx.kematianRecord.create({
        data: {
          kandangId: data.kandangId,
          tanggal: data.tanggal,
          jumlahMati: data.jumlahMati,
          keterangan: data.keterangan,
          createdBy: userId,
        },
      });

      await tx.kandang.update({
        where: { id: data.kandangId },
        data: { jumlahAyam: newJumlah },
      });

      // Update semua produksi telur di tanggal yang sama dan setelahnya
      await tx.produksiTelur.updateMany({
        where: {
          kandangId: data.kandangId,
          tanggal: { gte: data.tanggal },
        },
        data: { jumlahAyam: newJumlah },
      });

      return created;
    });
  }

  static async update(id: string, data: UpdateKematianAyamInput) {
    const userId = await requireRole(["super_user", "staff"]);
    return prisma.$transaction(async (tx) => {
      const existing = await tx.kematianRecord.findUnique({ where: { id } });
      if (!existing) {
        throw new Error("Catatan kematian tidak ditemukan");
      }

      const newKandangId = data.kandangId ?? existing.kandangId;
      const newJumlah = data.jumlahMati ?? existing.jumlahMati;

      const oldKandang = await tx.kandang.findUnique({ where: { id: existing.kandangId } });
      if (!oldKandang) {
        throw new NotFoundError("Kandang lama tidak ditemukan");
      }
      const newKandang = await tx.kandang.findUnique({ where: { id: newKandangId } });
      if (!newKandang) {
        throw new NotFoundError("Kandang baru tidak ditemukan");
      }

      if (existing.kandangId === newKandangId) {
        const newJumlahKandang = oldKandang.jumlahAyam + existing.jumlahMati - newJumlah;
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
        // kembalikan ke kandang lama
        const restoredJumlah = oldKandang.jumlahAyam + existing.jumlahMati;
        await tx.kandang.update({
          where: { id: existing.kandangId },
          data: { jumlahAyam: restoredJumlah },
        });
        
        // Update produksi telur kandang lama
        await tx.produksiTelur.updateMany({
          where: {
            kandangId: existing.kandangId,
            tanggal: { gte: existing.tanggal },
          },
          data: { jumlahAyam: restoredJumlah },
        });

        // kurangi dari kandang baru
        const newJumlahKandang = newKandang.jumlahAyam - newJumlah;
        if (newJumlahKandang < 0) {
          throw new Error("Jumlah ayam tidak boleh negatif");
        }
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

      return tx.kematianRecord.update({
        where: { id },
        data: {
          kandangId: newKandangId,
          tanggal: data.tanggal ?? existing.tanggal,
          jumlahMati: newJumlah,
          keterangan: data.keterangan ?? existing.keterangan,
          updatedBy: userId,
        },
      });
    });
  }

  static async delete(id: string) {
    await requireRole(["super_user", "staff"]);
    return prisma.$transaction(async (tx) => {
      const existing = await tx.kematianRecord.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundError("Catatan kematian tidak ditemukan");
      }

      const kandang = await tx.kandang.findUnique({ where: { id: existing.kandangId } });
      if (!kandang) {
        throw new NotFoundError("Kandang tidak ditemukan");
      }

      // Kembalikan jumlah ayam yang mati
      const restoredJumlah = kandang.jumlahAyam + existing.jumlahMati;
      await tx.kandang.update({
        where: { id: existing.kandangId },
        data: { jumlahAyam: restoredJumlah },
      });

      // Update produksi telur di tanggal yang sama dan setelahnya
      await tx.produksiTelur.updateMany({
        where: {
          kandangId: existing.kandangId,
          tanggal: { gte: existing.tanggal },
        },
        data: { jumlahAyam: restoredJumlah },
      });

      return tx.kematianRecord.delete({ where: { id } });
    });
  }
}
