import { prisma } from "@/app/api/db/prisma";

import type { CreateKandangInput, UpdateKandangInput } from "./kandang.validation";

export class KandangService {
  static async getAll() {
    return prisma.kandang.findMany({
      orderBy: { kode: "asc" },
    });
  }

  static async getById(id: string) {
    const kandang = await prisma.kandang.findUnique({ where: { id } });
    if (!kandang) {
      throw new Error("Kandang tidak ditemukan");
    }
    return kandang;
  }

  static async getByKode(kode: string) {
    return prisma.kandang.findUnique({ where: { kode } });
  }

  static async create(data: CreateKandangInput) {
    const existing = await this.getByKode(data.kode);
    if (existing) {
      throw new Error("Kode kandang sudah digunakan");
    }

    return prisma.kandang.create({
      data: {
        ...data,
        jumlahAyam: 0,
      },
    });
  }

  static async update(id: string, data: UpdateKandangInput) {
    await this.getById(id);

    if (data.kode) {
      const duplicate = await prisma.kandang.findFirst({
        where: {
          kode: data.kode,
          NOT: { id },
        },
      });
      if (duplicate) {
        throw new Error("Kode kandang sudah digunakan");
      }
    }

    return prisma.kandang.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    await this.getById(id);
    return prisma.kandang.delete({ where: { id } });
  }
}
