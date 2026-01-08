import { prisma } from "@/app/api/db/prisma";

import { requireRole } from "@/app/api/shared/utils/auth-guard";
import { NotFoundError, ValidationError } from "@/app/api/shared/utils/errors";
import type {
  CreateKematianAyamInput,
  UpdateKematianAyamInput,
} from "./kematian-ayam.validation";

export class KematianAyamService {
  static async getAll() {
    return prisma.kematianRecord.findMany({
      orderBy: { tanggal: "desc" },
      include: { kandang: { select: { id: true, kode: true, nama: true, jumlahAyam: true } } },
    });
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
      } else {
        // kembalikan ke kandang lama
        await tx.kandang.update({
          where: { id: existing.kandangId },
          data: { jumlahAyam: oldKandang.jumlahAyam + existing.jumlahMati },
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
      await tx.kandang.update({
        where: { id: existing.kandangId },
        data: { jumlahAyam: kandang.jumlahAyam + existing.jumlahMati },
      });

      return tx.kematianRecord.delete({ where: { id } });
    });
  }
}
