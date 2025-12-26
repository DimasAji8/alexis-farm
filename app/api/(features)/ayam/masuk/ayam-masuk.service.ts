import { prisma } from "@/app/api/db/prisma";

import type { CreateAyamMasukInput } from "./ayam-masuk.validation";

export class AyamMasukService {
  static async getAll() {
    return prisma.ayamMasuk.findMany({
      orderBy: { tanggal: "desc" },
      include: { kandang: { select: { id: true, kode: true, nama: true } } },
    });
  }

  static async create(data: CreateAyamMasukInput) {
    return prisma.$transaction(async (tx) => {
      const kandang = await tx.kandang.findUnique({ where: { id: data.kandangId } });
      if (!kandang) {
        throw new Error("Kandang tidak ditemukan");
      }

      const created = await tx.ayamMasuk.create({
        data: {
          kandangId: data.kandangId,
          tanggal: data.tanggal,
          jumlahAyam: data.jumlahAyam,
        },
      });

      await tx.kandang.update({
        where: { id: data.kandangId },
        data: { jumlahAyam: kandang.jumlahAyam + data.jumlahAyam },
      });

      return created;
    });
  }
}
