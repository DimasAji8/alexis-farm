import { prisma } from "@/app/api/db/prisma";

import type { CreateKematianAyamInput } from "./kematian-ayam.validation";

export class KematianAyamService {
  static async getAll() {
    return prisma.kematianRecord.findMany({
      orderBy: { tanggal: "desc" },
      include: { kandang: { select: { id: true, kode: true, nama: true, jumlahAyam: true } } },
    });
  }

  static async create(data: CreateKematianAyamInput) {
    return prisma.$transaction(async (tx) => {
      const kandang = await tx.kandang.findUnique({ where: { id: data.kandangId } });
      if (!kandang) {
        throw new Error("Kandang tidak ditemukan");
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
        },
      });

      await tx.kandang.update({
        where: { id: data.kandangId },
        data: { jumlahAyam: newJumlah },
      });

      return created;
    });
  }
}
